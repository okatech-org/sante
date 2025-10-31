# 📋 RÉSUMÉ EXÉCUTIF - IMPLÉMENTATION MULTI-RÔLES DR. DJEKI

**Projet**: SANTE.GA  
**Date**: 31 octobre 2025  
**Temps estimé**: 2-3 heures

---

## 🎯 OBJECTIF PRINCIPAL

Permettre au **Dr. Jules DJEKI** de :
- **1 compte unique** : `directeur.sogara@sante.ga`
- **2 rôles** dans le même établissement (CMST SOGARA)
  - **DIRECTEUR** : Administration complète (5 sections menu)
  - **MÉDECIN** : Pratique médicale (4 sections menu)
- **Basculement instantané** entre les rôles
- **Menus contextuels** adaptés à chaque rôle

---

## 🏗️ ARCHITECTURE SIMPLIFIÉE

```
Connexion → Établissement (CMST SOGARA) → Rôle (Directeur/Médecin) → Menu Contextuel
```

---

## ⚡ GUIDE D'IMPLÉMENTATION RAPIDE

### ÉTAPE 1 : Base de Données (15 min)

```bash
# Appliquer la migration SQL
psql $DATABASE_URL < supabase/migrations/20251031_multi_roles_architecture.sql
```

**Crée** :
- Table `establishment_staff` avec support multi-rôles
- 4 fonctions RPC (`get_professional_establishments`, `get_professional_context`, etc.)
- 2 rôles pour Dr. DJEKI (director + doctor)
- Politiques RLS

### ÉTAPE 2 : Configuration Menus (20 min)

Créer `/src/config/menuDefinitions.ts` :
- Menu DIRECTEUR : 5 sections, 15+ items
- Menu MÉDECIN : 4 sections, 10 items
- Fonction `getMenuForContext(type, role)`
- Labels et icônes pour chaque rôle

### ÉTAPE 3 : Contexte Multi-Établissement (30 min)

Mettre à jour `/src/contexts/MultiEstablishmentContext.tsx` :
- Charger établissements via RPC
- Gérer `availableRoles[]` pour multi-rôles
- Fonction `switchRole()` avec persistance localStorage
- Gestion des permissions

### ÉTAPE 4 : Composant RoleSwitcher (15 min)

Créer `/src/components/professional/RoleSwitcher.tsx` :
- Dropdown avec les rôles disponibles
- Badge coloré selon le rôle
- Animation et toast au changement

### ÉTAPE 5 : Layout Principal (30 min)

Créer `/src/components/layout/ProfessionalEstablishmentLayout.tsx` :
- Sidebar fixe avec accordéons
- Intégration du RoleSwitcher
- Menu dynamique selon `currentRole`
- Responsive (mobile/desktop)

### ÉTAPE 6 : Test (10 min)

```bash
# Lancer l'application
npm run dev

# Se connecter
Email: directeur.sogara@sante.ga
Password: DirecteurSOGARA2024!
```

---

## ✅ CHECKLIST RAPIDE

```markdown
□ Migration SQL appliquée
□ Dr. DJEKI a 2 rôles en base
□ menuDefinitions.ts créé
□ MultiEstablishmentContext mis à jour
□ RoleSwitcher créé
□ ProfessionalEstablishmentLayout créé
□ Connexion fonctionne
□ 2 rôles visibles (Directeur + Médecin)
□ Menu change au switch de rôle
□ Accordéons fonctionnent
```

---

## 📊 RÉSULTAT VISUEL

### Mode DIRECTEUR (par défaut)
```
SIDEBAR                          CONTENU
────────────────────────────────────────
🏥 CMST SOGARA                  
Direction Médicale               

RÔLE: [🛡️ Directeur] ▼          
• Directeur ✓                   
• Médecin                        

📊 GÉNÉRAL ▼                     Dashboard
  └ Tableau de bord              principal
  └ Statistiques                 avec toutes
  └ Agenda [8]                   les infos
                                 admin
🩺 DIRECTION MÉDICALE ▼          
  └ Corps médical                
  └ Services                     
  └ Protocoles                   

🛡️ ADMINISTRATION ▼              
  └ Personnel                    
  └ Finances                     
  └ Infrastructure                
  └ Stocks                       

🏥 ACTIVITÉ MÉDICALE ▼           
  └ Tous patients                
  └ Toutes consultations         
  └ Rapports                     

💬 COMMUNICATION ▼               
  └ Messages [5]                 
  └ Intégrations                 
  └ Paramètres                   
```

### Mode MÉDECIN (après switch)
```
RÔLE: [🩺 Médecin] ▼             

📊 GÉNÉRAL ▼                     Dashboard
  └ Tableau de bord              médical
  └ Mon agenda [8]               avec mes
                                 patients
🏥 ACTIVITÉ MÉDICALE ▼           
  └ Mes patients                 
  └ Consultations                
  └ Téléconsultations            
  └ Prescriptions                
  └ Télé-expertise               

👤 PERSONNEL ▼                   
  └ Mes stats                    
  └ Mes finances                 
  └ Messages [5]                 

⚙️ PARAMÈTRES ▼                  
  └ Paramètres                   
```

---

## 🚨 POINTS D'ATTENTION

1. **Permissions** : Chaque item de menu peut avoir une `permission` requise
2. **Persistance** : Le rôle sélectionné est sauvé dans localStorage
3. **Animation** : Les accordéons utilisent Radix UI (installer si nécessaire)
4. **Mobile** : Le menu devient un Sheet sur mobile
5. **Performance** : Les menus sont mémorisés avec `useMemo`

---

## 🐛 DÉPANNAGE RAPIDE

| Problème | Solution |
|----------|----------|
| RoleSwitcher invisible | Vérifier que `availableRoles.length > 1` |
| Menu vide | Vérifier `getMenuForContext()` et les types |
| Erreur RPC | Vérifier que les fonctions SQL sont créées |
| Pas de changement au switch | Vérifier que `switchRole()` est appelé |
| Accordéons fermés | Ajouter `defaultValue={sections.map(s => s.id)}` |

---

## 📝 COMMANDES UTILES

```bash
# Voir les rôles de Dr. DJEKI
psql $DATABASE_URL -c "
  SELECT role_in_establishment, is_admin, department 
  FROM establishment_staff es
  JOIN professionals p ON p.id = es.professional_id
  JOIN auth.users u ON u.id = p.user_id
  WHERE u.email = 'directeur.sogara@sante.ga';
"

# Clear localStorage (console browser)
localStorage.clear();
location.reload();

# Logs utiles
console.log('Current Role:', currentRole);
console.log('Available Roles:', availableRoles);
console.log('Menu:', menu);
```

---

## ✨ BONUS : AMÉLIORATIONS FUTURES

1. **Indicateur visuel** du nombre de rôles dans le header
2. **Raccourci clavier** (Ctrl+R) pour changer de rôle
3. **Animation de transition** du menu au changement
4. **Historique** des changements de rôle
5. **Notification** des nouveaux messages selon le rôle
6. **Dashboard unifié** avec vue multi-rôles
7. **API** pour gérer les rôles depuis l'admin

---

## 🏆 VALIDATION FINALE

Le système est **RÉUSSI** si Dr. DJEKI peut :

✅ Se connecter avec `directeur.sogara@sante.ga`  
✅ Voir "CMST SOGARA" dans la sidebar  
✅ Voir le switcher avec "Directeur" et "Médecin"  
✅ Cliquer sur "Médecin" et voir le menu changer  
✅ Cliquer sur "Directeur" et revenir au menu admin  
✅ Rafraîchir la page et garder le rôle sélectionné  

---

**🚀 Prêt à implémenter !**

Temps total estimé : **2-3 heures**  
Difficulté : **Moyenne** ⭐⭐⭐☆☆  

---

*Documentation complète disponible dans `PROMPT_COMPLET_MENUS_HIERARCHIQUES_DR_DJEKI.md`*
