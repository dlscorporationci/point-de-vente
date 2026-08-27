#!/bin/bash
# Script de démarrage + réparation MySQL LAMPP pour ApexPOS Phase 2 Tests
# Usage : bash /opt/lampp/htdocs/point_de_vente/laravel-pos-api/scripts/start_lampp_mysql.sh

set -e

echo "=== ApexPOS — Démarrage MySQL LAMPP ==="

# 1. Tuer les processus sudo bloqués
echo "[1/5] Nettoyage des processus sudo bloqués..."
sudo kill -9 $(ps aux | grep "lampp start" | grep -v grep | awk '{print $2}') 2>/dev/null || true

# 2. Démarrer MySQL LAMPP
echo "[2/5] Démarrage de MySQL LAMPP..."
sudo /opt/lampp/lampp startmysql
sleep 5

# 3. Tenter une connexion rapide
if /opt/lampp/bin/mysql -u root -e "SELECT 1;" 2>/dev/null; then
    echo "[3/5] MySQL connecté. Vérification du schéma..."
    # 4. Lancer mysql_upgrade si nécessaire (corrige column_stats)
    /opt/lampp/bin/mysql_upgrade -u root --force 2>&1 | tail -5 || true
    echo "[4/5] Schéma vérifié."
else
    echo "[3/5] MySQL pas encore accessible. Vérification du log..."
    tail -10 /opt/lampp/var/mysql/aizen-Latitude-E6230.err
    echo ""
    echo "ERREUR : MySQL ne démarre pas. Vérifiez le log ci-dessus."
    exit 1
fi

# 5. Lancer les 4 suites de tests
echo "[5/5] Lancement des suites de qualification Phase 2.3 → 2.6..."
cd /opt/lampp/htdocs/point_de_vente/laravel-pos-api

echo ""
echo "════════════════════════════════════════════════════════"
echo "  PHASE 2.3 — MU-05 + MU-07"
echo "════════════════════════════════════════════════════════"
php tests/test_phase2_3_scenarios.php

echo ""
echo "════════════════════════════════════════════════════════"
echo "  PHASE 2.4 — MU-08 (Résilience)"
echo "════════════════════════════════════════════════════════"
php tests/test_phase2_4_scenarios.php

echo ""
echo "════════════════════════════════════════════════════════"
echo "  PHASE 2.5 — MU-10 (RBAC)"
echo "════════════════════════════════════════════════════════"
php tests/test_phase2_5_rbac_scenarios.php

echo ""
echo "════════════════════════════════════════════════════════"
echo "  PHASE 2.6 — MU-09 (Charge)"
echo "════════════════════════════════════════════════════════"
php tests/test_phase2_6_load_scenarios.php

echo ""
echo "=== Qualification Phase 2.3 → 2.6 terminée ==="
