# 🔍 Recherche Intelligente Combinée : Symptômes + Localisation

## 🎯 Fonctionnalité Implémentée

### Objectif
Permettre aux utilisateurs de rechercher en **langage naturel** en combinant plusieurs critères dans une seule phrase :
- **Symptômes** : "J'ai la fièvre"
- **Localisation** : "je suis à Nzeng-Ayong"
- **Combinaison** : "J'ai la fièvre et je suis à Nzeng-Ayong"

### Résultat Attendu
La cartographie affiche uniquement les structures qui :
1. ✅ Correspondent au symptôme (médecins généralistes, pédiatres, urgences)
2. ✅ Sont situées dans la zone spécifiée (Nzeng-Ayong → Libreville)

---

## 🧠 Intelligence du Parsing

### Fonction `parseSmartQuery`

```typescript
function parseSmartQuery(query: string): {
  symptoms: string[];
  locations: string[];
  specialties: string[];
  rawQuery: string;
} {
  const lowerQuery = query.toLowerCase().trim();
  
  // Détecter les symptômes
  Object.keys(SYMPTOM_MAPPING).forEach(symptom => {
    if (lowerQuery.includes(symptom)) {
      result.symptoms.push(symptom);
      result.specialties.push(...SYMPTOM_MAPPING[symptom]);
    }
  });
  
  // Détecter les localisations
  Object.keys(KNOWN_LOCATIONS).forEach(location => {
    if (lowerQuery.includes(location)) {
      result.locations.push(...KNOWN_LOCATIONS[location]);
    }
  });
  
  return result;
}
```

### Mapping Symptômes → Spécialités

```typescript
const SYMPTOM_MAPPING = {
  "fièvre": ["médecine générale", "urgences", "pédiatrie"],
  "mal de tête": ["neurologie", "médecine générale"],
  "douleur dentaire": ["dentisterie", "cabinet_dentaire"],
  "grossesse": ["gynécologie", "obstétrique", "maternité"],
  "accident": ["urgences", "traumatologie", "chirurgie"],
  // ... 19 symptômes au total
};
```

### Mapping Localisations → Villes

```typescript
const KNOWN_LOCATIONS = {
  // Libreville et quartiers
  "nzeng-ayong": ["Libreville"],
  "nzeng ayong": ["Libreville"],
  "glass": ["Libreville"],
  "montagne": ["Libreville"],
  "nombakele": ["Libreville"],
  "batterie 4": ["Libreville"],
  "akanda": ["Akanda", "Libreville"],
  "owendo": ["Owendo", "Libreville"],
  
  // Port-Gentil et quartiers
  "port-gentil": ["Port-Gentil"],
  "cap lopez": ["Port-Gentil"],
  "mpita": ["Port-Gentil"],
  
  // Autres villes
  "franceville": ["Franceville"],
  "oyem": ["Oyem"],
  "lambaréné": ["Lambaréné"],
  // ... 40+ localisations au total
};
```

---

## 🔄 Flux de Traitement

### Exemple : "J'ai la fièvre et je suis à Nzeng-Ayong"

#### Étape 1 : Parsing
```typescript
const parsed = parseSmartQuery("J'ai la fièvre et je suis à Nzeng-Ayong");

// Résultat:
{
  symptoms: ["fièvre"],
  locations: ["Libreville"],
  specialties: ["médecine générale", "urgences", "pédiatrie"],
  rawQuery: "J'ai la fièvre et je suis à Nzeng-Ayong"
}
```

#### Étape 2 : Notification Utilisateur
```typescript
toast.info("Recherche pour: fièvre à Libreville");
```

#### Étape 3 : Application des Filtres
```typescript
onFiltersChange({
  searchText: "J'ai la fièvre et je suis à Nzeng-Ayong Libreville",
  specialties: ["médecine générale", "urgences", "pédiatrie"],
  urgent: false  // fièvre n'est pas une urgence critique
});
```

#### Étape 4 : Filtrage des Établissements
```typescript
filterProvidersEnhanced(providers, {
  specialties: ["médecine générale", "urgences", "pédiatrie"],
  searchText: "...Libreville"
});
```

Le filtre `searchText` contient "Libreville", donc seuls les établissements de Libreville sont retenus, **ET** ils doivent avoir l'une des spécialités demandées.

#### Étape 5 : Tri et Affichage
- Tri par distance (si géolocalisation)
- Affichage sur la carte
- Zoom automatique sur la zone

---

## 📝 Exemples de Recherches

### Exemple 1 : Symptôme Simple
**Entrée :** `"mal de tête"`

**Parsing :**
```javascript
{
  symptoms: ["mal de tête"],
  locations: [],
  specialties: ["neurologie", "médecine générale"]
}
```

**Résultat :** Tous les neurologues et médecins généralistes

---

### Exemple 2 : Symptôme + Localisation
**Entrée :** `"j'ai la fièvre et je suis à nzeng-ayong"`

**Parsing :**
```javascript
{
  symptoms: ["fièvre"],
  locations: ["Libreville"],
  specialties: ["médecine générale", "urgences", "pédiatrie"]
}
```

**Résultat :** Médecins généralistes, urgences et pédiatres **à Libreville** uniquement

---

### Exemple 3 : Urgence + Lieu
**Entrée :** `"accident à port-gentil"`

**Parsing :**
```javascript
{
  symptoms: ["accident"],
  locations: ["Port-Gentil"],
  specialties: ["urgences", "traumatologie", "chirurgie"]
}
```

**Filtres supplémentaires :**
```javascript
{
  urgent: true,
  open24h: true  // Priorise les établissements 24/7
}
```

**Résultat :** Urgences 24/7 **à Port-Gentil** uniquement

---

### Exemple 4 : Grossesse + Quartier
**Entrée :** `"je suis enceinte à glass"`

**Parsing :**
```javascript
{
  symptoms: ["grossesse"],
  locations: ["Libreville"],
  specialties: ["gynécologie", "obstétrique", "maternité"]
}
```

**Résultat :** Gynécologues, maternités **à Libreville** (Glass est un quartier de Libreville)

---

### Exemple 5 : Vaccin + Ville
**Entrée :** `"vaccin à oyem"`

**Parsing :**
```javascript
{
  symptoms: ["vaccin"],
  locations: ["Oyem"],
  specialties: ["pédiatrie", "médecine générale", "vaccination"]
}
```

**Résultat :** Centres de vaccination **à Oyem** uniquement

---

## 🎨 Interface Utilisateur

### Placeholder Amélioré
```tsx
<Input
  placeholder="Ex: J'ai la fièvre et je suis à Nzeng-Ayong..."
/>
```

### Notification Interactive
Quand une recherche combinée est détectée :
```typescript
toast.info("Recherche pour: fièvre à Libreville");
```

### Indicateurs Visuels
- 🔍 Badge "Symptôme détecté" si symptôme trouvé
- 📍 Badge "Localisation" si lieu détecté
- ⚡ Badge "Urgence" si urgence détectée

---

## 🔧 Intégration avec les Filtres

### Filtres Appliqués Automatiquement

```typescript
const filters = {
  // Toujours présent
  searchText: query,
  
  // Si symptômes détectés
  specialties: [...parsed.specialties],
  
  // Si urgence détectée
  urgent: true,
  open24h: true,
  
  // Si localisation détectée
  // → Intégré dans searchText pour filtrage ville/province
};
```

### Fonction de Filtrage Étendue

Le filtre `searchText` dans `filterProvidersEnhanced` recherche dans :
```typescript
const searchableText = [
  provider.nom,
  provider.ville,           // ← Localisation
  provider.province,        // ← Localisation
  provider.adresse_descriptive,
  ...(provider.services || []),
  ...(provider.specialites || [])
].join(' ').toLowerCase();
```

---

## 🧪 Tests de Validation

### Test 1 : Fièvre à Nzeng-Ayong
```
Entrée: "j'ai la fièvre et je suis à nzeng-ayong"
Attendu:
  ✅ Notification: "Recherche pour: fièvre à Libreville"
  ✅ Carte: Seulement structures à Libreville
  ✅ Types: Médecins généralistes, urgences, pédiatres
  ✅ Zoom: Centré sur Libreville
```

### Test 2 : Accident à Port-Gentil
```
Entrée: "accident à port-gentil"
Attendu:
  ✅ Notification: "Recherche pour: accident à Port-Gentil"
  ✅ Carte: Seulement structures à Port-Gentil
  ✅ Types: Urgences, traumatologie, chirurgie
  ✅ Filtres: urgent=true, open24h=true
  ✅ Badge: "Urgence" affiché
```

### Test 3 : Mal de Tête à Glass
```
Entrée: "mal de tête à glass"
Attendu:
  ✅ Notification: "Recherche pour: mal de tête à Libreville"
  ✅ Carte: Seulement structures à Libreville
  ✅ Types: Neurologues, médecins généralistes
```

### Test 4 : Vaccin à Franceville
```
Entrée: "vaccin à franceville"
Attendu:
  ✅ Notification: "Recherche pour: vaccin à Franceville"
  ✅ Carte: Seulement structures à Franceville
  ✅ Types: Pédiatres, médecins généralistes, centres de vaccination
```

### Test 5 : Grossesse à Owendo
```
Entrée: "je suis enceinte à owendo"
Attendu:
  ✅ Notification: "Recherche pour: grossesse à Libreville"
  ✅ Carte: Structures à Libreville et Owendo
  ✅ Types: Gynécologues, obstétriciens, maternités
```

---

## 🚀 Variantes Linguistiques Supportées

### Pour les Symptômes
- "J'ai la fièvre"
- "fièvre"
- "je fais de la fièvre"
- "mon enfant a la fièvre"

Toutes ces variantes détectent le mot-clé `"fièvre"`.

### Pour les Localisations
- "à nzeng-ayong"
- "je suis à nzeng ayong"
- "nzeng-ayong"
- "quartier nzeng ayong"

Toutes ces variantes détectent `"nzeng-ayong"` ou `"nzeng ayong"`.

---

## 📊 Localisations Supportées

### Libreville et Quartiers (18)
- Nzeng-Ayong, Glass, Montagne, Nombakélé
- Louis, Lalala, Okala, Batterie IV
- Petit Paris, Sibang, Atong Abe
- Akanda, Owendo (villes limitrophes)

### Port-Gentil et Quartiers (4)
- Port-Gentil, Cap Lopez, Mpita

### Autres Villes Principales (11)
- Franceville, Oyem, Moanda, Tchibanga
- Koulamoutou, Lambaréné, Mouila
- Makokou, Bitam, Mitzic, Lastoursville

**Total : 40+ localisations reconnues**

---

## 🎯 Avantages

### 1. **Langage Naturel**
L'utilisateur peut s'exprimer normalement :
- "J'ai mal à la tête et je suis à Glass"
- "Mon enfant a de la fièvre, on est à Nzeng-Ayong"
- "Accident à Port-Gentil"

### 2. **Filtrage Précis**
Combine automatiquement :
- Type de problème (symptôme)
- Localisation géographique
- Urgence si nécessaire

### 3. **UX Améliorée**
- Recherche en une seule phrase
- Pas besoin de multiples filtres
- Résultats pertinents immédiatement

### 4. **Notifications Intelligentes**
L'utilisateur voit exactement ce qui a été compris :
```
"Recherche pour: fièvre à Libreville"
```

### 5. **Compatible Recherche Vocale**
Fonctionne aussi avec le micro :
- Utilisateur dit : "J'ai la fièvre et je suis à Nzeng-Ayong"
- Système parse et filtre automatiquement

---

## 🔮 Extensions Futures Possibles

### 1. **Plus de Symptômes**
Ajouter d'autres symptômes courants :
- "toux", "rhume", "grippe"
- "blessure", "brûlure"
- "diarrhée", "vomissement"

### 2. **Synonymes**
Gérer les variantes :
- "fièvre" = "température" = "fébrilité"
- "mal de tête" = "migraine" = "céphalée"

### 3. **Détection de Distance**
Reconnaître :
- "à moins de 5 km"
- "près de moi"
- "dans un rayon de 10 km"

### 4. **Horaires dans Requête**
Parser :
- "ouvert maintenant"
- "urgence de nuit"
- "disponible ce weekend"

### 5. **Assurances dans Requête**
Détecter :
- "accepte CNAMGS"
- "conventionné CNSS"
- "sans assurance"

---

## ✨ Résultat Final

✅ **Recherche en Langage Naturel**
- "J'ai la fièvre et je suis à Nzeng-Ayong" → Fonctionne !

✅ **Parsing Intelligent**
- Détecte symptômes ET localisations

✅ **Filtrage Combiné**
- Spécialités + Ville/Quartier

✅ **Notification Claire**
- "Recherche pour: fièvre à Libreville"

✅ **Carte Mise à Jour**
- Affiche uniquement les structures pertinentes

✅ **Compatible Vocal**
- Fonctionne avec recherche vocale

**La recherche combinée symptômes + localisation est maintenant opérationnelle ! 🎉**

