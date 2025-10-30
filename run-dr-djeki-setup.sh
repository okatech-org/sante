#!/bin/bash

# Script de configuration du Dr. DJEKI avec multi-rôles
# Date: 30/10/2025

echo "🏥 CONFIGURATION DR. JULES DJEKI - MULTI-RÔLES"
echo "=============================================="
echo ""

# Vérifier les prérequis
if [ ! -f .env ]; then
    echo "❌ Fichier .env manquant"
    exit 1
fi

echo "📝 Ce script va configurer :"
echo "   - Dr. DJEKI comme Directeur Médical au CMST SOGARA"
echo "   - Dr. DJEKI comme Médecin Consultant au CMST SOGARA" 
echo "   - Une invitation du CHU Libreville"
echo "   - Des établissements de test"
echo ""

read -p "Continuer ? (o/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Oo]$ ]]; then
    echo "Annulé."
    exit 1
fi

echo ""
echo "🚀 Étape 1: Application des migrations SQL"
echo "   Veuillez exécuter dans Supabase SQL Editor :"
echo "   - supabase/migrations/20251030_invitations_requests.sql"
echo ""
read -p "Appuyez sur Entrée après avoir exécuté la migration..."

echo ""
echo "🚀 Étape 2: Configuration du Dr. DJEKI"
node scripts/setup-dr-djeki-multi-roles.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Configuration terminée avec succès!"
    echo ""
    echo "📋 INFORMATIONS DE CONNEXION"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Email    : directeur.sogara@sante.ga"
    echo "Password : DirecteurSOGARA2024!"
    echo ""
    echo "🔗 LIENS DE TEST"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Dashboard Pro    : http://localhost:8080/professional/dashboard"
    echo "Dashboard SOGARA : http://localhost:8080/establishments/sogara/admin"
    echo "Établissements   : http://localhost:8080/professional/establishments"
    echo ""
    echo "💡 FONCTIONNALITÉS À TESTER"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. Double badge (Directeur + Médecin)"
    echo "2. Bouton 'Dashboard SOGARA'"
    echo "3. Menu adaptatif selon le rôle"
    echo "4. Invitation du CHU Libreville"
    echo "5. Actions rapides contextuelles"
else
    echo ""
    echo "❌ La configuration a échoué"
    echo "Vérifiez les logs ci-dessus"
    exit 1
fi
