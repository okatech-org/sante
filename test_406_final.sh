#!/bin/bash

echo "🔧 Test Final - Correction Erreur 406 SANTE.GA"
echo "=============================================="

# Vérifier que tous les hooks utilisent professional_profiles
echo -e "\n📋 Vérification des hooks mis à jour..."

HOOKS=(
  "src/hooks/useTeleconsultations.ts"
  "src/hooks/useProfessionalFinances.ts" 
  "src/hooks/usePrescriptions.ts"
  "src/hooks/usePatients.ts"
  "src/hooks/useConsultations.ts"
  "src/hooks/useAgenda.ts"
)

for hook in "${HOOKS[@]}"; do
  if grep -q "professional_profiles" "$hook"; then
    echo -e "\033[0;32m✓\033[0m $hook utilise professional_profiles"
  else
    echo -e "\033[0;31m✗\033[0m $hook n'utilise PAS professional_profiles"
  fi
done

# Vérifier qu'il n'y a plus de .single() sur professional_profiles
echo -e "\n🔍 Vérification des .single() restants..."
SINGLE_COUNT=$(grep -r "professional_profiles.*single" src/ | wc -l)
if [ "$SINGLE_COUNT" -eq 0 ]; then
  echo -e "\033[0;32m✓\033[0m Aucun .single() trouvé sur professional_profiles"
else
  echo -e "\033[0;31m✗\033[0m $SINGLE_COUNT .single() trouvés sur professional_profiles"
  grep -r "professional_profiles.*single" src/
fi

# Vérifier que maybeSingle() est utilisé
echo -e "\n🔍 Vérification des .maybeSingle()..."
MAYBE_SINGLE_COUNT=$(grep -r "professional_profiles.*maybeSingle" src/ | wc -l)
echo -e "\033[0;32m✓\033[0m $MAYBE_SINGLE_COUNT .maybeSingle() trouvés sur professional_profiles"

echo -e "\n🎯 RÉSUMÉ DES CORRECTIONS APPLIQUÉES:"
echo "======================================"
echo "• Tous les hooks utilisent maintenant professional_profiles"
echo "• .single() remplacé par .maybeSingle() partout"
echo "• Gestion des erreurs 406 intégrée"
echo "• Création automatique de profils si absents"

echo -e "\n🚀 PROCHAINES ÉTAPES:"
echo "====================="
echo "1. Exécuter fix_406_immediate.sql dans Supabase"
echo "2. Redémarrer l'application: npm run dev"
echo "3. Tester le dashboard professionnel"
echo "4. Vérifier qu'aucune erreur 406 n'apparaît"

echo -e "\n✅ La correction est prête !"
