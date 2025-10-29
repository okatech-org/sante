#!/bin/bash

# 🚀 SCRIPT DE DÉPLOIEMENT AUTOMATISÉ - SANTE.GA

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 SANTE.GA - DEPLOYMENT WIZARD                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Vérifier les prérequis
check_prerequisites() {
    echo -e "${YELLOW}📋 Vérification des prérequis...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js n'est pas installé${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ NPM n'est pas installé${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
    echo -e "${GREEN}✅ NPM $(npm --version)${NC}"
}

# Menu de sélection
show_menu() {
    echo -e "\n${BLUE}Sélectionnez la plateforme de déploiement:${NC}"
    echo ""
    echo "  1) Vercel (Frontend - Recommandé)"
    echo "  2) Netlify (Frontend)"
    echo "  3) Railway (Full-Stack)"
    echo "  4) Render (Full-Stack)"
    echo "  5) Docker Local"
    echo "  6) Quitter"
    echo ""
    read -p "Votre choix [1-6]: " choice
}

# Déploiement Vercel
deploy_vercel() {
    echo -e "\n${BLUE}🚀 Déploiement sur Vercel...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}Installation de Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    echo -e "${YELLOW}Connexion à Vercel...${NC}"
    vercel login
    
    echo -e "${YELLOW}Build du projet...${NC}"
    npm run build
    
    echo -e "${YELLOW}Déploiement en production...${NC}"
    vercel --prod
    
    echo -e "${GREEN}✅ Déploiement Vercel terminé!${NC}"
}

# Déploiement Netlify
deploy_netlify() {
    echo -e "\n${BLUE}🚀 Déploiement sur Netlify...${NC}"
    
    if ! command -v netlify &> /dev/null; then
        echo -e "${YELLOW}Installation de Netlify CLI...${NC}"
        npm install -g netlify-cli
    fi
    
    echo -e "${YELLOW}Connexion à Netlify...${NC}"
    netlify login
    
    echo -e "${YELLOW}Build du projet...${NC}"
    npm run build
    
    echo -e "${YELLOW}Déploiement en production...${NC}"
    netlify deploy --prod
    
    echo -e "${GREEN}✅ Déploiement Netlify terminé!${NC}"
}

# Déploiement Railway
deploy_railway() {
    echo -e "\n${BLUE}🚀 Déploiement sur Railway...${NC}"
    
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}Installation de Railway CLI...${NC}"
        npm install -g @railway/cli
    fi
    
    echo -e "${YELLOW}Connexion à Railway...${NC}"
    railway login
    
    echo -e "${YELLOW}Initialisation du projet Railway...${NC}"
    railway init
    
    echo -e "${YELLOW}Déploiement...${NC}"
    railway up
    
    echo -e "${GREEN}✅ Déploiement Railway terminé!${NC}"
}

# Déploiement Docker
deploy_docker() {
    echo -e "\n${BLUE}🐳 Construction et lancement Docker...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker n'est pas installé${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Construction de l'image Docker...${NC}"
    docker build -f Dockerfile -t sante-ga:latest .
    
    echo -e "${YELLOW}Lancement du conteneur...${NC}"
    docker run -d \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e PORT=3000 \
        --name sante-ga-app \
        sante-ga:latest
    
    echo -e "${GREEN}✅ Docker lancé sur http://localhost:3000${NC}"
}

# Préparation pré-déploiement
prepare_deployment() {
    echo -e "\n${YELLOW}📦 Préparation pré-déploiement...${NC}"
    
    # Vérifier les changements git
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}Changements locaux détectés${NC}"
        read -p "Commiter les changements? (y/n): " commit_choice
        if [ "$commit_choice" = "y" ]; then
            git add .
            read -p "Message du commit: " commit_msg
            git commit -m "$commit_msg"
        fi
    fi
    
    # Build local
    echo -e "${YELLOW}Construction locale...${NC}"
    npm run build
    
    # Tests (optionnel)
    if [ -f "jest.config.js" ]; then
        read -p "Lancer les tests? (y/n): " test_choice
        if [ "$test_choice" = "y" ]; then
            npm test
        fi
    fi
    
    echo -e "${GREEN}✅ Préparation terminée!${NC}"
}

# Main
check_prerequisites
prepare_deployment

while true; do
    show_menu
    
    case $choice in
        1) deploy_vercel ;;
        2) deploy_netlify ;;
        3) deploy_railway ;;
        4) echo -e "${BLUE}Voir render.yaml pour configuration${NC}" ;;
        5) deploy_docker ;;
        6) echo -e "${GREEN}Au revoir!${NC}"; exit 0 ;;
        *) echo -e "${RED}Option invalide${NC}" ;;
    esac
    
    read -p "Déployer sur une autre plateforme? (y/n): " another
    [ "$another" != "y" ] && break
done

echo -e "\n${GREEN}✅ Processus de déploiement terminé!${NC}"
echo -e "${BLUE}Consultez DEPLOYMENT_GUIDE.md pour plus d'aide${NC}"
