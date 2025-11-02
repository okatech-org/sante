#!/bin/bash

# Script de développement SANTE.GA
# Démarre frontend (Vite) et backend (Express) en parallèle

echo "🚀 SANTE.GA - Mode Développement"
echo "================================"
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
    echo "⚠️  Fichier .env manquant"
    echo "📝 Créez un fichier .env à partir de ENV_CONFIGURATION.md"
    echo ""
    read -p "Continuer quand même ? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo ""
fi

# Fonction de nettoyage
cleanup() {
    echo ""
    echo "🛑 Arrêt des processus..."
    kill 0
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "🎯 Démarrage des services..."
echo ""
echo "Frontend Vite  : http://localhost:8080"
echo "Backend Express: http://localhost:8080"
echo "Health Check   : http://localhost:8080/health"
echo ""
echo "📍 Dashboard Ministre: http://localhost:8080/gouv/dashboard"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo "================================"
echo ""

# Démarrer Vite (frontend) en développement
npm run dev &
VITE_PID=$!

# Attendre que les services démarrent
sleep 3

echo ""
echo "✅ Services démarrés!"
echo ""
echo "📊 Logs en temps réel..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Attendre la fin
wait

