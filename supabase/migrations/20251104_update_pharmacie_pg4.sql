-- ============================================
-- Mise à jour configuration Pharmacie Port-Gentil 4
-- Type: Pharmacie sur site + Commandes en ligne
-- ============================================

UPDATE public.pharmacies
SET
  type_structure = 'pharmacie_sur_site',
  accepte_commandes_en_ligne = TRUE,
  accepte_reservations = TRUE,
  visible_plateforme = TRUE,
  statut_verification = 'verifie'
WHERE code_pharmacie = 'PHAR-004';

-- Vérifier résultat
SELECT
  '✅ PHARMACIE CONFIGURÉE' as status,
  id,
  nom_commercial,
  type_structure,
  accepte_commandes_en_ligne,
  accepte_reservations,
  visible_plateforme,
  statut_verification
FROM public.pharmacies
WHERE code_pharmacie = 'PHAR-004';

