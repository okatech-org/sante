# 🧪 Guide de Test - Double Rôle Réceptionniste

## ⚡ Test Rapide en 5 Minutes

### 1️⃣ Connexion
```
URL      : http://localhost:8080/login/professional
Email    : nadege.oyono@sogara.ga
Password : Sogara2025!
```

### 2️⃣ Vérification Interface Initiale

✅ **Doit apparaître :**
- Menu latéral avec "CMST SOGARA"
- Sous-menu : "Accueil Hôpital" (actif par défaut)
- Sous-menu : "Accueil Urgences"
- Badge "Mode HDJ" en haut à droite

❌ **Ne doit PAS apparaître :**
- DIRECTEUR
- MÉDECIN
- Diplômes ou formations

---

## 📋 Tests Mode HDJ (Hôpital du Jour)

### Test 1 : Affichage Dashboard HDJ
1. Vérifier les 4 cartes de stats : Total RDV, Arrivés, En attente, En consultation
2. Voir la liste des RDV avec codes couleur
3. Tester la recherche par nom "NZÉ"
4. Filtrer par service "Cardiologie"

### Test 2 : Enregistrement Patient
1. Cliquer "Enregistrer arrivée" sur Mme NZÉ Marie (10h00)
2. ✅ Vérifier l'affichage des infos patient
3. ✅ Attendre la vérification CNAMGS (1-2 secondes)
4. ✅ Vérifier le calcul du reste à charge :
   - Tarif conventionné : 25,000 FCFA
   - Tarif pratiqué : 35,000 FCFA
   - Prise en charge : 20,000 FCFA (80%)
   - **Total patient : 15,000 FCFA**
5. Confirmer l'enregistrement
6. ✅ Vérifier génération numéro HDJ-20250131-XXX

### Test 3 : Cas Femme Enceinte
1. Cliquer sur Mme KOMBILA Sophie (14h00 - Gynécologie)
2. ✅ Vérifier détection automatique "Maternité 100%"
3. ✅ Vérifier reste à charge = **0 FCFA**
4. ✅ Voir badge "Tiers-payant intégral"

### Test 4 : Files d'Attente
1. Vérifier les 3 widgets de file d'attente
2. ✅ Nombre de patients en attente
3. ✅ Temps moyen affiché
4. ✅ Actualisation automatique (30 sec)

---

## 🚨 Tests Mode Urgences

### Étape 1 : Basculer en Mode Urgences
1. Cliquer bouton "Changer de mode"
2. ✅ Vérifier notification "Mode Accueil Urgences activé"
3. ✅ Badge change en "Mode URGENCES" (rouge)

### Test 5 : Dashboard Urgences
1. ✅ Vérifier les 6 cartes de stats (Niveaux 1-3, Total, Attente, Consultation)
2. ✅ Voir le dashboard Kanban avec 6 colonnes
3. ✅ Patients triés par niveau de gravité

### Test 6 : Urgence Vitale
1. Cliquer bouton rouge "URGENCE VITALE" (pulse)
2. Saisir rapidement :
   - Nom : "URGENCE"
   - Motif : "Arrêt cardiaque"
3. ✅ Niveau 1 présélectionné automatiquement
4. ✅ Alerte rouge "URGENCE VITALE - Réanimation immédiate"
5. Cliquer "URGENCE VITALE - Créer"
6. ✅ Notification rouge + son d'alerte

### Test 7 : Triage Normal
1. Cliquer "Nouveau patient"
2. Remplir :
   - Nom : TEST
   - Prénom : Patient
   - Âge : 35
   - Motif : Cliquer suggestion "Douleur abdominale"
3. Sélectionner **Niveau 3** (Urgent - jaune)
4. Saisir constantes vitales :
   - TA : 130/85
   - FC : 90
   - Temp : 37.8
   - SpO2 : 97%
   - Douleur : slider à 7/10
5. ✅ Vérifier chrono "60 min max"
6. Créer le dossier
7. ✅ Vérifier apparition dans colonne "En attente"

### Test 8 : Gestion Délais
1. Observer patient M. OBIANG (Niveau 2)
2. Si temps > 10 min :
   - ✅ Carte avec bordure rouge
   - ✅ Animation pulse
   - ✅ Alerte en haut "Délais dépassés"

### Test 9 : Actions sur Patient
1. Cliquer sur une carte patient
2. Menu "⋮" → "Passer en consultation"
3. ✅ Carte se déplace vers colonne "En consultation"
4. ✅ Notification "Statut mis à jour"

---

## 🔄 Test Switch Rapide

1. Passer de HDJ → Urgences → HDJ
2. ✅ Transitions fluides
3. ✅ Données conservées
4. ✅ Pas de rechargement page

---

## ✅ Checklist de Validation Finale

### Interface Générale
- [ ] Nom affiché : "Nadège Oyono"
- [ ] Rôle : "Réceptionniste" (pas Directeur/Médecin)
- [ ] 2 sous-rôles disponibles : HDJ et Urgences
- [ ] Switch fonctionnel entre les modes
- [ ] Mode sombre fonctionnel

### Mode HDJ
- [ ] Liste RDV avec codes couleur corrects
- [ ] Recherche et filtres fonctionnels
- [ ] Vérification CNAMGS (mock) fonctionne
- [ ] Calcul reste à charge correct
- [ ] Cas femme enceinte = 0 FCFA
- [ ] Génération numéro dossier HDJ
- [ ] Files d'attente affichées

### Mode Urgences
- [ ] Bouton URGENCE VITALE visible et fonctionnel
- [ ] 5 niveaux de gravité disponibles
- [ ] Constantes vitales pour niveaux 1-3
- [ ] Dashboard Kanban 6 colonnes
- [ ] Tri par gravité (niveau 1 en haut)
- [ ] Alertes délais dépassés
- [ ] Actions changement statut

### Performance
- [ ] Vérification CNAMGS < 3 secondes
- [ ] Création dossier urgence < 30 sec (niveau 1)
- [ ] Transitions entre modes instantanées
- [ ] Pas d'erreurs console JavaScript

---

## 🐛 Problèmes Possibles

### Problème : Interface affiche toujours Directeur/Médecin
**Solution** : 
1. Vider le cache : `localStorage.clear()`
2. Se déconnecter et reconnecter
3. Exécuter le script SQL de correction des rôles

### Problème : Vérification CNAMGS ne fonctionne pas
**Solution** : Les données sont mockées, actualiser la page si bloqué

### Problème : Dashboard urgences vide
**Solution** : Normal, les données mock se chargent après 1-2 secondes

---

## 📱 Captures d'Écran Attendues

### Mode HDJ
```
┌─────────────────────────────────────────────┐
│ 📅 Accueil Hôpital du Jour     [Mode HDJ]   │
├─────────────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│ │ 12 │ │ 3  │ │ 8  │ │ 1  │ Stats         │
│ └────┘ └────┘ └────┘ └────┘               │
├─────────────────────────────────────────────┤
│ 10:00 NZÉ Marie      [Enregistrer arrivée] │
│ 11:00 MOUSSAVOU J.   [Arrivé] ✓           │
│ 14:00 KOMBILA S.     [Enregistrer arrivée] │
└─────────────────────────────────────────────┘
```

### Mode Urgences
```
┌─────────────────────────────────────────────┐
│ 🚨 Accueil Urgences    [URGENCE VITALE] 🔴  │
├─────────────────────────────────────────────┤
│ N1:1  N2:1  N3:2  Total:8  Attente:3       │
├─────────────────────────────────────────────┤
│ Attente│En cons.│Examen│Obs.│Sortie│Hosp. │
│ ┌────┐│ ┌────┐ │      │     │      │      │
│ │N3🟡││ │N1🔴│ │      │     │      │      │
│ │MBA  ││ │NZEN│ │      │     │      │      │
│ └────┘│ └────┘ │      │     │      │      │
└─────────────────────────────────────────────┘
```

---

## 🎉 Validation Réussie

Si tous les tests passent ✅ :
- L'implémentation est **complète et fonctionnelle**
- Nadège Oyono peut gérer les deux types d'accueil
- Le système est prêt pour la production

---

**📅 Date du test** : 31 octobre 2025  
**⏱️ Durée estimée** : 5-10 minutes  
**👤 Compte testé** : nadege.oyono@sogara.ga
