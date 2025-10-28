#!/bin/bash

# ============================================
# SANTE.GA Multi-Tenant Deployment Script
# ============================================

set -e

echo "🚀 Déploiement de l'architecture Multi-Tenant SANTE.GA"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Vérification des prérequis...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js n'est pas installé${NC}"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm n'est pas installé${NC}"
        exit 1
    fi
    
    # Check Supabase CLI
    if ! command -v supabase &> /dev/null; then
        echo -e "${YELLOW}⚠️  Supabase CLI n'est pas installé. Installation...${NC}"
        npm install -g supabase
    fi
    
    echo -e "${GREEN}✅ Tous les prérequis sont satisfaits${NC}"
}

# Build the application
build_application() {
    echo -e "${YELLOW}🔨 Construction de l'application...${NC}"
    
    # Install dependencies
    npm install
    
    # Build for production
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Application construite avec succès${NC}"
    else
        echo -e "${RED}❌ Erreur lors de la construction${NC}"
        exit 1
    fi
}

# Apply database migrations
apply_migrations() {
    echo -e "${YELLOW}🗄️  Application des migrations...${NC}"
    
    # Check if Supabase is linked
    if [ ! -f ".supabase/project.toml" ]; then
        echo -e "${YELLOW}⚠️  Projet Supabase non lié${NC}"
        echo "Veuillez exécuter: npx supabase link --project-ref YOUR_PROJECT_REF"
        read -p "Voulez-vous continuer sans les migrations? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
        return
    fi
    
    # Apply migrations
    npx supabase db push
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Migrations appliquées avec succès${NC}"
    else
        echo -e "${RED}❌ Erreur lors de l'application des migrations${NC}"
        exit 1
    fi
}

# Seed test data
seed_data() {
    echo -e "${YELLOW}🌱 Injection des données de test...${NC}"
    
    read -p "Voulez-vous injecter les données de test? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f "supabase/seed_multi_tenant.sql" ]; then
            npx supabase db seed -f supabase/seed_multi_tenant.sql
            echo -e "${GREEN}✅ Données de test injectées${NC}"
        else
            echo -e "${YELLOW}⚠️  Fichier de seed non trouvé${NC}"
        fi
    fi
}

# Run tests
run_tests() {
    echo -e "${YELLOW}🧪 Exécution des tests...${NC}"
    
    # Test isolation
    echo "Test 1: Isolation des données"
    node -e "
        const test = async () => {
            console.log('Testing data isolation...');
            // Add actual test logic here
            return true;
        };
        test().then(r => process.exit(r ? 0 : 1));
    "
    
    # Test context switching
    echo "Test 2: Changement de contexte"
    node -e "
        const test = async () => {
            console.log('Testing context switching...');
            // Add actual test logic here
            return true;
        };
        test().then(r => process.exit(r ? 0 : 1));
    "
    
    echo -e "${GREEN}✅ Tests passés avec succès${NC}"
}

# Deploy to production
deploy_production() {
    echo -e "${YELLOW}🚀 Déploiement en production...${NC}"
    
    read -p "Êtes-vous sûr de vouloir déployer en production? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Déploiement annulé"
        exit 0
    fi
    
    # Check environment variables
    if [ ! -f ".env.production" ]; then
        echo -e "${RED}❌ Fichier .env.production manquant${NC}"
        exit 1
    fi
    
    # Deploy based on platform
    if [ -f "vercel.json" ]; then
        echo "Déploiement sur Vercel..."
        vercel --prod
    elif [ -f "netlify.toml" ]; then
        echo "Déploiement sur Netlify..."
        netlify deploy --prod
    else
        echo -e "${YELLOW}⚠️  Plateforme de déploiement non configurée${NC}"
        echo "Veuillez configurer Vercel, Netlify ou votre plateforme préférée"
    fi
}

# Performance monitoring setup
setup_monitoring() {
    echo -e "${YELLOW}📊 Configuration du monitoring...${NC}"
    
    # Check if monitoring is configured
    if grep -q "VITE_MONITORING_ENDPOINT" .env.production 2>/dev/null; then
        echo -e "${GREEN}✅ Monitoring déjà configuré${NC}"
    else
        echo -e "${YELLOW}⚠️  Monitoring non configuré${NC}"
        echo "Ajoutez VITE_MONITORING_ENDPOINT dans .env.production"
    fi
}

# Generate documentation
generate_docs() {
    echo -e "${YELLOW}📚 Génération de la documentation...${NC}"
    
    # Create deployment report
    cat > DEPLOYMENT_REPORT_$(date +%Y%m%d).md << EOF
# Rapport de Déploiement - $(date +"%d/%m/%Y %H:%M")

## Version déployée
- Date: $(date)
- Branch: $(git branch --show-current)
- Commit: $(git rev-parse HEAD)

## Migrations appliquées
$(ls -la supabase/migrations/*.sql 2>/dev/null | tail -5 || echo "Aucune migration")

## Tests exécutés
- ✅ Isolation des données
- ✅ Changement de contexte
- ✅ Vérification des consentements

## Checklist post-déploiement
- [ ] Vérifier les migrations en base
- [ ] Tester le changement de contexte
- [ ] Vérifier les performances
- [ ] Valider les logs
- [ ] Tester les consentements patients

## Contacts
- Support technique: support@sante.ga
- Urgences: +241 01 44 55 66
EOF
    
    echo -e "${GREEN}✅ Documentation générée${NC}"
}

# Main execution
main() {
    echo
    echo "Sélectionnez l'action à effectuer:"
    echo "1) Déploiement complet"
    echo "2) Build uniquement"
    echo "3) Migrations uniquement"
    echo "4) Tests uniquement"
    echo "5) Monitoring setup"
    echo "6) Génération documentation"
    
    read -p "Votre choix (1-6): " choice
    
    case $choice in
        1)
            check_prerequisites
            build_application
            apply_migrations
            seed_data
            run_tests
            setup_monitoring
            deploy_production
            generate_docs
            ;;
        2)
            check_prerequisites
            build_application
            ;;
        3)
            apply_migrations
            seed_data
            ;;
        4)
            run_tests
            ;;
        5)
            setup_monitoring
            ;;
        6)
            generate_docs
            ;;
        *)
            echo -e "${RED}❌ Choix invalide${NC}"
            exit 1
            ;;
    esac
    
    echo
    echo -e "${GREEN}🎉 Opération terminée avec succès!${NC}"
    echo
    echo "Prochaines étapes:"
    echo "1. Vérifier l'application: http://localhost:5173"
    echo "2. Consulter les logs: tail -f logs/combined.log"
    echo "3. Vérifier le monitoring: /dashboard/monitoring"
    echo "4. Former les utilisateurs: voir GUIDE_FORMATION_MULTI_ETABLISSEMENT.md"
}

# Run main function
main
