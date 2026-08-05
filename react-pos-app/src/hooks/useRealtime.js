import { useEffect, useCallback, useRef } from 'react';
import { realtimeService } from '../services/RealtimeService';
import { syncService } from '../services/SyncService';
import { db } from '../services/db';

/**
 * useRealtime — Hook React pour s'abonner aux événements SSE temps réel
 * 
 * FONCTIONNEMENT :
 * 1. S'abonne aux eventTypes spécifiés via RealtimeService
 * 2. Reçoit le signal SSE
 * 3. Lance un PULL ciblé via SyncService (serveur = source de vérité)
 * 4. Met à jour Dexie via les données officielles du serveur
 * 5. Déclenche le callback pour actualiser le React state
 * 6. Nettoie l'abonnement au démontage du composant
 * 
 * ANTI-BOUCLE :
 * - Les mises à jour venant du PULL sont "server-originated" → pas renvoyées via PUSH
 * - Debounce de 300ms pour éviter les PULL répétitifs sur événements groupés
 * 
 * @param {string[]} eventTypes       Types d'événements à écouter
 * @param {function} onEvent          Callback(eventType, payload, dexieData) → void
 * @param {object}   options
 * @param {boolean}  options.skipOwnEvents  Ignorer les événements de cet utilisateur (défaut: false)
 * @param {boolean}  options.pullOnEvent    Déclencher un PULL après chaque event (défaut: true)
 * @param {number}   options.debounceMs     Délai avant PULL (défaut: 300ms)
 */
export function useRealtime(eventTypes = [], onEvent = null, options = {}) {
  const {
    skipOwnEvents = false,
    pullOnEvent   = true,
    debounceMs    = 300,
  } = options;

  const debounceTimer     = useRef(null);
  const pendingEventTypes = useRef(new Set());
  const onEventRef        = useRef(onEvent);

  // Mettre à jour la ref si le callback change (évite les stale closures)
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  /**
   * Obtenir l'user ID actuel pour le filtrage des propres événements.
   */
  const getCurrentUserId = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.id ? parseInt(user.id) : null;
    } catch {
      return null;
    }
  }, []);

  /**
   * PULL ciblé selon le type d'événement reçu.
   * Évite de télécharger tout le catalogue quand seul le stock change.
   * 
   * ANTI-BOUCLE : Le PULL récupère des données "server-originated".
   * Dexie.put() est idempotent, il n'y a pas de nouveau push possible.
   */
  const doTargetedPull = useCallback(async (collectedEventTypes) => {
    const companyId = localStorage.getItem('company-id');
    const branchId  = localStorage.getItem('branch-id');

    if (!companyId) return;

    const eventSet = new Set(collectedEventTypes);

    // Déterminer quelles entités fetch selon les événements reçus
    const needsStockPull    = eventSet.has('stock_updated') || eventSet.has('stock_adjusted') || eventSet.has('stock_low') || eventSet.has('sale_created') || eventSet.has('purchase_received') || eventSet.has('transfer_received') || eventSet.has('transfer_shipped');
    const needsProductPull  = eventSet.has('product_created') || eventSet.has('product_updated') || eventSet.has('product_deleted');
    const needsSalePull     = eventSet.has('sale_created') || eventSet.has('sale_cancelled');
    const needsTransferPull = eventSet.has('transfer_created') || eventSet.has('transfer_approved') || eventSet.has('transfer_shipped') || eventSet.has('transfer_received');
    const needsSessionPull  = eventSet.has('cash_session_opened') || eventSet.has('cash_session_closed') || eventSet.has('cash_session_validated') || eventSet.has('cash_session_transaction');

    try {
      // Toujours utiliser le PULL standard avec curseur (incrémental et sûr)
      await syncService.pullServerUpdates();
    } catch (err) {
      console.warn('[useRealtime] PULL ciblé échoué:', err);
      // Le PULL échoué ne doit pas bloquer l'UI — les données sont déjà dans Dexie
    }
  }, []);

  /**
   * Gestionnaire principal d'événement SSE.
   * Débounce les PULL répétitifs si plusieurs events arrivent rapidement.
   */
  const handleEvent = useCallback((eventType, payload) => {
    const currentUserId = getCurrentUserId();

    // Optionnellement ignorer nos propres événements
    if (skipOwnEvents && payload.actor_id && currentUserId && parseInt(payload.actor_id) === currentUserId) {
      return;
    }

    // Appeler le callback React immédiatement avec le signal
    if (onEventRef.current) {
      try {
        onEventRef.current(eventType, payload);
      } catch (err) {
        console.error('[useRealtime] Erreur dans le callback onEvent:', err);
      }
    }

    // Planifier le PULL ciblé (avec debounce pour éviter les PULL répétitifs)
    if (pullOnEvent) {
      pendingEventTypes.current.add(eventType);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        const eventTypesToPull = Array.from(pendingEventTypes.current);
        pendingEventTypes.current.clear();

        await doTargetedPull(eventTypesToPull);

        // Notifier React après la mise à jour Dexie
        if (onEventRef.current) {
          try {
            onEventRef.current('__pull_complete__', { pulledFor: eventTypesToPull });
          } catch { /* silencieux */ }
        }
      }, debounceMs);
    }
  }, [skipOwnEvents, pullOnEvent, debounceMs, getCurrentUserId, doTargetedPull]);

  // S'abonner aux événements SSE au montage du composant
  useEffect(() => {
    if (!eventTypes || eventTypes.length === 0) return;

    // Créer un cleanup unique pour tous les abonnements de ce hook
    const cleanup = realtimeService.subscribeMany(eventTypes, handleEvent);

    return () => {
      // Nettoyer les abonnements au démontage
      cleanup();

      // Annuler le timer de debounce
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [eventTypes.join(','), handleEvent]); // eventTypes.join pour comparaison stable
}

/**
 * useRealtimeStatus — Hook pour afficher le statut de la connexion SSE.
 * Utilisé par l'indicateur UI dans le header.
 */
export function useRealtimeStatus() {
  const [status, setStatus] = require('react').useState(realtimeService.getStatus());

  useEffect(() => {
    const cleanup = realtimeService.onStatusChange(setStatus);
    return cleanup;
  }, []);

  return status;
}
