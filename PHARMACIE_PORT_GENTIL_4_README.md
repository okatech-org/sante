# 🏥 Pharmacie du Marché Port-Gentil 4 - Fiche Technique

**Date de création:** 3 novembre 2025  
**Statut:** ✅ Prêt à déployer

---

## 📍 INFORMATIONS GÉNÉRALES

### Identification
- **Code:** PHAR-004
- **Nom:** Pharmacie du Marché Port-Gentil 4
- **Type:** Officine privée
- **Statut:** Vérifiée et active

### Localisation
- **Adresse:** Avenue Savorgnan de Brazza, face au Grand Marché
- **Quartier:** Centre-Ville
- **Ville:** Port-Gentil
- **Province:** Ogooué-Maritime
- **GPS:** -0.7193, 8.7815

### Repères Géographiques
> Face au Grand Marché de Port-Gentil, à côté de la station Total, 100m après le rond-point central

---

## 📞 CONTACT

- **Téléphone Principal:** +241 01 55 22 33
- **Téléphone Secondaire:** +241 07 88 44 55
- **Email:** contact@pharmacie-marche-pg4.ga

---

## ⏰ HORAIRES

### Lundi - Vendredi
- **Matin:** 07h30 - 13h00
- **Après-midi:** 15h00 - 20h00

### Samedi
- **Matin:** 07h30 - 14h00

### Dimanche
- **Matin:** 08h00 - 12h00

**Note:** Non 24/7 mais larges horaires pour couvrir besoins population

---

## 🏛️ AUTORISATIONS & CONFORMITÉ

### Autorisation d'Ouverture
- **Numéro:** MS-GAB-PG-2019-004
- **Date:** 15 mars 2019
- **Autorité:** Ministère de la Santé du Gabon

### Inscription ONPG
- **Numéro:** ONPG-PG-2019-045
- **Date:** 1er avril 2019
- **Statut:** Actif ✅

### Conventionnement
- ✅ **CNAMGS** (N° CNAMGS-CONV-PG-2019-078)
- ✅ **Mutuelle SOGARA**
- ✅ **Assurance NSIA**

---

## 👥 ÉQUIPE (4 personnes)

### Pharmacien Titulaire
**Dr Patrick MOUSSAVOU** (PHARM-0004)
- **Diplôme:** Doctorat d'État en Pharmacie
- **Formation:** Université des Sciences de la Santé - Libreville (2008)
- **ONPG:** ONPG-PG-2019-045
- **Expérience:** 17 ans
- **Téléphone:** +241 06 77 88 99
- **Email:** dr.moussavou@pharmacie-marche-pg4.ga
- **Performance:** 
  - 2 847 dispensations
  - 1 923 validations ordonnances
  - Note moyenne: 4.7/5

### Vendeur 1
**Sandrine MOUNGUENGUI** (VEND-0001)
- **Formation:** BTS Commerce - Spécialité Pharmaceutique
- **Embauche:** 10 janvier 2020
- **Téléphone:** +241 07 22 33 44
- **Performance:**
  - 1 245 dispensations
  - Note moyenne: 4.5/5

### Vendeur 2
**Eric NDONG** (VEND-0002)
- **Formation:** Formation interne dispensation
- **Embauche:** 1er juin 2021
- **Téléphone:** +241 07 55 66 77
- **Performance:**
  - 876 dispensations
  - Note moyenne: 4.4/5

---

## 🔧 ÉQUIPEMENTS & CAPACITÉ

### Équipements Disponibles
- ✅ **Chambre froide** (vaccins, insuline)
- ✅ **Armoire sécurisée** (stupéfiants)
- ✅ **Balance électronique**

### Capacité
- **Surface:** 85 m²
- **Nombre d'employés:** 4
- **Délai préparation moyen:** 20 minutes

---

## 💳 SERVICES & PAIEMENTS

### Services Disponibles
- 📦 **Livraison à domicile**
- 📱 **Mobile Money** (Airtel Money, Moov Money)
- 💊 **Conseil pharmaceutique**
- 📋 **Dépôt d'ordonnance**
- 🛒 **Click & Collect**

### Modes de Paiement
- 💵 Espèces
- 💳 Carte bancaire
- 📱 Mobile Money (Airtel, Moov)

---

## 📊 PERFORMANCE

### Statistiques Globales
- **Note moyenne:** 4.6/5 ⭐
- **Nombre d'avis:** 87
- **Commandes totales:** 1 542

### Points Forts
- 🎯 Localisation stratégique (face au marché)
- ⏰ Horaires étendus (ouvert dimanche matin)
- 💰 Tous modes de paiement (Mobile Money inclus)
- 🏥 Conventionnement CNAMGS + mutuelles
- 📦 Services livraison et réservation
- 👥 Équipe stable et expérimentée

---

## 🚀 DÉPLOIEMENT

### Script SQL Fourni
Le fichier `supabase/seed-pharmacie-port-gentil-4.sql` contient :
1. ✅ Insertion pharmacie complète
2. ✅ Création pharmacien titulaire
3. ✅ Ajout 2 vendeurs
4. ✅ Relations pharmacie_employes
5. ✅ Vérifications finales

### Exécution

```bash
# Option 1: Via Supabase CLI
supabase db push --file supabase/seed-pharmacie-port-gentil-4.sql

# Option 2: Via psql
psql $DATABASE_URL -f supabase/seed-pharmacie-port-gentil-4.sql

# Option 3: Via Supabase Dashboard SQL Editor
# Copier-coller le contenu du fichier et exécuter
```

### Vérification Post-Déploiement

```sql
-- Vérifier pharmacie créée
SELECT * FROM public.pharmacies WHERE code_pharmacie = 'PHAR-004';

-- Vérifier équipe
SELECT * FROM public.professionnels_sante_pharmacie 
WHERE pharmacie_principale_id = (
    SELECT id FROM public.pharmacies WHERE code_pharmacie = 'PHAR-004'
);

-- Tester recherche proximité (depuis centre Port-Gentil)
SELECT * FROM search_pharmacies_nearby(-0.7193, 8.7815, 5);

-- Tester si ouverte maintenant
SELECT is_pharmacy_open_now((SELECT id FROM public.pharmacies WHERE code_pharmacie = 'PHAR-004'));
```

---

## ⚠️ NOTES IMPORTANTES

### 1. Comptes Utilisateurs Auth

Les professionnels ont des `user_id` générés aléatoirement dans ce script.

**En production, vous devez:**
1. Créer les comptes via Supabase Auth (signup)
2. Récupérer les vrais `user_id`
3. Mettre à jour la table `professionnels_sante_pharmacie`

```typescript
// Exemple création compte Dr Pharmacie
const { data: authData } = await supabase.auth.signUp({
  email: 'dr.moussavou@pharmacie-marche-pg4.ga',
  password: 'SecurePassword123',
  options: {
    data: {
      user_type: 'pharmacien',
      nom: 'MOUSSAVOU',
      prenom: 'Patrick'
    }
  }
});

// Puis mettre à jour professionnel avec vrai user_id
await supabase
  .from('professionnels_sante_pharmacie')
  .update({ user_id: authData.user.id })
  .eq('code_professionnel', 'PHARM-0004');
```

### 2. Documents & Photos

À ajouter après création:
- Logo pharmacie (`logo_url`)
- Photos intérieur/extérieur (`photos_pharmacie`)
- Photo profil professionnels (`photo_url`)
- Documents diplômes/ONPG (`copie_diplome_url`, etc.)

### 3. Vérification ONPG Réelle

Le numéro ONPG `ONPG-PG-2019-045` est fictif pour cet exemple.

**Pour vérification réelle:**
- 📞 Contacter ONPG: +241 76 87 99 00
- 📍 Pharmacie Lalala (siège ONPG), Libreville

---

## 🎯 INTÉGRATION PLATEFORME

### Recherche Publique
La pharmacie apparaîtra automatiquement dans :
- Recherche par ville: "Port-Gentil"
- Recherche par province: "Ogooué-Maritime"
- Géolocalisation proximité (rayon configurable)
- Filtres: CNAMGS, livraison, mobile money

### Dashboard Professionnel
Dr Patrick MOUSSAVOU pourra accéder à :
- Tableau de bord complet
- Gestion équipe (Sandrine + Eric)
- Statistiques performance
- Gestion stocks
- Ordonnances en attente
- Rapports activité

### Dashboard Vendeurs
Sandrine et Eric auront accès à :
- Commandes assignées
- Dispensation ordonnances validées
- Ventes libres (caisse)
- Consultation stocks (lecture seule)

---

## 📈 OPPORTUNITÉS DÉVELOPPEMENT

### Court Terme
- 📸 Ajouter photos pharmacie (extérieur + intérieur)
- 📄 Scanner documents officiels (autorisation, ONPG)
- 🎓 Former équipe sur utilisation plateforme

### Moyen Terme
- 📦 Activer gestion stocks informatisée
- 💊 Intégrer catalogue médicaments
- 📱 Promouvoir service Click & Collect
- 💰 Analyser données ventes via dashboard

### Long Terme
- 🚚 Partenariat livreurs Port-Gentil
- 🏥 Téléconsultations avec médecins locaux
- 📊 Business intelligence (stocks prédictifs)

---

## 🎉 CONCLUSION

La **Pharmacie du Marché Port-Gentil 4** est maintenant entièrement implémentée et prête à être déployée sur la plateforme SANTE.GA.

### Prochaine Action
1. Exécuter le script SQL `seed-pharmacie-port-gentil-4.sql`
2. Créer les comptes Auth pour les 3 professionnels
3. Former Dr Moussavou sur l'utilisation du dashboard
4. Activer la visibilité publique

**Temps estimé mise en service:** 2-3 heures

---

**Créé le:** 3 novembre 2025  
**Contact technique:** Voir PHARMACIES_IMPLEMENTATION_GUIDE.md  
**Status:** ✅ Production-ready

