# ============================================
# STAGE 1 : BUILD
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Installation dépendances (production only)
COPY package*.json ./
RUN npm ci --only=production

# Copie code source
COPY src ./src

# ============================================
# STAGE 2 : PRODUCTION
# ============================================
FROM node:18-alpine

WORKDIR /app

# Installation curl pour healthcheck
RUN apk add --no-cache curl

# Créer utilisateur non-root pour sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copier dépendances et code depuis builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --chown=nodejs:nodejs package*.json ./

# Créer dossier logs
RUN mkdir -p logs && chown nodejs:nodejs logs

# Changer utilisateur (non-root)
USER nodejs

# Variables environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Démarrage
CMD ["node", "src/neural/server.js"]
