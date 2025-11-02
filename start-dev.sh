#!/bin/bash
# Script de démarrage rapide pour SANTE.GA
# Lance automatiquement le backend Neural (port 3000) et le frontend React (port 8080)

echo "🚀 Démarrage de SANTE.GA en mode développement..."
echo ""
echo "📦 Vérification des dépendances..."

# Vérifier que node_modules existe
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules manquant. Installation..."
    npm install
fi

echo "✅ Dépendances OK"
echo ""
echo "🧠 Démarrage du Backend Neural (port 3000)..."
echo "⚛️  Démarrage du Frontend React (port 8080)..."
echo ""
echo "📍 URLs:"
echo "   - Frontend: http://localhost:8080"
echo "   - Backend:  http://localhost:3000"
echo "   - Health:   http://localhost:3000/health"
echo ""
echo "💡 Utilisez Ctrl+C pour arrêter les deux serveurs"
echo ""

# Lancer les deux serveurs avec concurrently
npm run dev:full
