#!/usr/bin/env bash

# Exit immediately if a command fails or unbound variable used
set -euo pipefail

# ── 1. Configuration & Default Values ────────────────────────────────────────
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-quincaillerie_pos}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-root}"
BACKUP_DIR="${BACKUP_DIR:-$(pwd)/storage/backups}"

mkdir -p "$BACKUP_DIR"

# ── 2. Binary Detection ──────────────────────────────────────────────────────
DUMP_BIN=""
if [ -x "/opt/lampp/bin/mysqldump" ]; then
    DUMP_BIN="/opt/lampp/bin/mysqldump"
elif command -v mariadb-dump >/dev/null 2>&1; then
    DUMP_BIN="mariadb-dump"
elif command -v mysqldump >/dev/null 2>&1; then
    DUMP_BIN="mysqldump"
else
    echo "[ERROR] Aucun outil de dump (mysqldump / mariadb-dump) n'a été trouvé." >&2
    exit 1
fi

# ── 3. Backup Execution ──────────────────────────────────────────────────────
TIMESTAMP=$(date +"%Y-%m-%dT%H-%M-%S")
BACKUP_FILENAME="apexpos_${DB_NAME}_${TIMESTAMP}.sql.gz"
BACKUP_FILE="${BACKUP_DIR}/${BACKUP_FILENAME}"

echo "========================================================="
echo "   ApexPOS Enterprise — Backup Database Task"
echo "========================================================="
echo "▶ Host        : ${DB_HOST}:${DB_PORT}"
echo "▶ Database    : ${DB_NAME}"
echo "▶ Backup Path : ${BACKUP_FILE}"
echo "---------------------------------------------------------"

# Secret-safe execution: pass password via MYSQL_PWD environment variable
export MYSQL_PWD="${DB_PASSWORD}"

if ! "$DUMP_BIN" \
    --host="${DB_HOST}" \
    --port="${DB_PORT}" \
    --user="${DB_USER}" \
    --single-transaction \
    --routines \
    --triggers \
    "${DB_NAME}" 2>/dev/null | gzip -c > "${BACKUP_FILE}"; then

    # Fallback sans --routines si la version mysql.proc système diffère
    if ! "$DUMP_BIN" \
        --host="${DB_HOST}" \
        --port="${DB_PORT}" \
        --user="${DB_USER}" \
        --single-transaction \
        --triggers \
        "${DB_NAME}" 2>/dev/null | gzip -c > "${BACKUP_FILE}"; then
        echo "[ERROR] La commande de dump a échoué." >&2
        rm -f "${BACKUP_FILE}"
        unset MYSQL_PWD
        exit 1
    fi
fi

unset MYSQL_PWD

# ── 4. Verification ──────────────────────────────────────────────────────────
if [ ! -s "${BACKUP_FILE}" ]; then
    echo "[ERROR] Le fichier de sauvegarde est vide ou inexistant." >&2
    rm -f "${BACKUP_FILE}"
    exit 1
fi

if ! gzip -t "${BACKUP_FILE}" 2>/dev/null; then
    echo "[ERROR] Le fichier de sauvegarde est un fichier gzip corrompu." >&2
    rm -f "${BACKUP_FILE}"
    exit 1
fi

FILE_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)

echo "▶ Statut      : SUCCESS (gzip valide)"
echo "▶ Taille      : ${FILE_SIZE}"
echo "▶ Fichier     : ${BACKUP_FILENAME}"
echo "========================================================="

exit 0
