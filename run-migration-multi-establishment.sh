#!/bin/bash

# Script d'exécution de la migration multi-établissements
# Date: 30/10/2025

echo "🏥 MIGRATION MULTI-ÉTABLISSEMENTS SANTE.GA"
echo "=========================================="
echo ""

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "Installez Node.js depuis https://nodejs.org/"
    exit 1
fi

# Vérifier les variables d'environnement
if [ ! -f .env ]; then
    echo "❌ Fichier .env manquant"
    echo "Créez le fichier avec:"
    echo "  VITE_SUPABASE_URL=your_url"
    echo "  SUPABASE_SERVICE_ROLE_KEY=your_key"
    exit 1
fi

# Vérifier les dépendances
echo "📦 Installation des dépendances..."
npm install @supabase/supabase-js dotenv --save-dev

echo ""
echo "🚀 Lancement de la migration..."
echo ""

# Exécuter la migration SQL
echo "1️⃣ Application de la migration SQL..."
echo "   Veuillez exécuter le fichier suivant dans Supabase SQL Editor:"
echo "   supabase/migrations/20251030_multi_establishments.sql"
echo ""
read -p "Appuyez sur Entrée après avoir exécuté la migration SQL..."

# Exécuter le script de migration des données
echo ""
echo "2️⃣ Migration des données existantes..."
node scripts/migrate-to-multi-establishment.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration terminée avec succès!"
    echo ""
    echo "📝 Prochaines étapes:"
    echo "1. Testez la connexion avec un compte professionnel"
    echo "2. Vérifiez la sélection d'établissement"
    echo "3. Confirmez que le menu est généré correctement"
    echo ""
    echo "📚 Documentation: IMPLEMENTATION_ESPACE_PROFESSIONNEL.md"
else
    echo ""
    echo "❌ La migration a échoué"
    echo "Vérifiez les logs ci-dessus pour plus de détails"
    exit 1
fi
