# 🚀 Prochaines Étapes - Implémentation SOGARA Complète

## 📊 État Actuel

✅ **Complété**
- Compte démo SOGARA créé
- Route `/demo/sogara` implémentée  
- Dashboard démo SOGARA accessible
- Profil établissement en BD
- Redirections corrigées

⏳ **À Faire**
- Équipe médicale SOGARA
- RDV en ligne patients
- Téléconsultation WebRTC
- Facturation CNAMGS/CNSS
- DMP patients consolidé

---

## 📝 PHASE 2 : Équipe Médicale SOGARA (2-3 heures)

### Objectifs
- Ajouter médecins/infirmiers/staff SOGARA
- Configurer spécialités et horaires
- Lier médecins → établissement SOGARA

### Tâches
1. **Ajouter médecins démo SOGARA** dans `create-demo-accounts`
   - Dr. Généraliste (Médecine générale)
   - Dr. Gynécologue-obstétricien (Maternité)
   - Dr. Chirurgien (Bloc opératoire)

2. **Créer table `establishment_professionals`** (si absent)
   - Lier professional_id → establishment_id
   - Rôle du professionnel à l'établissement

3. **Interface admin SOGARA** pour gérer staff
   - Ajouter/supprimer médecins
   - Configurer horaires de consultation
   - Définir services par médecin

### Code à Ajouter
```typescript
// create-demo-accounts/index.ts
{
  email: "dr.generaliste.sogara@sante.ga",
  fullName: "Dr. Jean MBOGO",
  role: "doctor",
  phone: "+24101234590"
},
{
  email: "dr.gyneco.sogara@sante.ga",
  fullName: "Dr. Marie NGUEMA",
  role: "specialist",
  phone: "+24101234591"
}
```

---

## 📝 PHASE 3 : RDV en Ligne SOGARA (3-4 heures)

### Objectifs
- Patients SOGARA peuvent prendre RDV
- RDV présentiel + téléconsultation
- Calendrier médecin temps réel

### Tâches
1. **RDV API** : POST `/api/appointments/create`
   - Réserver créneau médecin SOGARA
   - Vérifier disponibilité
   - Confirmer SMS patient

2. **Interface Patient**
   - Rechercher médecins SOGARA
   - Voir créneau disponibles
   - Confirmer RDV avec horaire

3. **Interface Médecin**
   - Afficher agenda SOGARA
   - Accepter/rejeter RDV
   - Marquer consultation comme complétée

### Fichiers à Modifier
- `src/hooks/useAppointments.ts`
- `src/pages/Appointments.tsx`
- `src/pages/professional/Agenda.tsx`

---

## 📝 PHASE 4 : Téléconsultation WebRTC (4-5 heures)

### Objectifs
- Patients ↔ Médecin SOGARA en vidéo E2EE
- Partage ordonnance en temps réel
- Enregistrement (optionnel)

### Tâches
1. **WebRTC Signaling**
   - STUN/TURN servers (coturn ou Metered)
   - Création session vidéo unique
   - Gestion timeouts

2. **Chiffrement E2EE**
   - SRTP pour audio/vidéo
   - Clés d'échange sécurisées

3. **UI Téléconsult**
   - Affichage vidéo patient ↔ médecin
   - Contrôles (mute, caméra, stop)
   - Timer durée consultation

### Stack Recommandé
- **WebRTC** : `peerjs` ou `simple-peer`
- **Signaling** : WebSocket Supabase ou Realtime
- **TURN** : `coturn.ubuntu.com` ou Metered

---

## 📝 PHASE 5 : Facturation CNAMGS (2-3 heures)

### Objectifs
- Vérifier droits assuré avant RDV
- Tiers-payant automatique
- Facturation API CNAMGS

### Tâches
1. **Vérification Droits**
   - API lookup CNAMGS par numéro assuré
   - Cache résultat 24h
   - Afficher statut au patient

2. **Tiers-Payant**
   - Post-RDV → créer facture
   - Envoyer API CNAMGS
   - Tracker remboursement

3. **GAP Tarification**
   - TC (tarif conventionné) vs tarif réel
   - Afficher reste à charge patient
   - Valider acceptance avant RDV

### API Calls
```bash
# Vérifier droits CNAMGS
POST /api/cnamgs/verify-rights
Body: { numAssure: "... ", dateNaissance: "..." }

# Facturer consultation
POST /api/cnamgs/create-invoice
Body: { appointmentId: "...", professionalId: "...", tarif: 50000 }
```

---

## 📝 PHASE 6 : DMP Consolidé (3-4 heures)

### Objectifs
- Patient voit historique consultations SOGARA + autres
- Médecin voit DMP complet patient
- Consentement audit des accès

### Tâches
1. **Agrégation DMP**
   - Requête consultations → toutes établissements
   - Tri chronologique
   - Groupement par type (consultation, ordonnance, résultat)

2. **Permissions Accès**
   - Patient contrôle qui accède à quoi
   - Logs complets : qui a accédé quand
   - Droit oubli (suppression)

3. **Export Patient**
   - Télécharger DMP complet PDF/ZIP
   - Format standard
   - Prêt pour partage médecin externe

### Table À Créer
```sql
CREATE TABLE patient_dmp_consents (
  id UUID PRIMARY KEY,
  patient_id UUID,
  professional_id UUID,
  allowed_until DATE,
  data_types TEXT[], -- 'consultations', 'ordonnances', etc
  created_at TIMESTAMP
);

CREATE TABLE dmp_access_logs (
  id UUID PRIMARY KEY,
  patient_id UUID,
  accessed_by UUID,
  access_type TEXT,
  accessed_at TIMESTAMP,
  ip_address TEXT
);
```

---

## 📝 PHASE 7 : Notifications (1-2 heures)

### Objectifs
- SMS/Email/Push notifications
- Rappels RDV 24h
- Alertes importante (résultat, ordonnance)

### Tâches
1. **SMS Service**
   - Intégration Twilio ou AWS SNS
   - Template SMS (RDV, ordonnance)

2. **Email Notifications**
   - SendGrid ou Resend
   - HTML templates

3. **Push Notifications**
   - Service Workers + Web Push API
   - Pour users connectés

---

## 📊 Dépendances Par Phase

```
PHASE 2 (Staff)
    ↓
PHASE 3 (RDV) ← Dépend de PHASE 2
    ↓
PHASE 4 (Vidéo) ← Optionnel, peut être parallel
    ↓
PHASE 5 (Facturation) ← Critical avant production
    ↓
PHASE 6 (DMP) ← À faire après facturation
    ↓
PHASE 7 (Notifications) ← À faire en dernier
```

---

## ⏱️ Timeline Estimée

| Phase | Durée | Dépendance | Priorité |
|-------|-------|-----------|----------|
| 2 - Staff | 2-3h | Rien | 🔴 Critical |
| 3 - RDV | 3-4h | Phase 2 | 🔴 Critical |
| 5 - Facturation | 2-3h | Phase 3 | 🔴 Critical |
| 6 - DMP | 3-4h | Phase 5 | 🟠 High |
| 4 - Vidéo | 4-5h | Phase 3 | 🟠 High |
| 7 - Notifications | 1-2h | Phase 3 | 🟡 Medium |
| **TOTAL** | **15-21h** | | |

---

## 🔄 Ordre Recommandé

### MVP (1 semaine)
1. **PHASE 2** : Médecins SOGARA (2-3h)
2. **PHASE 3** : RDV en ligne (3-4h)
3. **PHASE 5** : Facturation CNAMGS (2-3h)

### V1.0 (2e semaine)
4. **PHASE 6** : DMP consolidé (3-4h)
5. **PHASE 4** : Téléconsultation WebRTC (4-5h)
6. **PHASE 7** : Notifications (1-2h)

---

## 📌 Checklist de Démarrage Phase 2

- [ ] Lire specs PHASE 2 (PROMPT_02_AuthNeuron)
- [ ] Ajouter médecins démo dans `create-demo-accounts`
- [ ] Créer table `establishment_professionals` si absent
- [ ] Tester initialisation comptes avec médecins SOGARA
- [ ] Interface admin SOGARA pour gérer staff
- [ ] Tests unitaires pour création médecin
- [ ] Deploy fonction Supabase modifiée
- [ ] Tests e2e : patient peut voir médecins SOGARA

---

**Prochaine Action** : PHASE 2 - Équipe Médicale SOGARA
**Estimation** : 2-3 heures
**Priorité** : 🔴 CRITICAL (nécessaire pour RDV)
