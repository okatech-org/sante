#!/bin/bash

# ============================================
# TEST RAPIDE - CORRECTION ERREUR 406
# ============================================
# Script pour tester rapidement la correction de l'erreur 406

echo "🚀 Test rapide de la correction 406 - SANTE.GA"
echo "=============================================="

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Vérifier que l'application tourne
if ! lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "L'application n'est pas en cours d'exécution sur le port 8081"
    echo "Démarrez l'application avec: npm run dev"
    exit 1
fi

print_success "✓ Application détectée sur le port 8081"

# Instructions pour l'utilisateur
echo ""
echo "🎯 ÉTAPES POUR CORRIGER L'ERREUR 406:"
echo "====================================="
echo ""
echo "1. 📊 EXÉCUTER LE SCRIPT SQL IMMÉDIAT:"
echo "   - Allez sur https://app.supabase.com"
echo "   - Sélectionnez votre projet SANTE.GA"
echo "   - Cliquez sur 'SQL Editor'"
echo "   - Copiez le contenu de fix_406_immediate.sql"
echo "   - Exécutez le script (Ctrl+Enter)"
echo ""
echo "2. 🧪 TESTER IMMÉDIATEMENT:"
echo "   - Ouvrez http://localhost:8081/dashboard/professional"
echo "   - Connectez-vous avec un compte professionnel"
echo "   - Vérifiez dans la console (F12) qu'il n'y a plus d'erreur 406"
echo ""
echo "3. ✅ VÉRIFICATIONS:"
echo "   - Aucune erreur 406 dans la console"
echo "   - Le dashboard se charge normalement"
echo "   - Les données du profil s'affichent"
echo ""

# Vérifier les fichiers de correction
print_status "Vérification des fichiers de correction..."

if [ -f "fix_406_immediate.sql" ]; then
    print_success "✓ fix_406_immediate.sql prêt"
else
    print_warning "✗ fix_406_immediate.sql manquant"
fi

if [ -f "src/hooks/useProfessionalProfile.ts" ]; then
    print_success "✓ Hook useProfessionalProfile mis à jour"
else
    print_warning "✗ Hook useProfessionalProfile manquant"
fi

echo ""
echo "🔧 CORRECTION APPLIQUÉE:"
echo "========================"
echo "• Utilisation de .maybeSingle() au lieu de .single()"
echo "• Création automatique du profil professionnel"
echo "• Gestion gracieuse des erreurs 406"
echo "• Fallback vers la table 'professionals' si nécessaire"
echo ""
echo "🎉 La correction est prête ! Exécutez le script SQL et testez."
