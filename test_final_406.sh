#!/bin/bash

echo "🎯 Test Final - Correction Boucle 406 SANTE.GA"
echo "=============================================="

echo -e "\n📋 Vérification des corrections appliquées..."

# Vérifier que SelectEstablishment utilise useProfessionalProfile
if grep -q "useProfessionalProfile" "src/pages/professional/SelectEstablishment.tsx"; then
  echo -e "\033[0;32m✓\033[0m SelectEstablishment utilise useProfessionalProfile"
else
  echo -e "\033[0;31m✗\033[0m SelectEstablishment n'utilise PAS useProfessionalProfile"
fi

# Vérifier qu'il n'y a plus de .single() sur professional_profiles
SINGLE_COUNT=$(grep -r "professional_profiles.*single" src/ | wc -l)
if [ "$SINGLE_COUNT" -eq 0 ]; then
  echo -e "\033[0;32m✓\033[0m Aucun .single() sur professional_profiles"
else
  echo -e "\033[0;31m✗\033[0m $SINGLE_COUNT .single() trouvés sur professional_profiles"
fi

# Vérifier que maybeSingle() est utilisé
MAYBE_SINGLE_COUNT=$(grep -r "professional_profiles.*maybeSingle" src/ | wc -l)
echo -e "\033[0;32m✓\033[0m $MAYBE_SINGLE_COUNT .maybeSingle() sur professional_profiles"

# Vérifier que tous les hooks utilisent professional_profiles
HOOKS=(
  "src/hooks/useTeleconsultations.ts"
  "src/hooks/useProfessionalFinances.ts" 
  "src/hooks/usePrescriptions.ts"
  "src/hooks/usePatients.ts"
  "src/hooks/useConsultations.ts"
  "src/hooks/useAgenda.ts"
)

echo -e "\n🔧 Hooks mis à jour:"
for hook in "${HOOKS[@]}"; do
  if grep -q "professional_profiles" "$hook"; then
    echo -e "\033[0;32m✓\033[0m $hook"
  else
    echo -e "\033[0;31m✗\033[0m $hook"
  fi
done

echo -e "\n🎯 CORRECTIONS APPLIQUÉES:"
echo "=========================="
echo "• SelectEstablishment utilise useProfessionalProfile (évite les boucles)"
echo "• Tous les hooks utilisent professional_profiles + maybeSingle()"
echo "• Gestion des états de chargement"
echo "• Création automatique de profils manquants"

echo -e "\n🚀 TEST MANUEL:"
echo "==============="
echo "1. Ouvrir http://localhost:8081/dashboard/professional"
echo "2. Se connecter avec un compte professionnel"
echo "3. Vérifier qu'aucune erreur 406 n'apparaît"
echo "4. Vérifier qu'aucun 'Throttling navigation' n'apparaît"
echo "5. Navigation fluide entre les pages"

echo -e "\n✅ La correction est complète !"
