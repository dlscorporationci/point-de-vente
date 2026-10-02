/**
 * Modèles de textes officiels exacts pour les 5 pages légales DLS POS.
 * Conformes mot pour mot aux 5 documents PDF fournis.
 */
export const DEFAULT_LEGAL_PAGES = {
  cgu: `<article className="legal-document">
  <div className="mb-4">
    <h2 style="font-size: 22px; font-weight: 800; color: #1e293b;">
      Conditions générales d’utilisation — CGU
    </h2>
    <p style="font-size: 13px; color: #64748b;">Dernière mise à jour : 01/10/2026</p>
  </div>

  <p>
    Le site <strong>pos.dlscorporation.ci</strong> est exploité par <strong>DLS CORPORATION</strong>, située à <strong>ABIDJAN COCODY ANGRE COTE D'IVOIRE</strong>. Pour toute question, contactez-nous à <a href="mailto:infos@dlscorporation.ci">infos@dlscorporation.ci</a>.
  </p>
  <p>L’utilisation du site implique l’acceptation des présentes conditions.</p>

  <h3>Accès et utilisation</h3>
  <p>
    Le site permet de consulter et d’acheter des produits digitaux. L’utilisateur s’engage à fournir des informations exactes et à utiliser le site de manière licite.
  </p>
  <p>
    Lorsqu’un compte est nécessaire, l’utilisateur doit préserver la confidentialité de ses identifiants et signaler tout accès non autorisé.
  </p>

  <h3>Propriété intellectuelle</h3>
  <p>
    Les contenus du site et les produits proposés sont protégés par les droits de leurs titulaires. L’achat d’un produit accorde uniquement les droits d’utilisation précisés sur sa fiche ou dans sa licence.
  </p>
  <p>
    Sauf autorisation explicite, la redistribution, la revente et le partage public du produit sont interdits.
  </p>

  <h3>Disponibilité</h3>
  <p>
    Des interruptions peuvent survenir pour maintenance ou en raison de problèmes techniques. En cas de difficulté d’accès à un produit acheté, l’utilisateur peut contacter notre assistance.
  </p>

  <h3>Données personnelles</h3>
  <p>
    Les informations nécessaires à la commande sont utilisées pour traiter le paiement, fournir le produit et assurer le suivi client. Les modalités de traitement sont décrites dans notre politique de confidentialité.
  </p>

  <h3>Contact</h3>
  <p>
    <strong>DLS CORPORATION</strong><br />
    Adresse : <strong>ABIDJAN COCODY ANGRE COTE D'IVOIRE</strong><br />
    E-mail : <a href="mailto:infos@dlscorporation.ci">infos@dlscorporation.ci</a><br />
    Téléphone : <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>
  </p>
</article>`,

  cgv: `<article className="legal-document">
  <div className="mb-4">
    <h2 style="font-size: 22px; font-weight: 800; color: #1e293b;">
      Conditions générales de vente — CGV
    </h2>
    <p style="font-size: 13px; color: #64748b;">Dernière mise à jour : 01/10/2026</p>
  </div>

  <p>
    Les présentes conditions encadrent les achats de produits digitaux sur <strong>pos.dlscorporation.ci</strong>, exploité par <strong>DLS CORPORATION</strong>, située à <strong>ABIDJAN COCODY ANGRE COTE D'IVOIRE</strong>.
  </p>

  <h3>Produits</h3>
  <p>
    Les caractéristiques, le contenu, les formats, les prérequis techniques et les éventuelles restrictions d’utilisation sont indiqués sur chaque fiche produit.
  </p>
  <p>
    Pour les abonnements, la durée, la fréquence de facturation et les conditions de renouvellement ou de résiliation sont précisées avant l’achat.
  </p>

  <h3>Prix et paiement</h3>
  <p>
    Les prix sont affichés en <strong>Francs CFA (XOF) / Euros (€)</strong>. Les taxes et frais éventuels sont précisés avant la validation de la commande.
  </p>
  <p>
    La commande est confirmée après validation du paiement. Aucun accès payant n’est délivré tant que le paiement n’est pas confirmé.
  </p>

  <h3>Livraison numérique</h3>
  <p>
    Les produits sont fournis par téléchargement, e-mail, activation de licence ou accès à un espace client, selon la description du produit.
  </p>
  <p>
    Les modalités et délais figurent dans notre politique de livraison.
  </p>

  <h3>Licence d’utilisation</h3>
  <p>
    Le client bénéficie d’un droit d’utilisation dans les limites indiquées sur la fiche produit ou dans la licence applicable. L’achat ne transfère pas la propriété intellectuelle du produit.
  </p>
  <p>
    La revente, la redistribution ou le partage avec des tiers nécessitent une autorisation explicite, sauf si la licence les permet.
  </p>

  <h3>Assistance et remboursement</h3>
  <p>
    Toute difficulté doit être signalée à <a href="mailto:infos@dlscorporation.ci">infos@dlscorporation.ci</a>, en précisant la référence de commande.
  </p>
  <p>
    Les demandes de remboursement sont traitées conformément à notre politique de remboursement, sans limiter les droits obligatoires applicables au client.
  </p>

  <h3>Contact</h3>
  <p>
    Entreprise : <strong>DLS CORPORATION</strong><br />
    Adresse : <strong>ABIDJAN COCODY ANGRE COTE D'IVOIRE</strong><br />
    E-mail : <a href="mailto:infos@dlscorporation.ci">infos@dlscorporation.ci</a><br />
    Téléphone : <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>
  </p>
</article>`,

  delivery_policy: `<article className="legal-document">
  <div className="mb-4">
    <h2 style="font-size: 22px; font-weight: 800; color: #1e293b;">
      Politique de livraison et d’activation de DLS POS
    </h2>
    <p style="font-size: 13px; color: #64748b;">Dernière mise à jour : 01/10/2026</p>
  </div>

  <h3>1. Livraison numérique</h3>
  <p>
    DLS POS est un logiciel de caisse en SaaS. Sa livraison consiste à activer un espace professionnel et à fournir les informations permettant d’y accéder.
  </p>
  <p>
    Aucune livraison physique n’est incluse dans l’abonnement. Un achat de matériel fait l’objet de conditions distinctes.
  </p>

  <h3>2. Modalités d’accès</h3>
  <p>Après confirmation du paiement, le client reçoit ou retrouve :</p>
  <ul>
    <li>l’adresse de connexion ;</li>
    <li>une invitation à créer son mot de passe ou les instructions d’accès ;</li>
    <li>la confirmation de l’offre activée ;</li>
    <li>les coordonnées de l’assistance.</li>
  </ul>
  <p>
    Ces informations sont transmises à l’adresse e-mail renseignée lors de la commande ou mises à disposition dans l’espace client.
  </p>

  <h3>3. Délais</h3>
  <p>Lorsque l’activation est automatique, l’accès est ouvert après confirmation du paiement.</p>
  <p>
    Lorsqu’une intervention manuelle est nécessaire, l’activation intervient sous <strong>48 heures ouvrées</strong>, à compter de la confirmation du paiement et de la réception des informations indispensables.
  </p>
  <p>Un délai différent peut être convenu pour une configuration particulière.</p>

  <h3>4. Configuration et import</h3>
  <p>
    La création de plusieurs boutiques, l’import d’un catalogue, la reprise de stocks, la formation ou une intégration spécifique peuvent nécessiter un délai supplémentaire.
  </p>
  <p>Le périmètre, le prix et le calendrier de ces prestations sont précisés dans l’offre ou le devis.</p>

  <h3>5. Prérequis</h3>
  <p>
    Le client doit disposer d’un appareil compatible, d’un navigateur pris en charge et d’une connexion Internet.
  </p>
  <p>
    La compatibilité des imprimantes de tickets, lecteurs de codes-barres et autres périphériques doit être vérifiée avant leur achat. Elle n’est pas garantie pour tous les modèles.
  </p>

  <h3>6. Absence d’accès</h3>
  <p>
    Si l’accès n’est pas reçu dans le délai annoncé, le client doit vérifier ses courriers indésirables puis contacter <a href="mailto:infos@dlscorporation.ci">infos@dlscorporation.ci</a> avec sa référence de commande.
  </p>
  <p>
    DLS CORPORATION vérifie le paiement et procède au renvoi de l’invitation ou au rétablissement de l’accès.
  </p>

  <h3>7. Frais</h3>
  <p>Aucun frais de livraison physique ne s’applique à l’abonnement SaaS.</p>
  <p>Les éventuels frais de mise en service, formation ou configuration sont annoncés avant la commande.</p>

  <h3>8. Contact</h3>
  <p>
    <strong>DLS CORPORATION</strong><br />
    Adresse : <strong>ABIDJAN COCODY ANGRE COTE D'IVOIRE</strong><br />
    E-mail : <a href="mailto:infos@dlscorporation.ci">infos@dlscorporation.ci</a><br />
    Téléphone : <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>
  </p>
</article>`,

  refund_policy: `<article className="legal-document">
  <div className="mb-4">
    <h2 style="font-size: 22px; font-weight: 800; color: #1e293b;">
      Politique de remboursement de DLS POS
    </h2>
    <p style="font-size: 13px; color: #64748b;">Dernière mise à jour : 01/10/2026</p>
  </div>

  <h3>1. Objet</h3>
  <p>
    Cette politique encadre les demandes de remboursement des abonnements à DLS POS et des prestations associées.
  </p>

  <h3>2. Situations prises en charge</h3>
  <p>Un remboursement peut être accordé notamment en cas de :</p>
  <ul>
    <li>paiement en double pour la même échéance ;</li>
    <li>paiement encaissé sans activation, lorsque DLS CORPORATION ne peut fournir l’accès ;</li>
    <li>activation d’une offre différente de celle achetée, sans correction possible ;</li>
    <li>dysfonctionnement substantiel du service empêchant l’utilisation des fonctions souscrites et non résolu après intervention de l’assistance ;</li>
    <li>prélèvement effectué après la prise en compte d’une résiliation applicable à cette échéance.</li>
  </ul>

  <h3>3. Traitement des incidents</h3>
  <p>
    DLS CORPORATION peut d’abord proposer une correction, un rétablissement de l’accès ou une solution équivalente acceptée par le client.
  </p>
  <p>
    Si aucune solution satisfaisante n’est possible, un remboursement total ou partiel est déterminé selon la période et les fonctions concernées.
  </p>
  <p>
    Une indisponibilité significative imputable au service peut donner lieu à une prolongation d’abonnement acceptée par le client ou à un remboursement proportionnel à la période affectée.
  </p>

  <h3>4. Changement d’avis</h3>
  <p>
    Hors droits obligatoires applicables, un changement d’avis après activation ne donne pas automatiquement droit à un remboursement.
  </p>
  <p>
    L’arrêt d’utilisation du logiciel ou la résiliation en cours de période n’entraîne pas automatiquement le remboursement des jours ou mois restants.
  </p>

  <h3>5. Prestations complémentaires</h3>
  <p>
    Pour les prestations de formation, configuration, import ou développement spécifique, un remboursement éventuel tient compte du travail déjà réalisé et des conditions du devis.
  </p>
  <p>Une prestation non commencée peut être annulée selon les conditions convenues.</p>

  <h3>6. Demande</h3>
  <p>Le client doit écrire à <a href="mailto:infos@dlscorporation.ci">infos@dlscorporation.ci</a> en indiquant :</p>
  <ul>
    <li>le nom de l’entreprise et l’e-mail du compte ;</li>
    <li>la référence de commande ou de transaction ;</li>
    <li>la date et le montant du paiement ;</li>
    <li>le motif et les éléments utiles à l’analyse.</li>
  </ul>
  <p>
    Pour faciliter les vérifications, il est recommandé de signaler le problème dans les <strong>14 jours suivant sa découverte</strong>. Ce délai ne limite pas les droits obligatoires applicables.
  </p>
  <p>Aucun code PIN, mot de passe ou code de validation ne doit être transmis.</p>

  <h3>7. Délais et moyen de remboursement</h3>
  <p>DLS CORPORATION apporte une première réponse sous <strong>3 jours ouvrés</strong>.</p>
  <p>
    Après acceptation, le remboursement est initié sous <strong>7 jours ouvrés</strong>, généralement par le moyen de paiement d’origine.
  </p>
  <p>Le délai de réception dépend ensuite du prestataire de paiement.</p>

  <h3>8. Conséquences sur l’accès</h3>
  <p>
    Un remboursement total d’une période peut entraîner la désactivation de l’accès correspondant. Le client est informé de la date de désactivation et des possibilités d’export de ses données.
  </p>

  <h3>9. Contact</h3>
  <p>
    <strong>DLS CORPORATION</strong><br />
    Adresse : <strong>ABIDJAN COCODY ANGRE COTE D'IVOIRE</strong><br />
    E-mail : <a href="mailto:infos@dlscorporation.ci">infos@dlscorporation.ci</a><br />
    Téléphone : <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>
  </p>
</article>`,

  privacy_policy: `<article className="legal-document">
  <div className="mb-4">
    <h2 style="font-size: 22px; font-weight: 800; color: #1e293b;">
      Politique de confidentialité de DLS POS
    </h2>
    <p style="font-size: 13px; color: #64748b;">Dernière mise à jour : 01/10/2026</p>
  </div>

  <h3>1. Présentation</h3>
  <p>
    DLS CORPORATION traite les données nécessaires à la gestion des comptes, des abonnements et du fonctionnement de DLS POS.
  </p>
  <p>
    Pour les données commerciales enregistrées par le client dans le logiciel, DLS CORPORATION intervient pour fournir le service selon les instructions du client. Celui-ci détermine les informations qu’il collecte et les usages qu’il en fait.
  </p>

  <h3>2. Données traitées</h3>
  <p>Selon l’utilisation du service, les données peuvent comprendre :</p>
  <ul>
    <li>les coordonnées de l’entreprise et de ses représentants ;</li>
    <li>les noms, e-mails et droits d'accès des utilisateurs ;</li>
    <li>les informations de facturation et références de paiement ;</li>
    <li>les données de ventes, stocks, produits, clients et fournisseurs ;</li>
    <li>les journaux de connexion et d’opérations ;</li>
    <li>les échanges avec l’assistance.</li>
  </ul>
  <p>
    Les données techniques traitées peuvent inclure l’adresse IP, le navigateur et les informations nécessaires au diagnostic des incidents.
  </p>

  <h3>3. Utilisation</h3>
  <p>Les données servent à :</p>
  <ul>
    <li>créer et administrer les comptes ;</li>
    <li>fournir les fonctions du logiciel ;</li>
    <li>gérer les abonnements et la facturation ;</li>
    <li>assurer l’assistance, la sécurité et la maintenance ;</li>
    <li>prévenir les accès non autorisés ;</li>
    <li>répondre aux obligations applicables.</li>
  </ul>
  <p>
    Les communications promotionnelles sont gérées séparément des messages nécessaires au service, avec les possibilités d’opposition ou de désinscription applicables.
  </p>

  <h3>4. Accès et prestataires</h3>
  <p>
    L’accès est limité aux personnes et prestataires qui en ont besoin pour leurs missions, notamment l’hébergement, le paiement et l’assistance.
  </p>
  <p>
    <strong>Hébergement :</strong> Hébergement Cloud sécurisé (France / Côte d'Ivoire)<br />
    <strong>Paiement :</strong> Services de paiement sécurisés (Orange Money, Wave, MTN MoMo, Moov Money, Carte Bancaire)
  </p>
  <p><strong>DLS CORPORATION ne vend pas les données commerciales du client.</strong></p>
  <p>
    Une intervention de l’assistance sur les données est limitée à ce qui est nécessaire pour traiter la demande ou sécuriser le service.
  </p>

  <h3>5. Sécurité et sauvegardes</h3>
  <p>
    DLS CORPORATION met en œuvre des mesures techniques et organisationnelles adaptées, notamment la gestion des accès et la protection des échanges.
  </p>
  <p>
    <strong>Modalités de sauvegarde :</strong> Sauvegardes quotidiennes automatiques conservées pendant 30 jours avec restauration sur demande.
  </p>
  <p>
    Le client doit également sécuriser ses appareils, gérer les droits de ses utilisateurs et conserver les exports nécessaires à ses activités.
  </p>

  <h3>6. Conservation</h3>
  <p>Les données du compte sont conservées pendant la durée nécessaire à la fourniture du service.</p>
  <p>
    Après la fin de l’abonnement, les données opérationnelles suivent les délais d’export et de suppression annoncés dans les CGU : demande d’export pendant <strong>30 jours</strong>, puis suppression ou anonymisation sous <strong>90 jours</strong>, sauf obligation ou accord contraire.
  </p>
  <p>
    Les pièces comptables, preuves de paiement et éléments nécessaires au traitement des litiges peuvent être conservés plus longtemps lorsque cela est requis.
  </p>
  <p>Les sauvegardes résiduelles sont supprimées selon leur cycle de remplacement.</p>

  <h3>7. Demandes relatives aux données</h3>
  <p>
    Les personnes concernées peuvent contacter <a href="mailto:infos@dlscorporation.ci">infos@dlscorporation.ci</a> pour demander l’accès, la rectification ou la suppression de leurs données, ainsi que les autres droits applicables à leur situation.
  </p>
  <p>
    Lorsqu’une demande concerne les données enregistrées par une entreprise cliente, elle doit généralement être adressée à cette entreprise. DLS CORPORATION l’assiste dans la mesure nécessaire.
  </p>
  <p>Une vérification d’identité ou d’autorisation peut être demandée avant toute communication.</p>

  <h3>8. Cookies</h3>
  <p>
    DLS POS peut utiliser des cookies nécessaires à la connexion, à la sécurité et à la mémorisation des préférences.
  </p>
  <p>
    Les éventuels outils de mesure d’audience ou de publicité doivent être décrits et soumis aux choix requis avant leur utilisation.
  </p>

  <h3>9. Contact</h3>
  <p>
    <strong>DLS CORPORATION</strong><br />
    Adresse : <strong>ABIDJAN COCODY ANGRE COTE D'IVOIRE</strong><br />
    E-mail relatif aux données personnelles : <a href="mailto:infos@dlscorporation.ci">infos@dlscorporation.ci</a><br />
    Téléphone : <strong>+225 07 08 74 41 15 / +225 05 66 28 93 94</strong>
  </p>
</article>`
};
