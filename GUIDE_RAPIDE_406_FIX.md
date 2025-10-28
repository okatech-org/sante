# 🚀 Guide Rapide - Correction Erreur 406 Dashboard Professionnel

## ⚡ Déploiement Express (5 minutes)

### 1. Exécuter le Script SQL (2 min)
```bash
# 1. Aller sur https://app.supabase.com
# 2. Sélectionner votre projet SANTE.GA
# 3. Cliquer sur "SQL Editor" dans le menu latéral
# 4. Créer une nouvelle requête
# 5. Copier tout le contenu du fichier fix_professional_profiles_rls.sql
# 6. Cliquer sur "Run" (ou Ctrl+Enter)
```

### 2. Redémarrer l'Application (1 min)
```bash
# Arrêter l'application si elle tourne (Ctrl+C)
npm run dev
```

### 3. Tester la Correction (2 min)
```bash
# 1. Ouvrir http://localhost:8081/dashboard/professional
# 2. Se connecter avec un compte professionnel
# 3. Vérifier dans la console (F12) qu'il n'y a plus d'erreur 406
```

---

## 🔧 Fichiers Modifiés

| Fichier | Description | Statut |
|---------|-------------|--------|
| `fix_professional_profiles_rls.sql` | Script de migration SQL | ✅ Créé |
| `src/hooks/useProfessionalProfile.ts` | Hook avec gestion d'erreurs | ✅ Créé |
| `src/pages/DashboardProfessional.tsx` | Dashboard mis à jour | ✅ Modifié |

---

## 🎯 Résultat Attendu

✅ **Avant la correction :**
- Erreur HTTP 406 en boucle infinie
- Dashboard ne charge pas
- Console surchargée d'erreurs

✅ **Après la correction :**
- Chargement en moins de 2 secondes
- Aucune erreur 406
- Interface utilisateur fluide
- Gestion gracieuse des erreurs

---

## 🆘 Dépannage Rapide

### Si l'erreur persiste :
1. **Vider le cache navigateur** : Ctrl+Shift+R
2. **Vérifier les logs Supabase** : Dashboard → Logs → API
3. **Créer manuellement le profil** :
   ```sql
   INSERT INTO professional_profiles (user_id, profession_type)
   VALUES ('USER_ID', 'doctor')
   ON CONFLICT (user_id) DO NOTHING;
   ```

### Si la table n'existe pas :
1. Exécuter à nouveau le script SQL
2. Vérifier les permissions RLS
3. Contacter le support technique

---

## 📊 Vérification de Succès

- [ ] Script SQL exécuté sans erreur
- [ ] Application redémarrée
- [ ] Dashboard professionnel accessible
- [ ] Aucune erreur 406 dans la console
- [ ] Chargement en moins de 2 secondes
- [ ] Données du profil affichées correctement

---

*Guide créé le 28/10/2025 - Version 1.0 - Projet SANTE.GA*
