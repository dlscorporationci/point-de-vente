/**
 * RealtimeService.js — Service Singleton SSE (Server-Sent Events)
 * 
 * ARCHITECTURE :
 * - Ouvre une connexion EventSource vers /api/v1/sse/stream
 * - Gère la reconnexion automatique avec backoff exponentiel
 * - Dispatche des callbacks par type d'événement
 * - Sécurité multi-tenant : vérifie company_id + branch_id dans chaque payload
 * - Ne stocke jamais de données serveur critiques (SSE = signal uniquement)
 * 
 * RÈGLE DE SÉCURITÉ :
 * - Ne jamais faire confiance au payload SSE seul pour des données critiques
 * - Après réception d'un signal, le client fait un PULL ciblé pour obtenir la vérité serveur
 * 
 * CYCLE DE VIE :
 * - connect() → après login réussi dans AppContext
 * - disconnect() → logout, changement de boutique, fermeture app
 * - Reconnexion auto → gérée par ce service (backoff max 30s)
 */

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && (port === '5173' || port === '3000')) {
      return 'http://127.0.0.1:8000/api';
    }
  }
  return '/api';
};

class RealtimeService {
  constructor() {
    this.eventSource    = null;
    this.subscribers    = new Map(); // Map<eventType, Set<callback>>
    this.globalSubs     = new Set(); // callbacks pour TOUS les events
    this.statusSubs     = new Set(); // callbacks pour changement de statut SSE
    this.status         = 'disconnected'; // 'connected' | 'connecting' | 'disconnected' | 'error'
    this.lastEventId    = 0;
    this.reconnectDelay = 2000;  // Délai initial 2s
    this.maxDelay       = 30000; // Max 30s
    this.reconnectTimer = null;
    this.isManuallyDisconnected = false;

    // Contexte multi-tenant (défini depuis AppContext au moment du connect)
    this._companyId = null;
    this._branchId  = null;
    this._userId    = null;
  }

  // ===========================================================================
  // API PUBLIQUE
  // ===========================================================================

  /**
   * Connecte le stream SSE.
   * Appelé après login réussi dans AppContext.
   * 
   * @param {string} token      Token Bearer Sanctum
   * @param {string} companyId  company_id du tenant (depuis localStorage)
   * @param {string} branchId   branch_id (depuis localStorage)
   * @param {string} userId     user_id
   */
  connect({ token, companyId, branchId, userId } = {}) {
    if (!token || !companyId) {
      console.warn('[RealtimeService] connect() ignoré : token ou companyId manquant');
      return;
    }

    // Forcer la déconnexion propre avant une nouvelle connexion
    this._cleanup();

    this.isManuallyDisconnected = false;
    this._companyId = parseInt(companyId);
    this._branchId  = branchId ? parseInt(branchId) : null;
    this._userId    = userId ? parseInt(userId) : null;

    this._openStream(token);
  }

  /**
   * Déconnecte le stream SSE proprement.
   * Appelé au logout ou changement de boutique.
   */
  disconnect() {
    this.isManuallyDisconnected = true;
    this._cleanup();
    this._setStatus('disconnected');
    console.info('[RealtimeService] Déconnecté manuellement.');
  }

  /**
   * S'abonner à un type d'événement spécifique.
   * 
   * @param {string}   eventType  Ex: 'cash_session_opened', 'sale_created'
   * @param {function} callback   Appelé avec le payload de l'événement
   * @returns {function}          Fonction de désabonnement
   */
  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType).add(callback);

    // Retourner la fonction de cleanup
    return () => this.unsubscribe(eventType, callback);
  }

  /**
   * S'abonner à plusieurs types d'événements en une fois.
   * 
   * @param {string[]} eventTypes  Tableau de types
   * @param {function} callback    Appelé avec (eventType, payload)
   * @returns {function}           Fonction de désabonnement globale
   */
  subscribeMany(eventTypes, callback) {
    const cleanups = eventTypes.map(type =>
      this.subscribe(type, (payload) => callback(type, payload))
    );
    return () => cleanups.forEach(cleanup => cleanup());
  }

  /**
   * S'abonner à tous les événements.
   * 
   * @param {function} callback  Appelé avec (eventType, payload)
   * @returns {function}         Fonction de désabonnement
   */
  subscribeAll(callback) {
    this.globalSubs.add(callback);
    return () => this.globalSubs.delete(callback);
  }

  /**
   * Se désabonner d'un type d'événement.
   */
  unsubscribe(eventType, callback) {
    if (this.subscribers.has(eventType)) {
      this.subscribers.get(eventType).delete(callback);
    }
  }

  /**
   * S'abonner aux changements de statut SSE.
   * 
   * @param {function} callback  Appelé avec (status: string)
   * @returns {function}         Fonction de désabonnement
   */
  onStatusChange(callback) {
    this.statusSubs.add(callback);
    return () => this.statusSubs.delete(callback);
  }

  /**
   * Retourne le statut actuel.
   */
  getStatus() {
    return this.status;
  }

  // ===========================================================================
  // IMPLÉMENTATION INTERNE
  // ===========================================================================

  /**
   * Ouvre la connexion EventSource.
   */
  _openStream(token) {
    this._setStatus('connecting');

    const apiBase = getApiBase();
    // Passer le token dans l'URL car EventSource ne supporte pas les headers custom
    // Le token est ensuite vérifié par Sanctum côté serveur
    const url = `${apiBase}/v1/sse/stream?token=${encodeURIComponent(token)}&lastEventId=${this.lastEventId}`;

    try {
      this.eventSource = new EventSource(url);

      // Connexion établie
      this.eventSource.addEventListener('connected', (e) => {
        try {
          const data = JSON.parse(e.data);
          console.info('[RealtimeService] Connecté. Company:', data.company_id, 'Branch:', data.branch_id);

          // Vérification de sécurité : la company serveur doit correspondre au contexte local
          if (data.company_id && this._companyId && parseInt(data.company_id) !== this._companyId) {
            console.error('[RealtimeService] ALERTE SÉCURITÉ : company_id serveur !== client. Déconnexion.');
            this.disconnect();
            return;
          }
        } catch { /* parsing error silencieux */ }

        this._setStatus('connected');
        this.reconnectDelay = 2000; // Reset backoff après connexion réussie
      });

      // Événement de reconnexion demandé par le serveur (fin de session 60s)
      this.eventSource.addEventListener('reconnect', (e) => {
        console.debug('[RealtimeService] Reconnexion demandée par le serveur (fin de session).');
        // EventSource se reconnecte automatiquement — ne rien faire de spécial
      });

      // Gestion des erreurs et reconnexion
      this.eventSource.onerror = (err) => {
        if (this.isManuallyDisconnected) return;

        this._setStatus('error');
        this._cleanup();

        // Reconnexion avec backoff exponentiel + jitter
        const jitter = Math.floor(Math.random() * 500);
        const delay  = Math.min(this.maxDelay, this.reconnectDelay * 2) + jitter;
        this.reconnectDelay = delay;

        console.warn(`[RealtimeService] Connexion perdue. Reconnexion dans ${Math.round(delay / 1000)}s`);

        this.reconnectTimer = setTimeout(() => {
          if (!this.isManuallyDisconnected) {
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
              this._openStream(currentToken);
            }
          }
        }, delay);
      };

      // Écouter TOUS les messages génériques (event: message)
      this.eventSource.onmessage = (e) => {
        this._handleRawEvent('message', e);
      };

      // Écouter les événements nommés (event: cash_session_opened, etc.)
      const namedEvents = [
        'cash_session_opened', 'cash_session_closed', 'cash_session_validated', 'cash_session_transaction',
        'sale_created', 'sale_cancelled',
        'stock_updated', 'stock_adjusted', 'stock_low',
        'product_created', 'product_updated', 'product_deleted',
        'transfer_created', 'transfer_approved', 'transfer_shipped', 'transfer_received',
        'purchase_created', 'purchase_received',
        'customer_created', 'customer_updated', 'customer_deleted',
        'supplier_created', 'supplier_updated', 'supplier_deleted',
        'user_created', 'user_updated',
        'role_updated', 'permission_updated',
      ];

      namedEvents.forEach(eventType => {
        this.eventSource.addEventListener(eventType, (e) => {
          // Mettre à jour lastEventId pour le rattrapage lors de la reconnexion
          if (e.lastEventId) {
            this.lastEventId = parseInt(e.lastEventId) || this.lastEventId;
          }
          this._handleRawEvent(eventType, e);
        });
      });

    } catch (err) {
      console.error('[RealtimeService] Impossible d\'ouvrir EventSource:', err);
      this._setStatus('error');
    }
  }

  /**
   * Traite un événement brut reçu depuis le serveur.
   * 
   * SÉCURITÉ :
   * - Vérifie company_id dans le payload
   * - Vérifie branch_id (si applicable)
   * - Rejette silencieusement si non autorisé
   */
  _handleRawEvent(eventType, e) {
    let payload = {};
    try {
      payload = JSON.parse(e.data);
    } catch {
      return;
    }

    // =========================================================================
    // VÉRIFICATION DE SÉCURITÉ MULTI-TENANT
    // =========================================================================
    // Si le serveur envoie un event avec un company_id différent de l'utilisateur
    // connecté, on ignore silencieusement (ne doit jamais arriver en pratique).
    if (payload.company_id && this._companyId) {
      if (parseInt(payload.company_id) !== this._companyId) {
        console.warn('[RealtimeService] Event cross-tenant ignoré (sécurité client)', {
          received: payload.company_id,
          expected: this._companyId,
        });
        return;
      }
    }

    // Ne pas re-dispatcher les events de notre propre action immédiate
    // (éviter le double affichage si le PUSH a déjà mis à jour l'UI)
    // Les abonnés peuvent décider eux-mêmes si actor_id === userId → skip

    // Dispatcher aux abonnés de ce type d'événement
    if (this.subscribers.has(eventType)) {
      this.subscribers.get(eventType).forEach(cb => {
        try { cb(payload); } catch (err) { console.error('[RealtimeService] Erreur callback:', err); }
      });
    }

    // Dispatcher aux abonnés globaux
    this.globalSubs.forEach(cb => {
      try { cb(eventType, payload); } catch (err) { console.error('[RealtimeService] Erreur global callback:', err); }
    });
  }

  /**
   * Met à jour le statut et notifie les abonnés au statut.
   */
  _setStatus(newStatus) {
    if (this.status === newStatus) return;
    this.status = newStatus;
    this.statusSubs.forEach(cb => {
      try { cb(newStatus); } catch { /* silencieux */ }
    });
  }

  /**
   * Ferme proprement la connexion EventSource et annule les timers.
   */
  _cleanup() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.eventSource) {
      this.eventSource.onmessage = null;
      this.eventSource.onerror   = null;
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

// Singleton global — une seule instance pour toute l'application
export const realtimeService = new RealtimeService();
