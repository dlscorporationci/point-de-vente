import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/logo.jpg';

/**
 * Composant central officiel des pages Légales DLS POS :
 * - CGU (Conditions Générales d'Utilisation)
 * - CGV (Conditions Générales de Vente)
 * - Politique de Livraison et d'Activation
 * - Politique de Remboursement
 * - Politique de Confidentialité
 */
export const LegalPage = ({ type = 'cgu', onNavigate }) => {
  const [activeType, setActiveType] = useState(type);
  const [apiContent, setApiContent] = useState({});
  const [loadingApi, setLoadingApi] = useState(true);

  // Mapping des types frontend vers les clés API
  const typeToApiKey = { cgu: 'cgu', cgv: 'cgv', delivery: 'delivery_policy', refund: 'refund_policy', privacy: 'privacy_policy' };

  // Charger le contenu dynamique depuis l'API
  useEffect(() => {
    const fetchLegalPages = async () => {
      try {
        const res = await axios.get('/v1/public/legal-pages');
        if (res.data) setApiContent(res.data);
      } catch (e) {
        console.warn('Pages légales API non disponible, utilisation du contenu par défaut.');
      } finally {
        setLoadingApi(false);
      }
    };
    fetchLegalPages();
  }, []);

  // 1. CGU — Conditions Générales d'Utilisation
  const renderCGU = () => (
    <article className="legal-document">
      <div className="mb-4">
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text, #1e293b)' }}>
          Conditions Générales d'Utilisation — CGU
        </h2>
        <p className="text-muted" style={{ fontSize: '13px' }}>Dernière mise à jour : 01/08/2026</p>
      </div>

      <p>
        La plateforme <strong>DLS POS</strong> est éditée et exploitée par <strong>DLS CORPORATION</strong>.
        Pour toute question ou assistance, contactez-nous à <a href="mailto:dlscorporation2020@gmail.com">dlscorporation2020@gmail.com</a> ou au <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>.
      </p>
      <p>L'utilisation de la plateforme et du logiciel implique l'acceptation pleine et entière des présentes conditions.</p>

      <h3>1. Accès et utilisation</h3>
      <p>
        Le site et l'application permettent de consulter, souscrire et utiliser des services digitaux de gestion commerciale, encaissement POS et suivi de stocks.
        L'utilisateur s'engage à fournir des informations exactes lors de la création de son compte et à utiliser le service de manière licite.
      </p>
      <p>
        Lorsqu'un compte est nécessaire, l'utilisateur doit préserver la confidentialité de ses identifiants (mots de passe, codes PIN de caisse) et signaler immédiatement tout accès non autorisé.
      </p>

      <h3>2. Propriété intellectuelle</h3>
      <p>
        Les contenus de la plateforme, les composants logiciels et les produits proposés sont protégés par les droits de propriété intellectuelle de leurs titulaires.
        L'achat d'un abonnement ou d'un produit accorde uniquement les droits d'utilisation précisés sur sa fiche ou dans sa licence.
      </p>
      <p>
        Sauf autorisation explicite de DLS CORPORATION, la redistribution, la revente, la rétro-ingénierie et le partage public du logiciel sont strictement interdits.
      </p>

      <h3>3. Disponibilité du service</h3>
      <p>
        Des interruptions temporaires peuvent survenir pour maintenance préventive ou en raison de contraintes techniques.
        En cas de difficulté d'accès à un produit ou service acheté, l'utilisateur peut contacter notre assistance dédiée.
      </p>

      <h3>4. Données personnelles</h3>
      <p>
        Les informations nécessaires à la commande et à l'exécution du service sont utilisées pour traiter le paiement, fournir le logiciel et assurer le suivi client.
        Les modalités détaillées de traitement sont décrites dans notre <strong>Politique de Confidentialité</strong>.
      </p>

      <h3>5. Contact</h3>
      <p>
        <strong>DLS CORPORATION</strong><br />
        E-mail : <a href="mailto:dlscorporation2020@gmail.com">dlscorporation2020@gmail.com</a><br />
        Téléphone : <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>
      </p>
    </article>
  );

  // 2. CGV — Conditions Générales de Vente
  const renderCGV = () => (
    <article className="legal-document">
      <div className="mb-4">
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text, #1e293b)' }}>
          Conditions Générales de Vente — CGV
        </h2>
        <p className="text-muted" style={{ fontSize: '13px' }}>Dernière mise à jour : 01/08/2026</p>
      </div>

      <p>
        Les présentes conditions encadrent les achats et souscriptions de services et produits digitaux sur la plateforme DLS POS, exploitée par <strong>DLS CORPORATION</strong>.
      </p>

      <h3>1. Produits & Abonnements</h3>
      <p>
        Les caractéristiques, le contenu, les formats, les prérequis techniques et les éventuelles restrictions d'utilisation sont indiqués sur chaque fiche produit.
      </p>
      <p>
        Pour les abonnements (Formules Starter, Pro, Premium), la durée, la fréquence de facturation et les conditions de renouvellement ou de résiliation sont précisées avant l'achat.
      </p>

      <h3>2. Prix et paiement</h3>
      <p>
        Les prix sont affichés en Francs CFA (XOF) ou en Euros (€). Les taxes et frais éventuels sont précisés avant la validation de la commande.
      </p>
      <p>
        La commande est confirmée après validation effective du paiement (Mobile Money, Carte bancaire, Xpaye). Aucun accès payant n'est délivré tant que le paiement n'est pas confirmé.
      </p>

      <h3>3. Livraison numérique</h3>
      <p>
        Les produits et services digitaux sont fournis par téléchargement, e-mail, activation de licence ou accès direct à l'espace client selon la description du produit.
        Les modalités et délais détaillés figurent dans notre <strong>Politique de Livraison et d'Activation</strong>.
      </p>

      <h3>4. Licence d'utilisation</h3>
      <p>
        Le client bénéficie d'un droit d'utilisation dans les limites indiquées sur la fiche produit ou dans la licence applicable. L'achat ne transfère pas la propriété intellectuelle du logiciel.
        La revente, la redistribution ou le partage avec des tiers nécessitent une autorisation explicite de DLS CORPORATION.
      </p>

      <h3>5. Assistance et remboursement</h3>
      <p>
        Toute difficulté doit être signalée à <a href="mailto:dlscorporation2020@gmail.com">dlscorporation2020@gmail.com</a> en précisant la référence de commande.
        Les demandes de remboursement sont traitées conformément à notre <strong>Politique de Remboursement</strong>.
      </p>

      <h3>6. Contact</h3>
      <p>
        <strong>DLS CORPORATION</strong><br />
        E-mail : <a href="mailto:dlscorporation2020@gmail.com">dlscorporation2020@gmail.com</a><br />
        Téléphone : <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>
      </p>
    </article>
  );

  // 3. Politique de Livraison et d'Activation
  const renderDeliveryPolicy = () => (
    <article className="legal-document">
      <div className="mb-4">
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text, #1e293b)' }}>
          Politique de Livraison et d'Activation de DLS POS
        </h2>
        <p className="text-muted" style={{ fontSize: '13px' }}>Dernière mise à jour : 01/08/2026</p>
      </div>

      <h3>1. Livraison numérique</h3>
      <p>
        DLS POS est un logiciel de caisse en mode SaaS (Software as a Service). Sa livraison consiste à activer un espace professionnel et à fournir les informations permettant d'y accéder.
      </p>
      <p>
        Aucune livraison physique n'est incluse dans l'abonnement SaaS. Un achat de matériel (imprimante, scanner, tiroir-caisse) fait l'objet de conditions distinctes.
      </p>

      <h3>2. Modalités d'accès</h3>
      <p>Après confirmation du paiement, le client reçoit ou retrouve :</p>
      <ul>
        <li>L'adresse de connexion à son espace de vente ;</li>
        <li>Une invitation à créer son mot de passe ou les instructions d'accès ;</li>
        <li>La confirmation de l'offre activée (Starter, Pro, Premium) ;</li>
        <li>Les coordonnées de l'assistance technique.</li>
      </ul>
      <p>Ces informations sont transmises à l'adresse e-mail renseignée lors de la commande ou mises à disposition dans l'espace client.</p>

      <h3>3. Délais d'activation</h3>
      <p>Lorsque l'activation est automatique, l'accès est ouvert immédiatement après confirmation du paiement.</p>
      <p>
        Lorsqu'une intervention manuelle est nécessaire, l'activation intervient sous <strong>48 heures ouvrées</strong> à compter de la confirmation du paiement et de la réception des informations indispensables.
        Un délai différent peut être convenu pour une configuration particulière.
      </p>

      <h3>4. Configuration et import</h3>
      <p>
        La création de plusieurs boutiques, l'import d'un catalogue produits, la reprise de stocks, la formation ou une intégration spécifique peuvent nécessiter un délai supplémentaire.
        Le périmètre, le prix et le calendrier de ces prestations sont précisés dans l'offre ou le devis.
      </p>

      <h3>5. Prérequis</h3>
      <p>Le client doit disposer d'un appareil compatible (PC, Tablette, Smartphone), d'un navigateur pris en charge (Chrome, Safari, Firefox, Edge) et d'une connexion Internet.</p>
      <p>La compatibilité des imprimantes de tickets, lecteurs de codes-barres et autres périphériques doit être vérifiée avant leur achat. Elle n'est pas garantie pour tous les modèles.</p>

      <h3>6. Absence d'accès</h3>
      <p>
        Si l'accès n'est pas reçu dans le délai annoncé, le client doit vérifier ses courriers indésirables (Spams) puis contacter <a href="mailto:dlscorporation2020@gmail.com">dlscorporation2020@gmail.com</a> avec sa référence de commande.
        DLS CORPORATION vérifie le paiement et procède au renvoi de l'invitation ou au rétablissement de l'accès.
      </p>

      <h3>7. Frais</h3>
      <p>Aucun frais de livraison physique ne s'applique à l'abonnement SaaS. Les éventuels frais de mise en service, formation ou configuration sont annoncés avant la commande.</p>
    </article>
  );

  // 4. Politique de Remboursement
  const renderRefundPolicy = () => (
    <article className="legal-document">
      <div className="mb-4">
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text, #1e293b)' }}>
          Politique de Remboursement de DLS POS
        </h2>
        <p className="text-muted" style={{ fontSize: '13px' }}>Dernière mise à jour : 01/08/2026</p>
      </div>

      <h3>1. Objet</h3>
      <p>Cette politique encadre les demandes de remboursement des abonnements à DLS POS et des prestations associées.</p>

      <h3>2. Situations prises en charge</h3>
      <p>Un remboursement peut être accordé notamment en cas de :</p>
      <ul>
        <li>Paiement en double pour la même échéance ;</li>
        <li>Paiement encaissé sans activation, lorsque DLS CORPORATION ne peut fournir l'accès ;</li>
        <li>Activation d'une offre différente de celle achetée, sans correction possible ;</li>
        <li>Dysfonctionnement substantiel du service empêchant l'utilisation des fonctions souscrites et non résolu après intervention de l'assistance ;</li>
        <li>Prélèvement effectué après la prise en compte d'une résiliation applicable à cette échéance.</li>
      </ul>

      <h3>3. Traitement des incidents</h3>
      <p>DLS CORPORATION peut d'abord proposer une correction, un rétablissement de l'accès ou une solution équivalente acceptée par le client.</p>
      <p>Si aucune solution satisfaisante n'est possible, un remboursement total ou partiel est déterminé selon la période et les fonctions concernées.</p>
      <p>Une indisponibilité significative imputable au service peut donner lieu à une prolongation d'abonnement acceptée par le client ou à un remboursement proportionnel à la période affectée.</p>

      <h3>4. Changement d'avis</h3>
      <p>Hors droits obligatoires applicables, un changement d'avis après activation ne donne pas automatiquement droit à un remboursement.</p>
      <p>L'arrêt d'utilisation du logiciel ou la résiliation en cours de période n'entraîne pas automatiquement le remboursement des jours ou mois restants.</p>

      <h3>5. Prestations complémentaires</h3>
      <p>Pour les prestations de formation, configuration, import ou développement spécifique, un remboursement éventuel tient compte du travail déjà réalisé et des conditions du devis. Une prestation non commencée peut être annulée selon les conditions convenues.</p>

      <h3>6. Modalités de Demande</h3>
      <p>Le client doit écrire à <a href="mailto:dlscorporation2020@gmail.com">dlscorporation2020@gmail.com</a> en indiquant :</p>
      <ul>
        <li>Le nom de l'entreprise et l'e-mail du compte ;</li>
        <li>La référence de commande ou de transaction ;</li>
        <li>La date et le montant du paiement ;</li>
        <li>Le motif et les éléments utiles à l'analyse.</li>
      </ul>
      <p>Pour faciliter les vérifications, il est recommandé de signaler le problème dans les <strong>14 jours suivant sa découverte</strong>.</p>
      <p><strong>Sécurité :</strong> Aucun code PIN, mot de passe ou code de validation ne doit être transmis.</p>

      <h3>7. Délais et moyen de remboursement</h3>
      <p>DLS CORPORATION apporte une première réponse sous <strong>3 jours ouvrés</strong>.</p>
      <p>Après acceptation, le remboursement est initié sous <strong>7 jours ouvrés</strong>, généralement par le moyen de paiement d'origine. Le délai de réception dépend ensuite du prestataire de paiement.</p>

      <h3>8. Conséquences sur l'accès</h3>
      <p>Un remboursement total d'une période peut entraîner la désactivation de l'accès correspondant. Le client est informé de la date de désactivation et des possibilités d'export de ses données.</p>

      <h3>9. Contact</h3>
      <p>
        <strong>DLS CORPORATION</strong><br />
        E-mail : <a href="mailto:dlscorporation2020@gmail.com">dlscorporation2020@gmail.com</a><br />
        Téléphone : <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>
      </p>
    </article>
  );

  // 5. Politique de Confidentialité
  const renderPrivacyPolicy = () => (
    <article className="legal-document">
      <div className="mb-4">
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text, #1e293b)' }}>
          Politique de Confidentialité de DLS POS
        </h2>
        <p className="text-muted" style={{ fontSize: '13px' }}>Dernière mise à jour : 01/08/2026</p>
      </div>

      <h3>1. Présentation</h3>
      <p>
        <strong>DLS CORPORATION</strong> traite les données nécessaires à la gestion des comptes, des abonnements et du fonctionnement de DLS POS.
      </p>
      <p>
        Pour les données commerciales enregistrées par le client dans le logiciel, DLS CORPORATION intervient pour fournir le service selon les instructions du client. Celui-ci détermine les informations qu'il collecte et les usages qu'il en fait.
      </p>

      <h3>2. Données traitées</h3>
      <p>Selon l'utilisation du service, les données peuvent comprendre :</p>
      <ul>
        <li>Les coordonnées de l'entreprise et de ses représentants ;</li>
        <li>Les noms, e-mails et droits d'accès des utilisateurs ;</li>
        <li>Les informations de facturation et références de paiement ;</li>
        <li>Les données de ventes, stocks, produits, clients et fournisseurs ;</li>
        <li>Les journaux de connexion et d'opérations ;</li>
        <li>Les échanges avec l'assistance technique.</li>
      </ul>
      <p>Les données techniques traitées peuvent inclure l'adresse IP, le navigateur et les informations nécessaires au diagnostic des incidents.</p>

      <h3>3. Utilisation des données</h3>
      <p>Les données servent à :</p>
      <ul>
        <li>Créer et administrer les comptes ;</li>
        <li>Fournir les fonctions du logiciel ;</li>
        <li>Gérer les abonnements et la facturation ;</li>
        <li>Assurer l'assistance, la sécurité et la maintenance ;</li>
        <li>Prévenir les accès non autorisés ;</li>
        <li>Répondre aux obligations applicables.</li>
      </ul>
      <p>Les communications promotionnelles sont gérées séparément des messages nécessaires au service, avec les possibilités d'opposition ou de désinscription applicables.</p>

      <h3>4. Accès et prestataires</h3>
      <p>L'accès est limité aux personnes et prestataires qui en ont besoin pour leurs missions, notamment l'hébergement, le paiement (dont Xpaye si applicable) et l'assistance.</p>
      <p><strong>DLS CORPORATION ne vend pas les données commerciales du client.</strong></p>
      <p>Une intervention de l'assistance sur les données est limitée à ce qui est nécessaire pour traiter la demande ou sécuriser le service.</p>

      <h3>5. Sécurité et sauvegardes</h3>
      <p>DLS CORPORATION met en œuvre des mesures techniques et organisationnelles adaptées, notamment la gestion des accès et la protection des échanges.</p>
      <p>Le client doit également sécuriser ses appareils, gérer les droits de ses utilisateurs et conserver les exports nécessaires à ses activités.</p>

      <h3>6. Conservation des données</h3>
      <p>Les données du compte sont conservées pendant la durée nécessaire à la fourniture du service.</p>
      <p>
        Après la fin de l'abonnement, les données opérationnelles suivent les délais d'export et de suppression annoncés dans les CGU : <strong>demande d'export pendant 30 jours</strong>, puis <strong>suppression ou anonymisation sous 90 jours</strong>, sauf obligation ou accord contraire.
      </p>

      <h3>7. Demandes relatives aux données</h3>
      <p>
        Les personnes concernées peuvent contacter <a href="mailto:dlscorporation2020@gmail.com">dlscorporation2020@gmail.com</a> pour demander l'accès, la rectification ou la suppression de leurs données.
        Une vérification d'identité ou d'autorisation peut être demandée avant toute communication.
      </p>

      <h3>8. Cookies</h3>
      <p>DLS POS utilise des cookies nécessaires à la connexion, à la sécurité et à la mémorisation des préférences d'interface.</p>

      <h3>9. Contact</h3>
      <p>
        <strong>DLS CORPORATION</strong><br />
        E-mail relatif aux données personnelles : <a href="mailto:dlscorporation2020@gmail.com">dlscorporation2020@gmail.com</a><br />
        Téléphone : <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>
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
                Informations & Mentions Légales Officielle
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                DLS POS — Solution Globale de Gestion Commerciale & Points de Vente Multi-Entreprises (DLS CORPORATION)
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

        {/* ── BARRE D'ONGLETS DE NAVIGATION LÉGALE (5 ONGLETS OFFICIELS) ── */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', borderBottom: '1px solid var(--color-border, #e2e8f0)', paddingBottom: '12px', overflowX: 'auto' }}>
          <button
            className={`btn btn-sm ${activeType === 'cgu' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveType('cgu')}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            📜 CGU (Utilisation)
          </button>
          <button
            className={`btn btn-sm ${activeType === 'cgv' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveType('cgv')}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            🛍️ CGV (Vente)
          </button>
          <button
            className={`btn btn-sm ${activeType === 'delivery' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveType('delivery')}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            🚚 Politique de Livraison
          </button>
          <button
            className={`btn btn-sm ${activeType === 'refund' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveType('refund')}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            💳 Remboursement
          </button>
          <button
            className={`btn btn-sm ${activeType === 'privacy' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setActiveType('privacy')}
            style={{ borderRadius: '8px', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            🔒 Confidentialité
          </button>
        </div>
      </div>

      {/* ── CONTENU DU DOCUMENT SÉLECTIONNÉ ── */}
      <div className="card shadow-sm p-4 p-md-5" style={{ borderRadius: '16px', background: 'var(--color-surface, #ffffff)', minHeight: '450px' }}>
        {loadingApi ? (
          <div className="text-center py-5">
            <i className="fa-solid fa-spinner fa-spin fa-2x text-primary mb-3" style={{ display: 'block' }}></i>
            <p className="text-muted">Chargement...</p>
          </div>
        ) : (
          <>
            {/* Si l'API a du contenu pour ce type, l'afficher. Sinon, afficher le contenu codé en dur. */}
            {apiContent[typeToApiKey[activeType]] ? (
              <article className="legal-document" dangerouslySetInnerHTML={{ __html: apiContent[typeToApiKey[activeType]] }} />
            ) : (
              <>
                {activeType === 'cgu' && renderCGU()}
                {activeType === 'cgv' && renderCGV()}
                {activeType === 'delivery' && renderDeliveryPolicy()}
                {activeType === 'refund' && renderRefundPolicy()}
                {activeType === 'privacy' && renderPrivacyPolicy()}
              </>
            )}
          </>
        )}

        <hr style={{ margin: '30px 0 20px', borderColor: 'var(--color-border, #e2e8f0)' }} />

        {/* Pied de page du document */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#64748b' }}>
          <div>
            <strong>DLS CORPORATION CI</strong> — Éditeur de solutions logicielles et d'intégration Monétique.
          </div>
          <div>
            E-mail : <strong>dlscorporation2020@gmail.com</strong> | Tél : <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
