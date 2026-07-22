import React, { useState } from 'react';
import posTerminalImg from '/home/aizen/.gemini/antigravity/brain/b9f0f6d0-ea7a-45b8-b70d-8981af5172b1/pos_terminal_1783616808314.png';
import customersListImg from '/home/aizen/.gemini/antigravity/brain/b9f0f6d0-ea7a-45b8-b70d-8981af5172b1/customers_list_1783617744528.png';
import salesHistoryImg from '/home/aizen/.gemini/antigravity/brain/b9f0f6d0-ea7a-45b8-b70d-8981af5172b1/sales_history_1783617712203.png';
import superadminDashboardImg from '/home/aizen/.gemini/antigravity/brain/b9f0f6d0-ea7a-45b8-b70d-8981af5172b1/superadmin_dashboard_1783616831876.png';
import settingsPanelImg from '/home/aizen/.gemini/antigravity/brain/b9f0f6d0-ea7a-45b8-b70d-8981af5172b1/settings_panel_1783616847903.png';

export const UserGuide = () => {
  const [activeSection, setActiveSection] = useState('intro');

  return (
    <div className="guide-container">
      <div className="guide-layout card">
        <div className="guide-header">
          <h2><i className="fa-solid fa-book-open text-primary me-2"></i> Guide Utilisateur & Manuel Officiel</h2>
          <p className="guide-subtitle">Consultez l'aide interactive d'ApexPOS pour configurer votre boutique, former vos caissiers ou administrer la plateforme.</p>
        </div>

        <div className="guide-grid">
          {/* MENU LATÉRAL DE NAVIGATION PAR CHAPITRES */}
          <div className="guide-sidebar">
            <button className={`guide-menu-btn ${activeSection === 'intro' ? 'active' : ''}`} onClick={() => setActiveSection('intro')}>
              📌 1. Introduction & Concept
            </button>
            <button className={`guide-menu-btn ${activeSection === 'roles' ? 'active' : ''}`} onClick={() => setActiveSection('roles')}>
              👥 2. Rôles & Accès
            </button>
            <button className={`guide-menu-btn ${activeSection === 'login' ? 'active' : ''}`} onClick={() => setActiveSection('login')}>
              🔑 3. Connexion & Récupération
            </button>
            <button className={`guide-menu-btn ${activeSection === 'pos' ? 'active' : ''}`} onClick={() => setActiveSection('pos')}>
              🖥️ 4. Terminal POS & Vente
            </button>
            <button className={`guide-menu-btn ${activeSection === 'payments' ? 'active' : ''}`} onClick={() => setActiveSection('payments')}>
              💳 5. Encaissement &amp; Crédits
            </button>
            <button className={`guide-menu-btn ${activeSection === 'clients' ? 'active' : ''}`} onClick={() => setActiveSection('clients')}>
              🤝 6. Clients & Fournisseurs
            </button>
            <button className={`guide-menu-btn ${activeSection === 'audit' ? 'active' : ''}`} onClick={() => setActiveSection('audit')}>
              🛡️ 7. Sécurité & Audit
            </button>
            <button className={`guide-menu-btn ${activeSection === 'superadmin' ? 'active' : ''}`} onClick={() => setActiveSection('superadmin')}>
              ⚙️ 8. Console Super-Admin SaaS
            </button>
            <button className={`guide-menu-btn ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => setActiveSection('settings')}>
              🔧 9. Configuration & Options
            </button>
          </div>

          {/* CONTENU DE LA RUBRIQUE */}
          <div className="guide-content">
            
            {/* CHAPITRE 1 : INTRODUCTION */}
            {activeSection === 'intro' && (
              <div className="animate-fade-in text-left">
                <h3>📌 1. Introduction & Concept Multi-tenant</h3>
                <p className="mt-3">
                  <strong>ApexPOS</strong> est un progiciel de gestion intégré de point de vente multi-boutiques et multi-compagnies (SaaS). 
                  Il est conçu pour permettre le cloisonnement étanche des données commerciales de chaque entreprise tout en offrant 
                  un écosystème performant pour le commerce quotidien.
                </p>
                <h4 className="mt-4">Principaux atouts :</h4>
                <ul className="mt-2" style={{ paddingLeft: '20px' }}>
                  <li className="mb-2"><strong>Sécurité renforcée</strong> : Isolation des données par tenant au niveau de la base de données. Un employé d'une entreprise ne peut sous aucun prétexte accéder aux fiches produits ou aux ventes d'une autre entreprise.</li>
                  <li className="mb-2"><strong>Aéronautique visuelle (UI Kits)</strong> : Passage à la volée entre un kit classique ("Corporate") et un kit moderne dépoli ("Glassmorphism"), avec support automatique des modes sombre et clair.</li>
                  <li className="mb-2"><strong>Conception adaptative (Responsivité)</strong> : L'ensemble de la plateforme s'adapte automatiquement sur les tablettes et les smartphones pour de l'encaissement nomade.</li>
                </ul>
                <div className="alert-box mt-4">
                  <strong>💡 Information :</strong> Le guide ci-présent fait foi de manuel de formation. Pour toute assistance supplémentaire, contactez le support technique de la plateforme de votre zone.
                </div>
              </div>
            )}

            {/* CHAPITRE 2 : ROLES & ACCES */}
            {activeSection === 'roles' && (
              <div className="animate-fade-in text-left">
                <h3>👥 2. Rôles de la Plateforme & Habilitations</h3>
                <p className="mt-3">
                  Afin de garantir le principe du moindre privilège, ApexPOS structure les accès selon cinq profils prédéfinis.
                </p>

                <div className="table-responsive mt-3">
                  <table className="table table-striped align-middle" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'var(--color-primary)', color: '#ffffff' }}>
                      <tr>
                        <th style={{ padding: '12px' }}>Profil / Rôle</th>
                        <th style={{ padding: '12px' }}>Périmètre de responsabilité</th>
                        <th style={{ padding: '12px' }}>Fonctionnalités principales</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px' }}><strong>Super-Administrateur</strong></td>
                        <td style={{ padding: '12px' }}>Supervision technique et commerciale de la plateforme globale (SaaS).</td>
                        <td style={{ padding: '12px' }}>Gestion des abonnements d'entreprises, état matériel du serveur, sauvegardes, et journaux d'audit globaux.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px' }}><strong>Administrateur d'Entreprise</strong></td>
                        <td style={{ padding: '12px' }}>Gestion complète des succursales (boutiques), des stocks et des habilitations internes.</td>
                        <td style={{ padding: '12px' }}>CRUD produits, ajout d'employés, édition du profil de l'entreprise et des terminaux POS, rapports financiers.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px' }}><strong>Gérant de Boutique</strong></td>
                        <td style={{ padding: '12px' }}>Supervision opérationnelle d'une succursale spécifique.</td>
                        <td style={{ padding: '12px' }}>Gestion des stocks (alertes, transferts), clôtures de caisse, et consultation des statistiques.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px' }}><strong>Comptable</strong></td>
                        <td style={{ padding: '12px' }}>Suivi analytique et fiscalité.</td>
                        <td style={{ padding: '12px' }}>Lecture des rapports de marges, TVA collectée, balances âgées et écritures d'achats.</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px' }}><strong>Caissier</strong></td>
                        <td style={{ padding: '12px' }}>Opérateur de vente au comptoir.</td>
                        <td style={{ padding: '12px' }}>Saisie des articles, encaissement rapide (Espèces / Carte / Crédit), et impression des reçus thermiques.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CHAPITRE 3 : CONNEXION & RECUPERATION */}
            {activeSection === 'login' && (
              <div className="animate-fade-in text-left">
                <h3>🔑 3. Authentification, Code PIN & Récupération</h3>
                <p className="mt-3">
                  ApexPOS propose deux modes de connexion distincts pour s'adapter au rythme de l'activité commerciale.
                </p>

                <h4 className="mt-4">1. La Connexion Standard (E-mail + Mot de passe)</h4>
                <p className="text-muted small">
                  Destinée principalement aux fonctions de gestion (Admin, Gérant, Comptable). 
                  Elle nécessite la saisie des identifiants complets créés lors de l'enregistrement de l'entreprise.
                </p>

                <h4 className="mt-4">2. La Connexion Caisse (Code PIN à 4 chiffres)</h4>
                <p className="text-muted small">
                  Conçue pour les écrans tactiles et les caissiers. 
                  L'opérateur choisit son entreprise, clique sur son nom d'utilisateur, puis tape son code PIN à 4 chiffres sur le clavier virtuel.
                </p>
                <div className="alert-box mt-3" style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid var(--color-primary)' }}>
                  <strong>💡 Règle d'initialisation :</strong> À la création de toute nouvelle entreprise, le premier compte d'administrateur se voit assigner le code PIN par défaut <strong>`1234`</strong>. Vous devez le modifier dans vos paramètres de profil pour des raisons de sécurité.
                </div>

                <h4 className="mt-4">3. Récupération de Mot de Passe Oublié</h4>
                <p className="text-muted small">
                  En cas d'oubli de mot de passe, cliquez sur *"Mot de passe oublié ?"* sur l'interface de connexion.
                  Saisissez votre e-mail pour générer un code de réinitialisation unique à 6 chiffres (valable 15 minutes).
                  Saisissez ensuite ce code et définissez votre nouveau mot de passe pour retrouver l'accès à votre espace.
                </p>
              </div>
            )}

            {/* CHAPITRE 4 : TERMINAL POS */}
            {activeSection === 'pos' && (
              <div className="animate-fade-in text-left">
                <h3>🖥️ 4. Terminal de Vente (POS) & Caisse</h3>
                <p className="mt-3">
                  Le terminal POS est l'outil phare pour enregistrer les paniers de vente.
                </p>

                <div className="guide-img-wrapper my-3">
                  <img src={posTerminalImg} alt="Terminal de Vente POS" className="guide-screenshot" />
                  <span className="img-caption">Figure 1 : Interface de caisse du point de vente POS.</span>
                </div>

                <h4 className="mt-4">Cycle de vie d'une Session de Caisse :</h4>
                <p className="text-muted small">
                  Pour des raisons de rigueur comptable, un caissier ne peut pas scanner d'articles sans avoir ouvert une session.
                </p>
                <ul className="mt-2" style={{ paddingLeft: '20px' }}>
                  <li className="mb-2"><strong>Ouverture de session</strong> : Le caissier saisit le montant initial en espèces présent dans le tiroir-caisse (fond de caisse).</li>
                  <li className="mb-2"><strong>En cours d'activité</strong> : Les ventes s'incrémentent dans le journal. Le système calcule en temps réel le montant théorique attendu.</li>
                  <li className="mb-2"><strong>Fermeture de session</strong> : Le gérant ou le caissier compte le tiroir physique à la fin du service. En cas d'écart, la différence est calculée automatiquement et consignée dans l'historique des clôtures pour déceler d'éventuelles erreurs.</li>
                </ul>
              </div>
            )}

            {/* CHAPITRE 5 : ENCAISSEMENT & CREDITS */}
            {activeSection === 'payments' && (
              <div className="animate-fade-in text-left">
                <h3>💳 5. Modes d'Encaissement & Ventes à Crédit</h3>
                <p className="mt-3">
                  ApexPOS permet d'encaisser vos transactions via plusieurs méthodes (Espèces, Carte Bancaire, Crédit Client).
                </p>

                <h4 className="mt-4">1. Modes de Paiement</h4>
                <p className="text-muted small">
                  Lors de la validation d'un panier sur le terminal POS, sélectionnez le mode de paiement souhaité :
                  - <strong>Espèces (Cash)</strong> : Saisissez le montant reçu pour calculer automatiquement le rendu de monnaie.
                  - <strong>Carte Bancaire</strong> : Enregistre le règlement par terminal bancaire (TPE).
                  - <strong>Crédit Client</strong> : Enregistre une vente différée rattachée au compte client.
                </p>

                <h4 className="mt-4">2. Ventes à Crédit (Compte Dettes)</h4>
                <p className="text-muted small">
                  Pour les clients enregistrés, vous pouvez effectuer une vente à crédit. 
                  Le montant total de la facture est alors ajouté au solde de dettes de la fiche client.
                  *Sécurité* : L'administrateur définit une limite de crédit maximum pour chaque client. Si le solde débiteur dépasse cette limite, le terminal de vente refuse de finaliser l'encaissement à crédit.
                </p>
              </div>
            )}

            {/* CHAPITRE 6 : CLIENTS & FOURNISSEURS */}
            {activeSection === 'clients' && (
              <div className="animate-fade-in text-left">
                <h3>🤝 6. Fiches Clients, Fidélité & Fournisseurs</h3>
                <p className="mt-3">
                  La fidélisation et les approvisionnements sont essentiels pour suivre la rentabilité de votre commerce.
                </p>

                <div className="guide-img-wrapper my-3">
                  <img src={customersListImg} alt="Gestion des Clients" className="guide-screenshot" />
                  <span className="img-caption">Figure 2 : Interface de suivi des dettes et points de fidélité.</span>
                </div>

                <h4 className="mt-4">1. Suivi de la Fidélité</h4>
                <p className="text-muted small">
                  Chaque achat effectué par un client identifié incrémente son compteur de points de fidélité (par défaut, 1 point tous les 1 000 XOF achetés).
                  Ces points peuvent être utilisés ultérieurement pour accorder des remises ou des cadeaux commerciaux.
                </p>

                <h4 className="mt-4">2. Suivi des Fournisseurs & Achats</h4>
                <p className="text-muted small">
                  Le module *Fournisseurs* permet de recenser vos partenaires logistiques. 
                  Lors de la réception d'une livraison, l'Administrateur enregistre un *Achat* qui met instantanément à jour les quantités en stock de la boutique et incrémente (si payé à terme) la dette fournisseur de l'entreprise.
                </p>
              </div>
            )}

            {/* CHAPITRE 7 : SECURITE & AUDIT */}
            {activeSection === 'audit' && (
              <div className="animate-fade-in text-left">
                <h3>🛡️ 7. Journal d'Audit & Traçabilité de l'activité</h3>
                <p className="mt-3">
                  Afin de prévenir la fraude interne et de garantir la transparence, ApexPOS intègre un enregistreur d'audit automatique.
                </p>
                <h4 className="mt-4">Qu'est-ce qui est audité ?</h4>
                <p className="text-muted small">
                  Chaque opération d'écriture sensible (création de produit, modification de prix, connexion utilisateur, ajustement de stock, annulation de vente, modification de mot de passe) déclenche la création d'un journal d'audit.
                </p>
                <h4 className="mt-4">Informations stockées :</h4>
                <ul className="mt-2" style={{ paddingLeft: '20px' }}>
                  <li className="mb-2">L'adresse IP de la machine ayant exécuté la requête.</li>
                  <li className="mb-2">Le navigateur et l'appareil utilisé (User Agent).</li>
                  <li className="mb-2">L'ancien état des données ainsi que le nouvel état modifié.</li>
                  <li className="mb-2">L'horodatage précis à la seconde près.</li>
                </ul>
              </div>
            )}

            {/* CHAPITRE 8 : SUPER-ADMIN */}
            {activeSection === 'superadmin' && (
              <div className="animate-fade-in text-left">
                <h3>⚙️ 8. Supervision SaaS (Super-Administrateur)</h3>
                <p className="mt-3">
                  Interface centrale réservée aux administrateurs de l'infrastructure SaaS pour gérer l'exploitation commerciale de la plateforme.
                </p>

                <div className="guide-img-wrapper my-3">
                  <img src={superadminDashboardImg} alt="Dashboard de Supervision Super-Admin" className="guide-screenshot" />
                  <span className="img-caption">Figure 4 : Tableau de bord de statistiques SaaS globales.</span>
                </div>

                <h4 className="mt-4">Outils de maintenance :</h4>
                <ul className="mt-2" style={{ paddingLeft: '20px' }}>
                  <li className="mb-2"><strong>Maintenance Système</strong> : Surveillance de la charge CPU, de la consommation RAM et du stockage disque disponible de la machine serveur.</li>
                  <li className="mb-2"><strong>Sauvegarde Automatique</strong> : Lancement d'une sauvegarde complète de la base de données (Dump SQL comprimé) exportable en 1 clic.</li>
                  <li className="mb-2"><strong>Gestion des abonnements</strong> : Configuration des offres tarifaires (Free, Basic, Premium) et blocage immédiat des accès d'une entreprise en cas d'impayé.</li>
                </ul>
              </div>
            )}

            {/* CHAPITRE 9 : PARAMETRES */}
            {activeSection === 'settings' && (
              <div className="animate-fade-in text-left">
                <h3>🔧 9. Configuration & Personnalisation</h3>
                <p className="mt-3">
                  Le menu **Paramètres** permet d'adapter le logiciel à votre environnement matériel.
                </p>

                <div className="guide-img-wrapper my-3">
                  <img src={settingsPanelImg} alt="Panneau des Paramètres généraux" className="guide-screenshot" />
                  <span className="img-caption">Figure 5 : Paramètres multi-onglets de l'application.</span>
                </div>

                <h4 className="mt-4">Configuration Matérielle POS :</h4>
                <p className="text-muted small">
                  Vous pouvez configurer le format d'impression des tickets de caisse (largeur 80mm standard ou 58mm compact) 
                  et choisir le type de communication avec votre lecteur de codes-barres (USB-HID en émulation clavier ou port COM virtuel).
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

      <style>{`
        .guide-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1;
        }

        .guide-layout {
          width: 100%;
          max-width: 1200px;
          padding: 40px;
          margin-top: 80px;
          transition: all var(--transition-normal);
        }

        .guide-header {
          text-align: left;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .guide-subtitle {
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .guide-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
          align-items: flex-start;
        }

        .guide-sidebar {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--bg-input);
          padding: 16px;
          border-radius: var(--border-radius-md);
          border: 1px solid var(--border-color);
        }

        .guide-menu-btn {
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          font-family: var(--font-title);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
          outline: none;
        }

        .guide-menu-btn:hover {
          background: var(--border-color);
          color: var(--text-main);
          padding-left: 20px;
        }

        .guide-menu-btn.active {
          background: var(--color-primary);
          color: #ffffff;
        }

        .guide-content {
          min-height: 400px;
        }

        .guide-content h3 {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-main);
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        .guide-content h4 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-main);
          margin-top: 24px;
          margin-bottom: 12px;
        }

        .guide-content p {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--text-muted);
        }

        .alert-box {
          background: rgba(15, 74, 134, 0.05);
          border-left: 4px solid var(--color-primary);
          padding: 16px;
          border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
          font-size: 13.5px;
          color: var(--text-main);
        }

        .guide-img-wrapper {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 16px;
          text-align: center;
        }

        .guide-screenshot {
          max-width: 100%;
          height: auto;
          border-radius: var(--border-radius-sm);
          box-shadow: var(--box-shadow);
          border: 1px solid var(--border-color);
        }

        .img-caption {
          display: block;
          margin-top: 10px;
          font-size: 12px;
          color: var(--text-muted);
          font-style: italic;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .guide-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .guide-sidebar {
            flex-direction: row;
            overflow-x: auto;
            white-space: nowrap;
            gap: 12px;
            padding: 12px;
          }

          .guide-menu-btn {
            width: auto;
            padding: 8px 16px;
          }

          .guide-menu-btn:hover {
            padding-left: 16px;
          }
        }
      `}</style>
    </div>
  );
};
