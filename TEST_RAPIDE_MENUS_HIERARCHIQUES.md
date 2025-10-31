# ✅ TEST RAPIDE - MENUS HIÉRARCHIQUES

**Durée estimée**: 5 minutes  
**URL**: http://localhost:8080/professional/

---

## 🎯 TEST 1: CONNEXION ET SÉLECTION DE RÔLE (2 min)

### Étapes

1. **Ouvrir** : http://localhost:8080/login/professional
2. **Se connecter** :
   - Email: `directeur.sogara@sante.ga`
   - Mot de passe: `DirecteurSOGARA2024!`

3. **Sélectionner l'établissement** :
   - Clic sur **CMST SOGARA**

4. **Sélectionner le rôle** :
   - Vous devriez voir une page avec 2 cartes:
     - 🛡️ **ADMIN**
     - 🩺 **MÉDECIN**
   - Clic sur **ADMIN**

### ✅ Résultat Attendu

Vous arrivez sur `/dashboard/professional` avec **5 sections dans le menu accordéon** :

```
┌─ Général ▼
│  └─ Tableau de bord
│  └─ Statistiques
│
├─ Activité Médicale ▼
│  └─ Agenda & RDV (badge: 8)
│  └─ Patients
│  └─ Consultations
│  └─ Téléconsultations
│
├─ Direction Médicale ▼
│  └─ Corps médical
│  └─ Services
│  └─ Protocoles
│
├─ Administration ▼
│  └─ Personnel
│  └─ Finances & CNAMGS
│  └─ Infrastructure
│  └─ Stocks & Pharmacie
│
└─ Communication ▼
   └─ Messages (badge: 5)
   └─ Intégrations
   └─ Paramètres
```

---

## 🔄 TEST 2: CHANGEMENT DE RÔLE (1 min)

### Étapes

1. Dans le header, clic sur le **sélecteur de rôle** (en haut à gauche)
2. Sélectionner **MÉDECIN** au lieu de **ADMIN**

### ✅ Résultat Attendu

Le menu change instantanément vers **4 sections différentes** :

```
┌─ Général ▼
│  └─ Tableau de bord
│  └─ Mon agenda (badge: 8)
│
├─ Activité Médicale ▼
│  └─ Mes patients
│  └─ Consultations
│  └─ Téléconsultations
│  └─ Prescriptions
│  └─ Télé-expertise
│
├─ Personnel ▼
│  └─ Mes statistiques
│  └─ Mes finances
│  └─ Messages (badge: 5)
│
└─ Paramètres ▼
   └─ Paramètres
```

**Notez** :
- ❌ Pas de section "Administration"
- ❌ Pas de section "Direction Médicale"
- ✅ Focus sur les activités médicales personnelles

---

## 🎨 TEST 3: NAVIGATION ACCORDÉON (1 min)

### Étapes

1. **Observer** : Toutes les sections sont ouvertes par défaut
2. **Clic sur "Général"** : La section se ferme
3. **Re-clic sur "Général"** : La section se rouvre
4. **Clic sur un item** (ex: "Tableau de bord") :
   - L'item devient **bleu** (actif)
   - Icône change de couleur
   - Reste visible dans l'accordéon

### ✅ Résultat Attendu

- ✅ Navigation fluide
- ✅ Sections pliables/dépliables
- ✅ Item actif visuellement distinct
- ✅ Icônes à côté de chaque item
- ✅ Badges visibles (nombres/textes)

---

## 📱 TEST 4: RESPONSIVE MOBILE (1 min)

### Étapes

1. **Ouvrir DevTools** : F12
2. **Mode responsive** : Cmd+Shift+M (Mac) ou Ctrl+Shift+M (Windows)
3. **Sélectionner** : iPhone 14 Pro ou similaire
4. **Clic sur ☰** (icône hamburger en haut à gauche)

### ✅ Résultat Attendu

- ✅ Sheet latérale s'ouvre depuis la gauche
- ✅ Même menu accordéon que desktop
- ✅ Fermeture automatique après sélection d'un item
- ✅ Avatar et nom du professionnel en bas

---

## ⚡ TEST 5: PERFORMANCE (30 sec)

### Étapes

1. **Ouvrir la console** : F12 → Console
2. **Changer de rôle** : ADMIN → MÉDECIN
3. **Observer** : Le changement est instantané

### ✅ Résultat Attendu

- ✅ Changement de menu < 100ms
- ✅ Aucun rechargement de page
- ✅ Pas d'erreurs dans la console
- ✅ Toast de confirmation affiché

---

## 🐛 DÉPANNAGE

### Problème: Menu vide

**Solution 1** : Vider le cache
```
Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows)
```

**Solution 2** : Redémarrer le serveur
```bash
cd /Users/okatech/sante
pkill -f "npm run dev"
npm run dev
```

### Problème: Erreur dans la console

**Erreur**: `Cannot read property 'type' of undefined`

**Solution** : Le `currentEstablishment` n'est pas chargé
```bash
# Vérifier dans DevTools > Console
# L'erreur vient probablement de la base de données
# Vérifier que l'établissement SOGARA existe:
SELECT * FROM establishments WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
```

### Problème: Accordéon ne fonctionne pas

**Solution** : Vérifier que le composant est installé
```bash
ls src/components/ui/accordion.tsx
# Si manquant:
npx shadcn@latest add accordion
```

### Problème: Page de sélection de rôle ne s'affiche pas

**Solution** : Vérifier les routes dans `AppMain.tsx`
```typescript
// Cette route doit exister:
<Route path="/professional/select-role/:establishmentId" element={<SelectRole />} />
```

---

## 📊 CHECKLIST COMPLÈTE

- [ ] Connexion réussie
- [ ] Sélection d'établissement fonctionnelle
- [ ] Page de sélection de rôle affichée
- [ ] Menu ADMIN affiché avec 5 sections
- [ ] Changement vers menu MÉDECIN réussi
- [ ] Accordéons s'ouvrent/ferment correctement
- [ ] Item actif surligné en bleu
- [ ] Menu mobile fonctionne
- [ ] Changement de rôle instantané
- [ ] Aucune erreur console

---

## 🎉 SUCCÈS !

Si tous les tests passent :
- ✅ L'architecture hiérarchique est **correctement appliquée**
- ✅ Les menus s'adaptent au **type d'établissement** et au **rôle**
- ✅ La navigation accordéon est **fonctionnelle**
- ✅ Le système est **prêt pour la production**

---

## 📝 NOTES

- Le serveur doit être en cours d'exécution sur le port **8080**
- Le compte `directeur.sogara@sante.ga` a 2 rôles : **ADMIN** et **MÉDECIN**
- Les menus sont définis dans `src/config/menuDefinitions.ts`
- La persistance du rôle est assurée par `localStorage`

---

**Durée totale**: ~5 minutes  
**Dernière mise à jour**: 31 octobre 2025 - 05:25
