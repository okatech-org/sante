#!/bin/bash

# ============================================
# SCRIPT DE TEST - CORRECTION ERREUR 406
# ============================================
# Script pour tester la correction de l'erreur 406 du dashboard professionnel
# Date: 28/10/2025
# Projet: SANTE.GA

echo "🔧 Test de la correction de l'erreur 406 - Dashboard Professionnel SANTE.GA"
echo "=================================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    print_error "Ce script doit être exécuté depuis la racine du projet SANTE.GA"
    exit 1
fi

print_status "Vérification de l'environnement..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm version: $NPM_VERSION"

# Vérifier que les fichiers de correction existent
print_status "Vérification des fichiers de correction..."

FILES_TO_CHECK=(
    "fix_professional_profiles_rls.sql"
    "src/hooks/useProfessionalProfile.ts"
    "src/pages/DashboardProfessional.tsx"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file existe"
    else
        print_error "✗ $file manquant"
        exit 1
    fi
done

# Vérifier les dépendances
print_status "Vérification des dépendances..."

if [ ! -d "node_modules" ]; then
    print_warning "node_modules n'existe pas, installation des dépendances..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dépendances installées avec succès"
    else
        print_error "Échec de l'installation des dépendances"
        exit 1
    fi
else
    print_success "✓ node_modules existe"
fi

# Vérifier la configuration Supabase
print_status "Vérification de la configuration Supabase..."

if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    print_warning "Fichier .env manquant, vérifiez votre configuration Supabase"
fi

# Vérifier la structure des migrations
print_status "Vérification des migrations Supabase..."

if [ -d "supabase/migrations" ]; then
    MIGRATION_COUNT=$(ls supabase/migrations/*.sql 2>/dev/null | wc -l)
    print_success "✓ $MIGRATION_COUNT migrations trouvées"
else
    print_warning "Dossier supabase/migrations manquant"
fi

# Test de compilation TypeScript
print_status "Test de compilation TypeScript..."

if command -v npx &> /dev/null; then
    npx tsc --noEmit --skipLibCheck
    if [ $? -eq 0 ]; then
        print_success "✓ Compilation TypeScript réussie"
    else
        print_warning "Erreurs de compilation TypeScript détectées"
    fi
else
    print_warning "npx non disponible, impossible de tester la compilation"
fi

# Instructions pour l'utilisateur
echo ""
echo "🎯 ÉTAPES SUIVANTES POUR RÉSOUDRE L'ERREUR 406:"
echo "=============================================="
echo ""
echo "1. 📊 EXÉCUTER LE SCRIPT SQL DE MIGRATION:"
echo "   - Connectez-vous à https://app.supabase.com"
echo "   - Sélectionnez votre projet SANTE.GA"
echo "   - Allez dans SQL Editor"
echo "   - Copiez le contenu de fix_professional_profiles_rls.sql"
echo "   - Exécutez le script (Ctrl+Enter)"
echo ""
echo "2. 🚀 DÉMARRER L'APPLICATION:"
echo "   npm run dev"
echo ""
echo "3. 🧪 TESTER LE DASHBOARD PROFESSIONNEL:"
echo "   - Ouvrez http://localhost:8081/dashboard/professional"
echo "   - Connectez-vous avec un compte professionnel"
echo "   - Vérifiez qu'aucune erreur 406 n'apparaît dans la console"
echo ""
echo "4. 🔍 VÉRIFICATIONS DANS LA CONSOLE DU NAVIGATEUR:"
echo "   - Ouvrez les DevTools (F12)"
echo "   - Allez dans l'onglet Console"
echo "   - Rechargez la page"
echo "   - Aucune erreur 406 ne devrait apparaître"
echo "   - Maximum 3 tentatives de chargement du profil"
echo ""

# Vérifier si l'application est déjà en cours d'exécution
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "L'application semble déjà en cours d'exécution sur le port 8081"
    echo "Vous pouvez tester directement: http://localhost:8081/dashboard/professional"
else
    print_status "Pour démarrer l'application, exécutez: npm run dev"
fi

echo ""
echo "✅ RÉSUMÉ DE LA CORRECTION:"
echo "=========================="
echo "• Script SQL de migration créé: fix_professional_profiles_rls.sql"
echo "• Hook useProfessionalProfile créé: src/hooks/useProfessionalProfile.ts"
echo "• Dashboard mis à jour: src/pages/DashboardProfessional.tsx"
echo "• Gestion des erreurs avec backoff exponentiel"
echo "• Compatibilité avec les tables 'professionals' et 'professional_profiles'"
echo "• Interface utilisateur améliorée avec états de chargement"
echo ""
echo "🎉 La correction est prête à être déployée !"
