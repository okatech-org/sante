# Flux de Connexion CMST SOGARA

## 🔄 Navigation Actuelle

### 1. Flux Principal SOGARA

```
/sogara (Page publique CMST SOGARA)
    ↓ Clic sur "Personnel CMST"
/login/sogara (Page connexion spécifique SOGARA)
    ↓ Clic sur "Retour à CMST SOGARA"  
/sogara (Retour à la page établissement)
```

### 2. Comportement du Bouton Retour

Le bouton "Retour" dans `/login/sogara` a maintenant un comportement contextuel :

- **Depuis `/sogara`** → Affiche "Retour à CMST SOGARA" et redirige vers `/sogara`
- **Depuis autre page** → Affiche "Retour" et redirige vers la page précédente

## 📁 Fichiers Modifiés

### 1. **src/pages/Sogara.tsx**
- Le bouton "Personnel CMST" redirige vers `/login/sogara`
- Position : Section CTA (Call-to-Action)
```typescript
onClick={() => navigate('/login/sogara')}
```

### 2. **src/pages/SogaraLogin.tsx** (Version Simple)
- Bouton retour modifié pour rediriger vers `/sogara`
- Texte : "Retour à CMST SOGARA"
```typescript
<Link to="/sogara">
  <Button variant="ghost" size="sm">
    <ArrowLeft className="h-4 w-4 mr-2" />
    Retour à CMST SOGARA
  </Button>
</Link>
```

### 3. **src/pages/SogaraLoginEnhanced.tsx** (Version Améliorée - Nouvelle)
- Détection automatique de la provenance
- Comportement adaptatif du bouton retour
- Vérification spécifique des accès SOGARA
- Interface améliorée avec badges et informations contextuelles

## 🎯 Fonctionnalités de la Version Améliorée

### Détection de Provenance
```typescript
const referrer = location.state?.from || '/sogara';
const isFromSogaraPage = referrer === '/sogara';
```

### Vérification d'Accès SOGARA
- Vérifie que l'utilisateur a un rôle professionnel
- Vérifie spécifiquement l'accès à l'établissement CMST SOGARA
- Redirige vers la sélection d'établissement si accès à d'autres mais pas SOGARA
- Message d'erreur clair si aucun accès

### Interface Contextuelle
- Badge "Établissement" pour clarifier le contexte
- Affichage des types de personnel acceptés
- Lien vers l'espace professionnel général pour les non-SOGARA
- Contact direct SOGARA (email + téléphone)

## 🔒 Sécurité et Permissions

### Vérifications Effectuées
1. **Authentification** : Email/mot de passe valides
2. **Rôle Professionnel** : L'utilisateur doit avoir un rôle professionnel
3. **Accès SOGARA** : L'utilisateur doit être affilié à CMST SOGARA
4. **État Actif** : L'affiliation doit être active

### Redirections selon le Profil
- **Personnel SOGARA valide** → `/dashboard/professional` avec SOGARA pré-sélectionné
- **Professionnel d'autres établissements** → `/professional/select-establishment`
- **Patient** → Message d'erreur + déconnexion
- **Aucun accès** → Message d'erreur + déconnexion

## 🚀 Pour Utiliser la Version Améliorée

Dans `AppMain.tsx`, remplacer :
```typescript
// Ancienne route
<Route path="/login/sogara" element={<SogaraLogin />} />

// Par la nouvelle version
<Route path="/login/sogara" element={<SogaraLoginEnhanced />} />
```

## 💡 Avantages de cette Architecture

### Pour l'Utilisateur
- Navigation intuitive et contextuelle
- Retour facile vers la page de l'établissement
- Messages d'erreur clairs et informatifs
- Options alternatives proposées

### Pour SOGARA
- Page de connexion dédiée avec branding spécifique
- Vérification stricte des accès
- Séparation claire du personnel SOGARA
- Contact direct intégré

### Pour la Maintenance
- Code modulaire et réutilisable
- Logique de vérification centralisée
- Facile à dupliquer pour d'autres établissements
- Gestion des erreurs robuste

## 📋 Checklist d'Implémentation

- [x] Modification du bouton "Personnel CMST" dans Sogara.tsx
- [x] Adaptation du bouton retour dans SogaraLogin.tsx
- [x] Création de SogaraLoginEnhanced.tsx avec fonctionnalités avancées
- [ ] Mise à jour des routes dans AppMain.tsx
- [ ] Tests de navigation complets
- [ ] Vérification des permissions SOGARA

## 🔄 Flux Alternatifs

### Pour d'autres établissements
Le même modèle peut être répliqué :
- `/chu-libreville` → `/login/chu-libreville` → `/chu-libreville`
- `/chr-melen` → `/login/chr-melen` → `/chr-melen`

### Pour l'accès général professionnel
- `/login/professional` → Sélection d'établissement si multiple
- `/login/professional?establishment=ID` → Connexion directe à un établissement
