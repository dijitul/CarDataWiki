#!/usr/bin/env bash
#
# CarDataWiki — production data import runner
#
# Runs the UK data-expansion pipeline against the LIVE database defined by
# DATABASE_URL in ./.env. Takes a backup first. Safe to re-run: every importer
# only fills blank fields and never overwrites existing/edited data.
#
# Usage (as the deploy user, from the app directory):
#   cd /var/www/cardata.wiki
#   git pull
#   bash scripts/deploy-import.sh
#
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1
echo "==> App directory: $(pwd)"

if [ ! -f .env ]; then echo "!! No .env found — aborting."; exit 1; fi
if [ ! -f package.json ]; then echo "!! No package.json — wrong directory?"; exit 1; fi

# --- 1. Backup the live database -------------------------------------------
DB_URL=$(grep -E '^DATABASE_URL=' .env | head -1 | sed -E 's/^DATABASE_URL=//; s/^"//; s/"$//')
STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP="db-backup-$STAMP.sql"
echo "==> Backing up database to $BACKUP ..."
if command -v pg_dump >/dev/null 2>&1; then
  if pg_dump "$DB_URL" > "$BACKUP" 2>/dev/null; then
    echo "    Backup OK ($(du -h "$BACKUP" | cut -f1))"
  else
    echo "!! pg_dump failed. Stop here and check the database is reachable before importing."
    exit 1
  fi
else
  echo "!! pg_dump not installed. Install postgresql-client or take a snapshot before continuing."
  echo "   Re-run this script once you have a backup. Aborting to be safe."
  exit 1
fi

# --- 2. Dependencies + Prisma client ---------------------------------------
echo "==> Installing dependencies (including dev, needed for tsx/prisma) ..."
npm install --include=dev --no-audit --no-fund || { echo "!! npm install failed"; exit 1; }
echo "==> Generating Prisma client ..."
npm run db:generate || { echo "!! prisma generate failed"; exit 1; }

# --- 3. Imports (required — data ships in git) -----------------------------
run () { echo; echo "==> $1"; shift; "$@" || echo "!! step failed (continuing): $*"; }

run "Importing researched UK brands/variants"      npm run import:research
run "Importing official UK VCA fuel/emissions data" npm run import:vca

# --- 4. Optional steps (need files not stored in git) ----------------------
if [ -f data-research/05-sva-vehicle-tree.json ]; then
  run "Importing SVA generation/chassis taxonomy" npm run import:sva
else
  echo; echo "-- Skipping SVA import (data-research/05-sva-*.json not present on server)."
fi

if [ -f oev.csv ]; then
  run "Enriching EVs from OpenEV Data" npm run enrich:openev
else
  echo; echo "-- Skipping OpenEV enrichment (oev.csv not present on server)."
fi

# --- 5. Enrichment + cleanup (live API + local) ----------------------------
run "Enriching weights/wheelbase from EEA (slow, ~10-15 min)" npm run enrich:eea
run "Merging duplicate model families" npx tsx scripts/merge-duplicate-models.ts

echo
echo "============================================================"
echo "Import finished. Backup saved as $BACKUP"
echo "Now restart the app so pages pick up the new data, e.g.:"
echo "   pm2 restart all      (if using pm2)"
echo "   sudo systemctl restart cardata   (if using systemd)"
echo "============================================================"
