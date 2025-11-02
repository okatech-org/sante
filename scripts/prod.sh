#!/bin/bash

# Script de production SANTE.GA
# Build React + Démarre Express serveur

echo "🚀 SANTE.GA - Mode Production"
echo "=============================="
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non installé"
    exit 1
fi

echo "✅ Node.js $(node --version)"
echo ""

# Vérifier .env
if [ ! -f .env ]; then
    echo "❌ Fichier .env manquant (REQUIS en production)"
    echo "📝 Créez un fichier .env à partir de ENV_CONFIGURATION.md"
    exit 1
fi

echo "✅ Configuration .env trouvée"
echo ""

# Installer les dépendances
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm ci --production
    echo ""
fi

# Build React
echo "🔨 Build du frontend React..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build échoué"
    exit 1
fi

echo ""
echo "✅ Build réussi → dist/"
echo ""

# Vérifier que dist/ existe
if [ ! -d "dist" ]; then
    echo "❌ Dossier dist/ manquant"
    exit 1
fi

echo "📊 Taille du build:"
du -sh dist/
echo ""

# Démarrer Express en mode production
echo "🎯 Démarrage du serveur Express..."
echo ""
echo "Frontend + Backend : http://localhost:8080"
echo "Health Check       : http://localhost:8080/health"
echo "Dashboard Ministre : http://localhost:8080/gouv/dashboard"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo "=============================="
echo ""

NODE_ENV=production npm run start

