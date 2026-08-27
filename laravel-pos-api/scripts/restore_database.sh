#!/usr/bin/env bash

# Exit immediately if a command fails or unbound variable used
set -euo pipefail

# ── 1. Parameter Validation ──────────────────────────────────────────────────
BACKUP_FILE="${1:-}"
TARGET_DB="${2:-}"

if [ -z "${BACKUP_FILE}" ] || [ -z "${TARGET_DB}" ]; then
    echo "[ERROR] Usage: $0 <backup_file.sql.gz> <target_database>" >&2
    exit 1
fi

# ── 2. CRITICAL SAFETY RULE — PRODUCTION PROTECTION ──────────────────────────
# Absolute prohibition against restoring directly into production database
FORBIDDEN_DBS=("quincaillerie_pos" "quincaillerie_pos_prod" "production")

for fdb in "${FORBIDDEN_DBS[@]}"; do
    if [ "${TARGET_DB}" = "${fdb}" ]; then
        echo "=========================================================" >&2
        echo " [CRITICAL ERROR] RESTORATION BLOCKED BY SAFETY GUARD" >&2
        echo " Restoring directly into production database '${TARGET_DB}'" >&2
        echo " is STRICTLY FORBIDDEN to prevent data destruction." >&2
        echo "=========================================================" >&2
        exit 1
    fi
done

# Allow target databases explicitly designated for testing/restore
if [[ "${TARGET_DB}" != *"_test"* ]] && [[ "${TARGET_DB}" != *"_restore"* ]] && [[ "${TARGET_DB}" != *"test_"* ]]; then
    echo "[ERROR] Target database '${TARGET_DB}' is not an authorized test/restore database name." >&2
    echo "Target database must contain '_test_', '_restore', or 'test_'." >&2
    exit 1
fi

# ── 3. File Verification ─────────────────────────────────────────────────────
if [ ! -f "${BACKUP_FILE}" ]; then
    echo "[ERROR] Le fichier de sauvegarde '${BACKUP_FILE}' est introuvable." >&2
    exit 1
fi

if ! gzip -t "${BACKUP_FILE}" 2>/dev/null; then
    echo "[ERROR] Le fichier '${BACKUP_FILE}' est un fichier gzip corrompu ou invalide." >&2
    exit 1
fi

# ── 4. Configuration & Binary Detection ──────────────────────────────────────
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-root}"

MYSQL_BIN=""
if [ -x "/opt/lampp/bin/mysql" ]; then
    MYSQL_BIN="/opt/lampp/bin/mysql"
elif command -v mariadb >/dev/null 2>&1; then
    MYSQL_BIN="mariadb"
elif command -v mysql >/dev/null 2>&1; then
    MYSQL_BIN="mysql"
else
    echo "[ERROR] Aucun client MySQL/MariaDB n'a été trouvé." >&2
    exit 1
fi

echo "========================================================="
echo "   ApexPOS Enterprise — Disaster Recovery Restore"
echo "========================================================="
echo "▶ Backup Source : $(basename "${BACKUP_FILE}")"
echo "▶ Target DB     : ${TARGET_DB} (Isolated Test Restore DB)"
echo "---------------------------------------------------------"

export MYSQL_PWD="${DB_PASSWORD}"

# Create target database if it does not exist
if ! "$MYSQL_BIN" --host="${DB_HOST}" --port="${DB_PORT}" --user="${DB_USER}" -e "CREATE DATABASE IF NOT EXISTS \`${TARGET_DB}\`;" 2>/dev/null; then
    echo "[ERROR] Échec lors de la création de la base cible '${TARGET_DB}'." >&2
    unset MYSQL_PWD
    exit 1
fi

# Decompress and restore into target database
if ! gunzip -c "${BACKUP_FILE}" | "$MYSQL_BIN" --host="${DB_HOST}" --port="${DB_PORT}" --user="${DB_USER}" "${TARGET_DB}" 2>/dev/null; then
    echo "[ERROR] Échec de la restauration dans la base '${TARGET_DB}'." >&2
    unset MYSQL_PWD
    exit 1
fi

unset MYSQL_PWD

echo "▶ Statut        : SUCCESS (Base '${TARGET_DB}' restaurée)"
echo "========================================================="

exit 0
