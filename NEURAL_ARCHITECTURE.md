# 🧠 SANTE.GA - Architecture Neuronale

## Vue d'ensemble

L'architecture neuronale de SANTE.GA est basée sur un système d'événements distribué inspiré du fonctionnement du cerveau humain.

### Composants principaux

- **EventBus** : Système nerveux central (synapses)
- **BaseNeuron** : Classe de base pour tous les neurones (services autonomes)
- **Logger** : Système de logging centralisé avec Winston
- **Config** : Configuration centralisée

## Structure du projet

```
src/neural/
├── core/
│   ├── EventBus.js          # 📤 Système central d'événements
│   ├── BaseNeuron.js        # 🧠 Classe de base des neurones
│   ├── Logger.js            # 📝 Logging Winston
│   └── Config.js            # ⚙️ Configuration
├── neurons/                 # 🚀 Neurones spécifiques (à venir)
├── types/
│   └── events.js            # 📋 Types d'événements
└── server.js                # 🚀 Point d'entrée
```

## Démarrage rapide

### Installation des dépendances
```bash
npm install
```

### Lancer le serveur
```bash
npm run neural:dev
```

### Tester
```bash
npm run neural:test
```

### Vérifier la santé du système
```bash
curl http://localhost:3000/health
```

## API du serveur

### Health Check
```bash
GET /health
```
Retourne l'état du serveur et les métriques de l'Event Bus.

### Métriques Event Bus
```bash
GET /metrics/eventbus
```
Retourne les métriques complètes de l'Event Bus (total événements, par type, erreurs, etc.)

### Historique des événements
```bash
GET /events/history?type=USER_LOGIN&limit=50
```
Retourne l'historique des événements avec filtres optionnels.

## Architecture de l'Event Bus

### Publier un événement
```javascript
import eventBus from './core/EventBus.js';

await eventBus.publish('USER_REGISTERED', {
  userId: '123',
  email: 'user@sante.ga'
}, {
  source: 'AuthNeuron'
});
```

### S'abonner à un événement
```javascript
eventBus.subscribe('USER_REGISTERED', async (event) => {
  console.log('Nouvel utilisateur:', event.data);
}, 'NotificationNeuron');
```

## Créer un nouveau neurone

### Exemple : PatientNeuron

```javascript
import BaseNeuron from '../core/BaseNeuron.js';
import { EventTypes } from '../types/events.js';

class PatientNeuron extends BaseNeuron {
  getSubscriptions() {
    return [
      { 
        eventType: EventTypes.PATIENT_REGISTERED, 
        handler: this.handlePatientRegistration 
      },
      { 
        eventType: EventTypes.PATIENT_PROFILE_UPDATED, 
        handler: this.handleProfileUpdate 
      }
    ];
  }

  async handlePatientRegistration(event) {
    // Traiter l'enregistrement du patient
    const { data } = event;
    console.log('Patient enregistré:', data.email);
    
    // Émettre des événements
    await this.emit(EventTypes.PATIENT_INSURANCE_VERIFIED, {
      patientId: data.id,
      verified: true
    });
  }

  async handleProfileUpdate(event) {
    // Traiter la mise à jour du profil
    const { data } = event;
    console.log('Profil mis à jour:', data.patientId);
  }

  async onActivate() {
    console.log('PatientNeuron initialisé');
  }

  async onDeactivate() {
    console.log('PatientNeuron arrêté');
  }
}

export default PatientNeuron;
```

### Activer le neurone dans server.js

```javascript
import PatientNeuron from './neurons/PatientNeuron.js';

const patientNeuron = new PatientNeuron('PatientNeuron');

const start = async () => {
  try {
    logger.info('🚀 Starting SANTE.GA Neural Server...');
    
    await patientNeuron.activate();
    
    app.listen(config.port, () => {
      logger.info(`✅ Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};
```

## Types d'événements disponibles

Voir `src/neural/types/events.js` pour la liste complète des événements :

- **Authentification** : USER_REGISTERED, USER_LOGIN, USER_LOGOUT, PASSWORD_RESET_REQUESTED
- **Patients** : PATIENT_REGISTERED, PATIENT_PROFILE_UPDATED, PATIENT_INSURANCE_VERIFIED, PATIENT_DELETED
- **Professionnels** : PROFESSIONAL_REGISTERED, PROFESSIONAL_VERIFIED, PROFESSIONAL_PROFILE_UPDATED
- **Rendez-vous** : APPOINTMENT_CREATED, APPOINTMENT_CONFIRMED, APPOINTMENT_CANCELLED, APPOINTMENT_COMPLETED, APPOINTMENT_REMINDER_SENT
- **Prescriptions** : PRESCRIPTION_CREATED, PRESCRIPTION_SENT_TO_PHARMACY, PRESCRIPTION_DISPENSED
- **Notifications** : NOTIFICATION_SENT, SMS_SENT, EMAIL_SENT, PUSH_NOTIFICATION_SENT

## Métriques et monitoring

### Obtenir les métriques d'un neurone

```javascript
const metrics = neuron.getMetrics();
console.log(metrics);
// {
//   eventsProcessed: 10,
//   eventsEmitted: 5,
//   errors: 0,
//   uptime: 3600000,
//   isActive: true
// }
```

### Obtenir les métriques de l'Event Bus

```bash
curl http://localhost:3000/metrics/eventbus
```

## Gestion des erreurs

L'Event Bus capture automatiquement les erreurs et les log. Les neurones peuvent aussi capturer les erreurs dans leurs handlers :

```javascript
class MyNeuron extends BaseNeuron {
  async handleEvent(event) {
    try {
      // Traitement
      await processData(event.data);
    } catch (error) {
      this.logger.error('Erreur lors du traitement:', error);
      // Les métriques d'erreur sont automatiquement incrémentées
    }
  }
}
```

## Prochaines étapes

1. **Implémenter AuthNeuron** (authentification JWT)
2. **Implémenter PatientNeuron** (gestion des patients et DMP)
3. **Implémenter ProfessionalNeuron** (gestion des médecins)
4. **Implémenter AppointmentNeuron** (gestion des rendez-vous)
5. **Implémenter NotificationNeuron** (SMS/Email/Push)

Voir `01_PROMPT_Architecture_Base_EventBus.md` pour plus de détails.
