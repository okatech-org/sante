-- Add more sample messages with different media types

-- Message with image and text (Radiology result)
INSERT INTO public.messages (recipient_id, sender_name, sender_type, subject, content, category, priority, attachments, created_at)
SELECT 
  id,
  'Dr. Marie AKENDENGUE',
  'doctor',
  'Résultats de votre radiographie pulmonaire',
  'Bonjour,

Suite à votre consultation du 15 janvier, voici les résultats de votre radiographie thoracique.

L''examen montre des poumons bien aérés, sans opacité anormale. Le cœur est de taille normale. Les coupoles diaphragmatiques sont régulières.

Conclusion : Examen radiologique normal.

Vous pouvez poursuivre votre traitement habituel.

Bien cordialement,
Dr. Marie AKENDENGUE
Service de Radiologie',
  'result',
  'normal',
  '[
    {
      "name": "Radio_Thorax_15012025.jpg",
      "type": "image/jpeg",
      "size": "2.3 MB",
      "url": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800",
      "preview": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400"
    },
    {
      "name": "Compte_Rendu_Radio.pdf",
      "type": "application/pdf",
      "size": "156 KB",
      "url": "#"
    }
  ]'::jsonb,
  now() - interval '3 days'
FROM auth.users
WHERE email LIKE '%demo%' OR email LIKE '%patient%'
LIMIT 1;

-- Message with video tutorial (Physiotherapy exercises)
INSERT INTO public.messages (recipient_id, sender_name, sender_type, subject, content, category, priority, attachments, created_at)
SELECT 
  id,
  'Clinique de Kinésithérapie',
  'hospital',
  'Exercices de rééducation - Tutoriel vidéo',
  'Bonjour,

Comme convenu lors de votre dernière séance, voici la vidéo des exercices à pratiquer chez vous.

**Programme d''exercices quotidiens :**

1. Échauffement : 5 minutes de marche légère
2. Exercice 1 : Étirements des membres inférieurs (voir vidéo à 02:15)
3. Exercice 2 : Renforcement musculaire (voir vidéo à 05:30)
4. Exercice 3 : Exercices d''équilibre (voir vidéo à 08:45)
5. Retour au calme : 3 minutes d''étirements doux

À pratiquer 2 fois par jour, matin et soir.

**Important :** 
- Arrêtez si vous ressentez une douleur
- Respirez normalement pendant les exercices
- Progressez à votre rythme

N''hésitez pas à nous contacter si vous avez des questions.

Bon courage !

L''équipe de kinésithérapie',
  'reminder',
  'normal',
  '[
    {
      "name": "Exercices_Kine_Tutorial.mp4",
      "type": "video/mp4",
      "size": "45.8 MB",
      "duration": "12:34",
      "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "thumbnail": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
    },
    {
      "name": "Programme_Exercices.pdf",
      "type": "application/pdf",
      "size": "892 KB",
      "url": "#"
    }
  ]'::jsonb,
  now() - interval '12 hours'
FROM auth.users
WHERE email LIKE '%demo%' OR email LIKE '%patient%'
LIMIT 1;

-- Message with multiple images (Dermatology consultation)
INSERT INTO public.messages (recipient_id, sender_name, sender_type, subject, content, category, priority, attachments, is_read, created_at)
SELECT 
  id,
  'Dr. Paul OYONO - Dermatologue',
  'doctor',
  'Suivi dermatologique - Évolution favorable',
  'Bonjour,

J''ai bien reçu les photos que vous m''avez envoyées.

L''évolution est très favorable. On observe une nette amélioration par rapport aux photos précédentes. La zone concernée montre des signes de cicatrisation normaux.

**Recommandations :**
- Continuez l''application de la crème prescrite 2x/jour
- Protégez la zone du soleil
- Hydratez bien la peau
- Prochain contrôle dans 2 semaines

Vous pouvez comparer avec les photos de la première consultation ci-jointes.

Excellent progrès !

Dr. Paul OYONO',
  'result',
  'normal',
  '[
    {
      "name": "Photo_Avant_Traitement.jpg",
      "type": "image/jpeg",
      "size": "1.8 MB",
      "url": "https://images.unsplash.com/photo-1579154204845-170c2bcbf908?w=800",
      "preview": "https://images.unsplash.com/photo-1579154204845-170c2bcbf908?w=400"
    },
    {
      "name": "Photo_Apres_1_Semaine.jpg",
      "type": "image/jpeg",
      "size": "1.9 MB",
      "url": "https://images.unsplash.com/photo-1582719471137-c3967ffb9851?w=800",
      "preview": "https://images.unsplash.com/photo-1582719471137-c3967ffb9851?w=400"
    },
    {
      "name": "Photo_Apres_2_Semaines.jpg",
      "type": "image/jpeg",
      "size": "2.1 MB",
      "url": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800",
      "preview": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400"
    }
  ]'::jsonb,
  true,
  now() - interval '4 days'
FROM auth.users
WHERE email LIKE '%demo%' OR email LIKE '%patient%'
LIMIT 1;

-- Urgent alert message (text only)
INSERT INTO public.messages (recipient_id, sender_name, sender_type, subject, content, category, priority, created_at)
SELECT 
  id,
  'Service des Urgences - CHU',
  'hospital',
  '🚨 IMPORTANT - Rappel vaccinal obligatoire',
  'ALERTE IMPORTANTE

Cher patient,

Nos dossiers indiquent que votre rappel de vaccination contre le tétanos arrive à échéance ce mois-ci.

**Date limite : 31 Janvier 2025**

Cette vaccination est obligatoire pour votre protection. Nous vous invitons à prendre rendez-vous dans les plus brefs délais.

**Comment prendre RDV :**
1. Via l''application SANTE.GA
2. Par téléphone : +241 01 76 54 32
3. À l''accueil du centre de vaccination

**Documents à apporter :**
- Carte d''identité
- Carte CNAMGS
- Carnet de vaccination

Le vaccin est pris en charge à 100% par la CNAMGS.

Service de Prévention
CHU de Libreville',
  'alert',
  'urgent',
  now() - interval '6 hours'
FROM auth.users
WHERE email LIKE '%demo%' OR email LIKE '%patient%'
LIMIT 1;

-- Billing message with invoice
INSERT INTO public.messages (recipient_id, sender_name, sender_type, subject, content, category, priority, attachments, is_read, created_at)
SELECT 
  id,
  'Service Comptabilité - Clinique Sainte-Marie',
  'hospital',
  'Facture consultation du 10 Janvier 2025',
  'Bonjour,

Veuillez trouver ci-joint votre facture pour la consultation du 10 janvier 2025.

**Détails de la facture :**
- Consultation spécialisée : 25 000 FCFA
- Examens complémentaires : 15 000 FCFA
- Total : 40 000 FCFA
- Part CNAMGS (80%) : 32 000 FCFA
- Votre part (20%) : 8 000 FCFA

Votre part a déjà été réglée lors de la consultation.

Le remboursement CNAMGS sera effectué sous 15 jours ouvrés.

Pour toute question concernant cette facture, n''hésitez pas à nous contacter.

Service Comptabilité
Clinique Sainte-Marie',
  'billing',
  'normal',
  '[
    {
      "name": "Facture_CSM_20250110.pdf",
      "type": "application/pdf",
      "size": "234 KB",
      "url": "#"
    },
    {
      "name": "Justificatif_Paiement.pdf",
      "type": "application/pdf",
      "size": "128 KB",
      "url": "#"
    }
  ]'::jsonb,
  true,
  now() - interval '6 days'
FROM auth.users
WHERE email LIKE '%demo%' OR email LIKE '%patient%'
LIMIT 1;

-- Laboratory message with detailed results
INSERT INTO public.messages (recipient_id, sender_name, sender_type, subject, content, category, priority, attachments, created_at)
SELECT 
  id,
  'Laboratoire Central d''Analyses',
  'laboratory',
  'Résultats d''analyses biologiques disponibles',
  'Bonjour,

Vos résultats d''analyses sont maintenant disponibles.

**Analyses effectuées le 18 Janvier 2025**

Tous les paramètres analysés sont dans les normes de référence :

✅ Numération Formule Sanguine (NFS) : Normal
✅ Glycémie à jeun : 0.92 g/L (normale)
✅ Cholestérol total : 1.85 g/L (normal)
✅ Triglycérides : 1.20 g/L (normal)
✅ Créatinine : 9 mg/L (normale)
✅ Transaminases (ALAT, ASAT) : Normales

**Conclusion :**
Bilan biologique satisfaisant. Aucune anomalie détectée.

Les résultats détaillés sont disponibles dans les documents joints au format PDF.

Ces résultats ont été transmis à votre médecin traitant.

Laboratoire Central d''Analyses
Tel: +241 01 44 55 66',
  'result',
  'high',
  '[
    {
      "name": "Resultats_Analyses_Completes.pdf",
      "type": "application/pdf",
      "size": "456 KB",
      "url": "#"
    },
    {
      "name": "Graphique_Evolution.png",
      "type": "image/png",
      "size": "890 KB",
      "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      "preview": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
    }
  ]'::jsonb,
  now() - interval '8 hours'
FROM auth.users
WHERE email LIKE '%demo%' OR email LIKE '%patient%'
LIMIT 1;