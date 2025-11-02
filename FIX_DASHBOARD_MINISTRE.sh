#!/bin/bash

echo "🔧 Fix Dashboard Ministre - Appliquer les changements"
echo "================================================"
echo ""

# Arrêter les serveurs existants
echo "1️⃣ Arrêt des serveurs existants..."
pkill -f "vite preview" || true
pkill -f "vite" || true
sleep 2

# Rebuild l'application
echo ""
echo "2️⃣ Rebuild de l'application avec les nouveaux composants..."
npm run build

# Redémarrer en mode preview
echo ""
echo "3️⃣ Redémarrage du serveur..."
npm run preview &

echo ""
echo "✅ Terminé !"
echo ""
echo "📍 Le dashboard du ministre sera accessible dans 10 secondes à:"
echo "   http://localhost:8080/gouv/dashboard"
echo ""
echo "💡 Si ça ne fonctionne pas, vider le cache du navigateur (Ctrl+Shift+R)"
echo ""

