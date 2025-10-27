#!/bin/bash

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
POSTGRES_CONTAINER="sante-ga-postgres"
REDIS_CONTAINER="sante-ga-redis-prod"

# Créer dossier backup
mkdir -p "$BACKUP_DIR"

echo "🧠 SANTE.GA - Backup Script"
echo "🕐 Started: $DATE"
echo ""

# ============================================
# BACKUP POSTGRESQL
# ============================================
echo "📦 Backing up PostgreSQL..."
if docker exec "$POSTGRES_CONTAINER" pg_dump -U postgres sante_ga > \
  "$BACKUP_DIR/postgres_${DATE}.sql" 2>/dev/null; then
    
    # Compresser
    gzip "$BACKUP_DIR/postgres_${DATE}.sql"
    SIZE=$(du -h "$BACKUP_DIR/postgres_${DATE}.sql.gz" | cut -f1)
    echo "✅ PostgreSQL backup complete: $SIZE"
else
    echo "❌ PostgreSQL backup failed"
fi

echo ""

# ============================================
# BACKUP REDIS
# ============================================
echo "📦 Backing up Redis..."
if docker exec "$REDIS_CONTAINER" redis-cli BGSAVE > /dev/null 2>&1; then
    
    # Copier dump.rdb
    if docker cp "$REDIS_CONTAINER:/data/dump.rdb" \
      "$BACKUP_DIR/redis_${DATE}.rdb" 2>/dev/null; then
        SIZE=$(du -h "$BACKUP_DIR/redis_${DATE}.rdb" | cut -f1)
        echo "✅ Redis backup complete: $SIZE"
    else
        echo "❌ Redis copy failed"
    fi
else
    echo "❌ Redis backup failed"
fi

echo ""

# ============================================
# CLEANUP OLD BACKUPS (Keep last 7 days)
# ============================================
echo "🧹 Cleaning up old backups (keeping last 7 days)..."
DELETED=$(find "$BACKUP_DIR" -type f -mtime +7 -delete -print | wc -l)
echo "🗑️ Deleted $DELETED old backups"

echo ""
echo "✅ Backup completed: $DATE"
echo "📁 Backup location: $BACKUP_DIR"
echo ""

# ============================================
# BACKUP LOGS
# ============================================
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo "📊 Total backup size: $TOTAL_SIZE"
ls -lh "$BACKUP_DIR" | tail -5
