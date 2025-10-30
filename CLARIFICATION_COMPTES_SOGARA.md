# 📋 CLARIFICATION - Comptes CMST SOGARA

## ⚠️ IMPORTANT : Aucun mot de passe n'a été modifié !

Les scripts d'implémentation multi-établissements **n'ont PAS modifié** les mots de passe des comptes existants. Ils ont seulement :
- ✅ Ajouté les rôles multiples (Directeur + Médecin pour Dr. DJEKI)
- ✅ Créé les affiliations établissement
- ✅ Ajouté des invitations de test
- ❌ **N'ont PAS touché aux mots de passe**

---

## 🔐 Comptes CMST SOGARA - Identifiants CORRECTS

### 1. Direction (2 comptes)

| Nom | Email | **Mot de passe CORRECT** | Rôle |
|-----|-------|---------------------------|------|
| **Dr. Jules DJEKI** | `directeur.sogara@sante.ga` | **`DirecteurSOGARA2024!`** | Directeur Médical |
| **Jean-Pierre Mbadinga** | `admin.sogara@sante.ga` | **`AdminSOGARA2024!`** | Administrateur |

### 2. Personnel Médical (7 comptes)

#### Médecins
| Nom | Email | **Mot de passe** | Service |
|-----|-------|------------------|---------|
| Dr. Marie Okemba | `dr.okemba.sogara@sante.ga` | **`Sogara2024!`** | Médecine Générale |
| Dr. Paul Nguema | `dr.nguema.sogara@sante.ga` | **`Sogara2024!`** | Urgences |
| Dr. Léa Mbina | `dr.mbina.sogara@sante.ga` | **`Sogara2024!`** | Cardiologie |
| Dr. Thomas Mezui | `dr.mezui.sogara@sante.ga` | **`Sogara2024!`** | Pédiatrie |

#### Infirmiers
| Nom | Email | **Mot de passe** | Service |
|-----|-------|------------------|---------|
| Sylvie Mba | `nurse.mba.sogara@sante.ga` | **`Sogara2024!`** | Soins Intensifs |
| Patricia Nze | `nurse.nze.sogara@sante.ga` | **`Sogara2024!`** | Urgences |
| Claire Andeme | `nurse.andeme.sogara@sante.ga` | **`Sogara2024!`** | Maternité |

### 3. Personnel Support (3 comptes)

| Nom | Email | **Mot de passe** | Service |
|-----|-------|------------------|---------|
| André Moussavou | `lab.tech.sogara@sante.ga` | **`Sogara2024!`** | Laboratoire |
| Dr. Lydie Kombila | `pharma.sogara@sante.ga` | **`Sogara2024!`** | Pharmacie |
| Nadège Oyono | `accueil.sogara@sante.ga` | **`Sogara2024!`** | Accueil |

---

## 👥 Comptes Patients SOGARA (4 comptes)

| Nom | Email | **Mot de passe** | Type |
|-----|-------|------------------|------|
| Pierrette Nomsi | `pierrette.nomsi@sogara.ga` | **`PatientSOGARA2024!`** | Employée SOGARA |
| Jean Nzengue | `jean.nzengue.sogara@sante.ga` | **`PatientSOGARA2024!`** | Employé SOGARA |
| Marie Moussavou | `marie.moussavou.sogara@sante.ga` | **`PatientSOGARA2024!`** | Employée SOGARA |
| Paul Obame | `paul.obame.sogara@sante.ga` | **`PatientSOGARA2024!`** | Employé SOGARA |

> **Note** : Ces comptes patients permettent de tester le parcours patient pour les employés SOGARA

---

## 🎯 Particularité du Dr. Jules DJEKI

Le Dr. DJEKI est le seul avec **2 rôles dans le même établissement** :

### Avant (mono-rôle)
- ✅ Directeur Médical uniquement

### Maintenant (multi-rôles)
- ✅ **Directeur Médical** : Administration complète
- ✅ **Médecin Consultant** : Pratique médicale
- ✅ **Invitation CHU Libreville** : Cardiologie (en attente)

### Pour tester ses multiples rôles :
```
Email    : directeur.sogara@sante.ga
Password : DirecteurSOGARA2024!  ← ⚠️ PAS "Sogara2024!"
```

---

## 📝 Résumé des Modifications Réelles

### ✅ Ce qui a été ajouté
1. **Tables SQL** pour multi-établissements
2. **Rôles multiples** pour Dr. DJEKI
3. **Interface Dashboard SOGARA**
4. **Système d'invitations/demandes**
5. **Menu contextuel** selon les permissions

### ❌ Ce qui n'a PAS été modifié
1. **Mots de passe** des comptes existants
2. **Emails** des utilisateurs
3. **Noms** des utilisateurs
4. **Rôles de base** (sauf ajout pour Dr. DJEKI)

---

## 🔧 Si un compte ne fonctionne pas

1. **Vérifier le mot de passe correct** dans ce document
2. **S'assurer que les migrations SQL** ont été appliquées
3. **Vérifier dans Supabase** > Auth > Users que le compte existe

---

## 📊 Test Rapide

### Test 1 : Directeur (Dr. DJEKI)
```bash
Email: directeur.sogara@sante.ga
Pass:  DirecteurSOGARA2024!
→ Doit voir : Double badge + Dashboard SOGARA button
```

### Test 2 : Admin (Mbadinga)
```bash
Email: admin.sogara@sante.ga
Pass:  AdminSOGARA2024!
→ Doit voir : Badge Admin + Options admin
```

### Test 3 : Médecin (Dr. Okemba)
```bash
Email: dr.okemba.sogara@sante.ga
Pass:  Sogara2024!
→ Doit voir : Badge Médecin + Options médicales
```

---

*Document de clarification - 30 Octobre 2025*  
*Tous les mots de passe listés sont les originaux, non modifiés*
