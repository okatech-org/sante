# 🧪 Guide de Test Rapide - Réceptionniste Double Rôle

## 🚀 Test en 3 Minutes

### 1️⃣ Connexion (30 sec)
```bash
URL      : http://localhost:8080/login/professional
Email    : nadege.oyono@sogara.ga
Password : Sogara2025!
```

### 2️⃣ Vérification Menu Latéral (30 sec)

Après connexion, vérifier le menu à gauche :

```
✅ TABLEAU DE BORD
   └── Vue d'ensemble

✅ CMST SOGARA
   ├── 📅 Accueil Hôpital    ← Cliquer ici pour HDJ
   └── 🚨 Accueil Urgences   ← Cliquer ici pour Urgences
```

**⚠️ PAS de "DIRECTEUR" ou "MÉDECIN" visible**

### 3️⃣ Test Mode HDJ (1 min)

1. **Cliquer** sur "📅 Accueil Hôpital" dans le menu
2. **Vérifier** l'URL : `/professional/accueil-hdj`
3. **Voir** :
   - Titre : "Accueil Hôpital du Jour"
   - Badge "Mode HDJ" en haut à droite
   - 4 cartes stats colorées
   - Liste des RDV du jour

4. **Action Test** :
   - Trouver "NZÉ Marie" dans la liste (10h00)
   - Cliquer "Enregistrer arrivée"
   - Modal s'ouvre → Vérification CNAMGS
   - Reste à charge = 15,000 FCFA ✅

### 4️⃣ Test Mode Urgences (1 min)

1. **Menu latéral** → Cliquer "🚨 Accueil Urgences"
2. **Vérifier** l'URL : `/professional/accueil-urgences`
3. **Voir** :
   - Titre : "Accueil Service d'Urgences"
   - Badge rouge "Mode URGENCES"
   - Bouton rouge "URGENCE VITALE" (pulse)
   - 6 cartes stats par niveau

4. **Action Test** :
   - Cliquer "URGENCE VITALE"
   - Formulaire rapide s'ouvre
   - Niveau 1 présélectionné ✅
   - Message "Réanimation immédiate"

---

## ✅ Checklist Validation Express

### Interface Générale
- [ ] Un seul menu latéral (pas de duplication)
- [ ] Nom affiché : "Nadège Oyono"
- [ ] Rôle : "Réceptionniste" (PAS Directeur/Médecin)
- [ ] 2 sous-menus : Accueil Hôpital + Accueil Urgences

### Mode HDJ
- [ ] URL correcte : `/professional/accueil-hdj`
- [ ] 4 stats cards avec gradients
- [ ] Liste RDV fonctionnelle
- [ ] Modal CNAMGS s'ouvre
- [ ] Calcul reste à charge correct

### Mode Urgences
- [ ] URL correcte : `/professional/accueil-urgences`
- [ ] Bouton URGENCE VITALE visible
- [ ] 6 cards stats (Niv 1-5 + Total)
- [ ] Dashboard Kanban visible
- [ ] Formulaire triage fonctionne

### Navigation
- [ ] Switch HDJ ↔ Urgences fluide
- [ ] Pas de rechargement page
- [ ] Menu reste cohérent
- [ ] Retour dashboard OK

---

## 🎯 Tests Critiques

### Test 1 : Vérification CNAMGS
```
HDJ → RDV NZÉ Marie → Enregistrer
→ Doit afficher : "Droits valides - Secteur public 80%"
```

### Test 2 : Urgence Vitale
```
Urgences → URGENCE VITALE → Saisir "TEST"
→ Doit créer : Dossier URG-20251031-XXX niveau 1
```

### Test 3 : Navigation Rapide
```
Menu : HDJ → Urgences → HDJ
→ Doit : Changer instantanément sans bug
```

---

## 🔍 Résultats Attendus

### ✅ SUCCÈS si :
- Navigation fluide entre les 2 modes
- Pas d'erreur console JavaScript
- Design cohérent avec le projet
- Toutes les fonctionnalités répondent

### ❌ ÉCHEC si :
- Double menu visible
- "DIRECTEUR" ou "MÉDECIN" affiché
- Page blanche ou erreur
- Navigation cassée

---

## 📱 Capture d'Écran Attendue

### Menu Latéral Correct :
```
SANTE.GA
├─ Tableau de bord
│  └─ Vue d'ensemble
├─ CMST SOGARA
│  ├─ 📅 Accueil Hôpital ←
│  └─ 🚨 Accueil Urgences ←
├─ Activité Médicale
└─ Communication
```

### Dashboard HDJ :
```
┌─────────────────────────────────────┐
│ Accueil Hôpital du Jour  [Mode HDJ] │
├─────────────────────────────────────┤
│ [12][3][8][1] Stats                 │
├─────────────────────────────────────┤
│ 10:00 NZÉ Marie [Enregistrer]       │
│ 11:00 MOUSSAVOU [Arrivé]            │
└─────────────────────────────────────┘
```

### Dashboard Urgences :
```
┌─────────────────────────────────────┐
│ Accueil Urgences [URGENCE VITALE] 🔴│
├─────────────────────────────────────┤
│ N1:1 N2:1 N3:0 Total:3 Attente:1   │
├─────────────────────────────────────┤
│ [Kanban avec 6 colonnes]            │
└─────────────────────────────────────┘
```

---

## 💡 Conseil Pro

Si tout fonctionne en **3 minutes**, l'implémentation est réussie ! 🎉

---

**⏱️ Temps total** : 3 minutes  
**📅 Date test** : 31 octobre 2025  
**✅ Status attendu** : Tout fonctionnel
