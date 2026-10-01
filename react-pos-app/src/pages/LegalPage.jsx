import React, { useState } from 'react';
import logo from '../assets/logo.jpg';

/**
 * Composant central pour les pages Légales : CGU, CGV, Politique de Livraison & Remboursement.
 */
export const LegalPage = ({ type = 'cgu', onNavigate }) => {
  const [activeType, setActiveType] = useState(type);

  const renderCGU = () => (
    <article className="legal-document">
      <h3>1. Objet des Conditions Générales d'Utilisation</h3>
      <p>
        Les présentes Conditions Générales d'Utilisation (CGU) encadrent l'accès et l'utilisation de la plateforme de gestion commerciale et point de vente <strong>DLS POS</strong> (éditée par DLS Corporation CI).
        En accédant ou en utilisant le logiciel, vous acceptez sans réserve l'intégralité des termes décrits ci-dessous.
      </p>

      <h3>2. Accès aux Services & Comptes Utilisateurs</h3>
      <p>
        L'accès à DLS POS est réservé aux entreprises, commerçants et professionnels valablement enregistrés. Chaque entreprise cliente crée un espace réservé sécurisé.
        L'utilisateur est responsable du maintien de la confidentialité de ses identifiants de connexion (mot de passe, code PIN caisse).
      </p>

      <h3>3. Protection des Données & Confidentialité</h3>
      <p>
        DLS POS met en œuvre des mesures de sécurité de niveau industriel pour protéger les données commerciales, l'historique des ventes, les catalogues produits et les données clients de votre entreprise.
        Conformément aux réglementations sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
      </p>

      <h3>4. Propriété Intellectuelle</h3>
      <p>
        Tous les éléments logiciels, designs, algorithmes, logos, marques et interfaces de DLS POS restent la propriété exclusive de DLS Corporation CI. Toute reproduction ou rétro-ingénierie sans autorisation écrite est strictement interdite.
      </p>

      <h3>5. Responsabilités & Disponibilité</h3>
      <p>
        DLS POS s'engage à assurer un taux de disponibilité élevé de la plateforme (99.8%). Le mode Hors-Ligne (Offline First) garantit la continuité d'activité de vos caisses même en cas de coupure Internet.
      </p>
    </article>
  );

  const renderCGV = () => (
    <article className="legal-document">
      <h3>1. Champ d'Application des CGV</h3>
      <p>
        Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des souscriptions aux abonnements SaaS DLS POS (Offres Starter, Pro, Premium) ainsi que la vente de matériel informatique / terminaux POS distribués par DLS Corporation CI.
      </p>

      <h3>2. Tarifs & Modalités de Paiement</h3>
      <p>
        Les tarifs des formules d'abonnement sont exprimés en Francs CFA (XOF) ou en Euros (€) hors taxes. Le paiement s'effectue mensuellement ou annuellement par Mobile Money (Orange Money, Wave, MTN Money), carte bancaire ou virement.
      </p>

      <h3>3. Durée, Renouvellement & Résiliation</h3>
      <p>
        Les abonnements sont souscrits sans engagement de durée longue (sauf contrat spécifique). Le renouvellement est tacite à chaque échéance. Vous pouvez résilier votre formule à tout moment depuis votre console d'administration avant la date d'échéance.
      </p>

      <h3>4. Suspension pour Dépassement ou Impayé</h3>
      <p>
        En cas de non-règlement à la date d'échéance, un délai de grâce de 7 jours est accordé. Au-delà, l'accès aux fonctionnalités d'administration peut être temporairement restreint jusqu'à régularisation.
      </p>
    </article>
  );

  const renderDeliveryPolicy = () => (
    <article className="legal-document">
      <h3>1. Livraison des Licences Logiciel (SaaS)</h3>
      <p>
        La livraison des accès au logiciel DLS POS est <strong>immédiate et automatisée</strong>. Dès la validation de votre inscription ou du paiement de votre abonnement, votre espace de vente est activé et accessible en ligne via votre navigateur ou l'application mobile PWA.
      </p>

      <h3>2. Livraison de Matériel POS & Équipements Caisses</h3>
      <p>
        Pour les commandes d'équipements physiques (imprimantes thermiques de reçus, tiroirs-caisses, lecteurs de code-barres, terminaux tactiles Android/Windows) :
      </p>
      <ul>
        <li><strong>Abidjan & Zone Urbaine (Côte d'Ivoire) :</strong> Livraison Express sous 24h à 48h ouvrées.</li>
        <li><strong>Intérieur du pays & Sous-région UEMOA :</strong> Expédition par transporteur partenaire agréé sous 3 à 5 jours ouvrés.</li>
      </ul>

      <h3>3. Frais de Livraison & Réception</h3>
      <p>
        Les frais de livraison sont calculés lors de la commande en fonction de la zone géographique et du poids des équipements. À la réception, le client est tenu de vérifier l'état du colis et de signer le bon de livraison.
      </p>
    </article>
  );

  const renderRefundPolicy = () => (
    <article className="legal-document">
      <h3>1. Politique de Remboursement des Abonnements SaaS</h3>
      <p>
        DLS POS propose une <strong>période d'essai gratuite de 14 jours</strong> sans carte bancaire requise pour tester l'intégralité des fonctionnalités du logiciel.
      </p>
      <p>
        En raison de la nature numérique du service SaaS, les frais d'abonnement mensuels ou annuels déjà entamés ne sont pas remboursables. Cependant, en cas d'erreur de facturation avérée ou de double débit, un remboursement intégral sera effectué sous 5 jours ouvrés.
      </p>

      <h3>2. Retour & Remboursement du Matériel Physique</h3>
      <p>
        Conformément à la réglementation commerciale, vous disposez d'un droit de rétractation de <strong>14 jours</strong> à compter de la réception de vos équipements matériels (imprimantes, scanners, terminaux) :
      </p>
      <ul>
        <li>Le matériel doit être retourné neuf, non utilisé, dans son emballage d'origine complet avec tous les accessoires et câbles.</li>
        <li>Les frais de retour restent à la charge du client sauf en cas de défaut de fabrication avéré au déballage.</li>
      </ul>

      <h3>3. Procédure de Demande de Remboursement</h3>
      <p>
        Toute demande de remboursement doit être adressée au support client par e-mail à <strong>support@dlscorporation.ci</strong> ou via le centre de communication de votre application avec la facture correspondante.
      </p>
    </article>
  );

  return (
    <div className="customers-container" style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* ── EN-TÊTE DE PAGE ── */}
      <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: '16px', background: 'var(--color-surface, #ffffff)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={logo} alt="DLS POS Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--color-text, #1e293b)' }}>
                Informations & Mentions Légales
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                DLS POS — Solution Globale de Gestion Commerciale & Points de Vente Multi-Entreprises
              </p>
            </div>
          </div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => window.print()}
            style={{ borderRadius: '8px', fontSize: '13px' }}
          >
            <i className="fa-solid fa-print me-1"></i> Imprimer / Exporter PDF
          </button>
        </div>

        {/* ── BARRE D'ONGLETS DE NAVIGATION LÉGALE ── */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', borderBottom: '1px solid var(--color-border, #e2e8f0)', paddingBottom: '12px', overflowX: 'auto' }}>
          <button
            className={`btn btn-sm ${activeType === 'cgu' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveType('cgu')}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}
          >
            <i className="fa-solid fa-file-contract me-1"></i> CGU (Utilisation)
          </button>
          <button
            className={`btn btn-sm ${activeType === 'cgv' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveType('cgv')}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}
          >
            <i className="fa-solid fa-file-invoice-dollar me-1"></i> CGV (Vente)
          </button>
          <button
            className={`btn btn-sm ${activeType === 'delivery' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveType('delivery')}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}
          >
            <i className="fa-solid fa-truck-fast me-1"></i> Politique de Livraison
          </button>
          <button
            className={`btn btn-sm ${activeType === 'refund' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveType('refund')}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}
          >
            <i className="fa-solid fa-[#10b981] fa-rotate-left me-1"></i> Politique de Remboursement
          </button>
        </div>
      </div>

      {/* ── CONTENU DU DOCUMENT SÉLECTIONNÉ ── */}
      <div className="card shadow-sm p-4 p-md-5" style={{ borderRadius: '16px', background: 'var(--color-surface, #ffffff)', minHeight: '450px' }}>
        {activeType === 'cgu' && (
          <div>
            <span className="badge bg-primary-subtle text-primary mb-3" style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px' }}>
              📜 Conditions Générales d'Utilisation (CGU)
            </span>
            {renderCGU()}
          </div>
        )}

        {activeType === 'cgv' && (
          <div>
            <span className="badge bg-primary-subtle text-primary mb-3" style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px' }}>
              🛍️ Conditions Générales de Vente (CGV)
            </span>
            {renderCGV()}
          </div>
        )}

        {activeType === 'delivery' && (
          <div>
            <span className="badge bg-primary-subtle text-primary mb-3" style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px' }}>
              🚚 Politique de Livraison (Logiciel & Matériel)
            </span>
            {renderDeliveryPolicy()}
          </div>
        )}

        {activeType === 'refund' && (
          <div>
            <span className="badge bg-primary-subtle text-primary mb-3" style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px' }}>
              💳 Politique de Remboursement & Droit de Rétractation
            </span>
            {renderRefundPolicy()}
          </div>
        )}

        <hr style={{ margin: '30px 0 20px', borderColor: 'var(--color-border, #e2e8f0)' }} />

        {/* Pied de page du document */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#64748b' }}>
          <div>
            <strong>DLS Corporation CI</strong> — Éditeur de solutions logicielles et d'intégration Monétique.
          </div>
          <div>
            Dernière mise à jour : <strong>30 Septembre 2026</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
