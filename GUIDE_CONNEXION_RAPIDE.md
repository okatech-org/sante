# 🚀 Guide de Connexion Rapide - SANTE.GA

## ✅ Statut : Tout fonctionne !

La connexion à Supabase est **opérationnelle**. Voici comment vous connecter.

---

## 👤 Compte Patient de Test

### Identifiants
```
Email: pierrette.nomsi@gmail.com
Mot de passe: Nomsi@Patient2024
```

### URL de connexion
```
http://localhost:5173/login/patient
```

### ✅ Vérifié le 30/10/2025
- ✅ Compte créé
- ✅ Email confirmé
- ✅ Connexion fonctionnelle

---

## 🎯 Comment se connecter

### 1️⃣ Démarrer l'application

```bash
npm run dev
```

L'application démarre sur : http://localhost:5173

### 2️⃣ Accéder à la page de connexion patient

Ouvrez votre navigateur sur :
```
http://localhost:5173/login/patient
```

### 3️⃣ Se connecter

Entrez les identifiants du compte patient :
- **Email** : `pierrette.nomsi@gmail.com`
- **Mot de passe** : `Nomsi@Patient2024`

### 4️⃣ Profiter de l'application ! 🎉

Vous serez redirigé vers le dashboard patient.

---

## 🐛 Si vous obtenez encore l'erreur 400

### Causes possibles

1. **Mauvais identifiants saisis**
   - ✅ Vérifiez que vous utilisez exactement : `pierrette.nomsi@gmail.com`
   - ✅ Le mot de passe est sensible à la casse : `Nomsi@Patient2024`

2. **Cache du navigateur**
   ```
   Solution : Ouvrez une fenêtre de navigation privée (Cmd+Shift+N sur Chrome)
   ```

3. **Application non démarrée**
   ```bash
   npm run dev
   ```

4. **Problème de connexion Supabase**
   - Vérifiez que le fichier `.env` existe et contient les bonnes clés
   - Vérifiez votre connexion Internet

---

## 🔍 Diagnostic

### Test de connexion rapide

Exécutez ce script pour tester :

```bash
node create-pierrette-patient.js
```

Ce script vérifie que le compte existe et fonctionne.

---

## 📝 Autres comptes disponibles

### Super Admin
- Consultez `SUPER_ADMIN_SETUP.md` pour créer un compte super admin

### Professionnels SOGARA
- Consultez `SOGARA_IDENTIFIANTS_COMPLETS.md` pour les comptes SOGARA

---

## ⚠️ Notes importantes

1. **Email de confirmation** : Le compte patient est déjà confirmé, pas besoin de cliquer sur un lien email

2. **Rôles utilisateur** : Le compte patient n'a pas de rôles spécifiques dans `user_roles`, mais cela ne l'empêche pas de se connecter

3. **Développement local** : Ces identifiants sont pour le développement local uniquement

---

## 🆘 Besoin d'aide ?

Si vous rencontrez toujours des problèmes :

1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet **Console**
3. Cherchez les messages d'erreur en rouge
4. Allez dans l'onglet **Network**
5. Cherchez la requête vers `/auth/v1/token`
6. Cliquez dessus et regardez la réponse

### Messages d'erreur courants

| Erreur | Signification | Solution |
|--------|---------------|----------|
| `Invalid login credentials` | Email ou mot de passe incorrect | Vérifiez les identifiants |
| `Email not confirmed` | Email non confirmé | Cliquez sur le lien dans l'email |
| `User not found` | Utilisateur n'existe pas | Exécutez `node create-pierrette-patient.js` |
| `Network error` | Problème de connexion | Vérifiez Internet et Supabase |

---

## ✨ Conclusion

Votre plateforme SANTE.GA est prête ! Le compte patient fonctionne et vous pouvez maintenant :

- ✅ Vous connecter
- ✅ Accéder au dashboard
- ✅ Prendre des rendez-vous
- ✅ Consulter le dossier médical

**Bonne utilisation ! 🏥**

