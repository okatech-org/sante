#!/bin/bash

# Script pour migrer toutes les pages SOGARA vers le nouveau système multi-établissements
# Date: 30/10/2025

echo "🔄 Migration des pages SOGARA vers le système multi-établissements..."

# Liste des fichiers à migrer
files=(
  "src/pages/establishments/sogara/SogaraEmergency.tsx"
  "src/pages/establishments/sogara/SogaraEmployees.tsx"
  "src/pages/establishments/sogara/SogaraWorkMedicine.tsx"
  "src/pages/establishments/sogara/SogaraHospitalization.tsx"
  "src/pages/establishments/sogara/SogaraTechnical.tsx"
  "src/pages/establishments/sogara/SogaraStaff.tsx"
)

# Remplacements à effectuer
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Migration de $file..."
    
    # Remplacer l'import
    sed -i '' 's/import { SogaraDashboardLayout } from "@\/components\/layout\/SogaraDashboardLayout";/import { ProfessionalEstablishmentLayout } from "@\/components\/layout\/ProfessionalEstablishmentLayout";/g' "$file"
    
    # Remplacer le composant wrapper
    sed -i '' 's/<SogaraDashboardLayout>/<ProfessionalEstablishmentLayout>/g' "$file"
    sed -i '' 's/<\/SogaraDashboardLayout>/<\/ProfessionalEstablishmentLayout>/g' "$file"
    
    echo "   ✅ Migré"
  else
    echo "   ⚠️ Fichier non trouvé: $file"
  fi
done

echo ""
echo "✨ Migration terminée!"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifier que le contexte MultiEstablishmentProvider est bien chargé"
echo "2. Tester la connexion avec directeur.sogara@sante.ga"
echo "3. Confirmer que le menu s'adapte selon les rôles"
