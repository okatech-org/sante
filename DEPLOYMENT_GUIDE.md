# 🚀 GUIDE DE DÉPLOIEMENT - SANTE.GA Neural Architecture

## 📋 TABLE DES MATIÈRES

1. [Développement Local](#développement-local)
2. [Production Docker](#production-docker)
3. [Cloud Deployment](#cloud-deployment)
4. [CI/CD avec GitHub Actions](#cicd-avec-github-actions)
5. [Monitoring & Alertes](#monitoring--alertes)
6. [Backup & Restore](#backup--restore)
7. [Scaling & Performance](#scaling--performance)

---

## 🛠️ DÉVELOPPEMENT LOCAL

### Installation & Démarrage

```bash
# 1. Cloner le repository
git clone https://github.com/your-org/sante-ga-neural.git
cd sante-ga-neural

# 2. Copier le fichier .env
cp .env.example .env

# 3. Démarrer la stack complète
docker-compose up -d

# 4. Vérifier le statut
docker-compose ps

# 5. Voir les logs
docker-compose logs -f neural-server
```

### Services disponibles

- **Backend API** : http://localhost:3000
- **Frontend** : http://localhost:5173
- **PostgreSQL** : localhost:5432
- **Redis** : localhost:6379
- **Adminer (DB GUI)** : http://localhost:8080

### Commandes utiles

```bash
# Voir les logs du serveur
docker-compose logs -f neural-server

# Entrer dans le conteneur
docker-compose exec neural-server sh

# Redémarrer un service
docker-compose restart neural-server

# Arrêter tout
docker-compose down

# Rebuild après changements
docker-compose up -d --build
```

---

## 🏭 PRODUCTION DOCKER

### Prérequis

- Docker & Docker Compose (v20+)
- SSL Certificates (Let's Encrypt)
- Variables d'environnement configurées

### Configuration

```bash
# 1. Créer le fichier .env.production
cp .env.example .env.production

# 2. Éditer avec vos secrets
nano .env.production

# 3. Générer certificats SSL
mkdir -p nginx/ssl
# Utiliser Let's Encrypt ou copier vos certificats
```

### Démarrage Production

```bash
# 1. Build l'image
docker build -t sante-ga-neural:latest .

# 2. Démarrer avec docker-compose production
docker-compose -f docker-compose.prod.yml up -d

# 3. Vérifier le statut
docker-compose -f docker-compose.prod.yml ps

# 4. Voir les logs
docker-compose -f docker-compose.prod.yml logs -f neural-server
```

### Scaling (Load Balancing)

```bash
# Augmenter le nombre de répliques
docker-compose -f docker-compose.prod.yml up -d --scale neural-server=3

# NGINX redistribuera automatiquement le trafic
```

### Health Checks

```bash
# Health check du serveur
curl -f https://sante.ga/health

# Métriques Event Bus
curl -f https://sante.ga/metrics/eventbus

# Voir les events
curl -f https://sante.ga/events/history?limit=50
```

---

## ☁️ CLOUD DEPLOYMENT

### AWS Elastic Beanstalk

```bash
# 1. Installer CLI
pip install awsebcli

# 2. Initialiser
eb init sante-ga-neural --platform="Docker running on 64bit Amazon Linux 2"

# 3. Créer environnement
eb create production --instance-type t3.medium --envvars \
  NODE_ENV=production,\
  SUPABASE_URL=your_url,\
  JWT_SECRET=your_secret

# 4. Déployer
eb deploy

# 5. Voir logs
eb logs

# 6. SSH vers instance
eb ssh
```

### Google Cloud Platform (Cloud Run)

```bash
# 1. Build et push
docker build -t gcr.io/YOUR-PROJECT/sante-ga-neural:latest .
docker push gcr.io/YOUR-PROJECT/sante-ga-neural:latest

# 2. Déployer
gcloud run deploy sante-ga-neural \
  --image gcr.io/YOUR-PROJECT/sante-ga-neural:latest \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --set-env-vars NODE_ENV=production,SUPABASE_URL=your_url

# 3. Récupérer URL
gcloud run services list
```

### Azure Container Instances

```bash
# 1. Créer resource group
az group create --name sante-ga-rg --location westeurope

# 2. Créer container
az container create \
  --resource-group sante-ga-rg \
  --name sante-ga-neural \
  --image your-registry/sante-ga-neural:latest \
  --dns-name-label sante-ga \
  --ports 3000 \
  --environment-variables NODE_ENV=production SUPABASE_URL=your_url \
  --cpu 1 --memory 1
```

---

## 🔄 CI/CD avec GitHub Actions

### Configuration

Le workflow `.github/workflows/deploy.yml` effectue automatiquement :

1. **Tests** - Jest tests sur chaque PR
2. **Build** - Construction Docker image
3. **Push** - Push vers GitHub Container Registry
4. **Deploy Staging** - Deploy automatique sur branche `staging`
5. **Deploy Production** - Deploy automatique sur branche `main`

### Secrets GitHub requis

```bash
# Ajouter dans Settings > Secrets

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
JWT_SECRET=strong_random_string
REDIS_PASSWORD=strong_password
DEPLOYMENT_SSH_KEY=your_private_key
DEPLOYMENT_SERVER=prod.sante.ga
```

### Workflow

```
Push to main
    ↓
Run Tests
    ↓
Build Docker Image
    ↓
Push to Registry
    ↓
Deploy to Production
    ↓
Health Check
    ↓
Success ✅
```

---

## 📊 MONITORING & ALERTES

### Prometheus + Grafana

```bash
# Démarrer monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d

# Accéder Prometheus
open http://localhost:9090

# Accéder Grafana
open http://localhost:3001
# Login: admin / admin
```

### Dashboards Grafana

Créer dashboards pour :
- Event Bus metrics (events/sec, latency)
- Neurone health (active, errors)
- API metrics (requests/sec, response times)
- System metrics (CPU, RAM, Network)

### Alertes (Recommandées)

```yaml
# Ajouter alertes Prometheus pour :
- CPU > 80%
- Memory > 90%
- API latency > 500ms
- Error rate > 1%
- Health check failures
- Redis down
```

Intégrer avec Slack, PagerDuty ou email.

---

## 💾 BACKUP & RESTORE

### Script de Backup Automatique

```bash
# Rendre le script exécutable
chmod +x scripts/backup.sh

# Tester le backup
./scripts/backup.sh

# Ajouter à crontab (backup quotidien à 2h)
crontab -e
# 0 2 * * * /path/to/scripts/backup.sh >> /var/log/backup.log 2>&1
```

### Restore de Backup

```bash
# PostgreSQL
docker exec sante-ga-postgres psql -U postgres sante_ga < backups/postgres_20250101_020000.sql

# Redis
docker exec sante-ga-redis-prod redis-cli SHUTDOWN
docker cp backups/redis_20250101_020000.rdb sante-ga-redis-prod:/data/dump.rdb
docker restart sante-ga-redis-prod
```

---

## 🎯 SCALING & PERFORMANCE

### Vertical Scaling (Aumentar resources)

```yaml
# Dans docker-compose.prod.yml
deploy:
  resources:
    limits:
      cpus: '2'        # Augmenter de 1 à 2
      memory: 2G       # Augmenter de 1G à 2G
```

### Horizontal Scaling (Ajouter instances)

```bash
# Aumentar nombre de réplicas
docker-compose -f docker-compose.prod.yml up -d --scale neural-server=5

# NGINX load balancing automatique
```

### Cache Strategy

- Redis pour Event Bus (Phase 2)
- Browser caching pour static assets (1 an)
- HTML cache disabled (no-cache)
- API caching headers

### Database Optimization

```sql
-- Créer indexes sur colonnes interrogées fréquemment
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_consultations_patient ON consultations(patient_id);
```

---

## ✅ CHECKLIST PRÉ-PRODUCTION

- [ ] Tests passent (34/34)
- [ ] Linter sans erreurs
- [ ] Variables d'environnement configurées
- [ ] SSL certificates valides
- [ ] Backup scripts testés
- [ ] Monitoring activé
- [ ] CI/CD configuré
- [ ] Health check OK
- [ ] Rate limiting configuré
- [ ] CORS correctement configuré
- [ ] Logs accessibles
- [ ] Base de données migrée (Supabase)

---

## 🆘 TROUBLESHOOTING

### Le serveur ne démarre pas

```bash
# Voir les logs
docker-compose logs neural-server

# Vérifier santé des dépendances
docker-compose ps

# Redémarrer tout
docker-compose down
docker-compose up -d
```

### Erreurs de connexion à la base de données

```bash
# Vérifier PostgreSQL
docker-compose exec postgres psql -U postgres -d sante_ga -c "SELECT 1"

# Vérifier migration
docker-compose exec postgres psql -U postgres -d sante_ga -c "\dt"
```

### Redis ne répond pas

```bash
# Vérifier Redis
docker-compose exec redis redis-cli ping

# Redémarrer
docker-compose restart redis
```

---

## 📞 SUPPORT

- Documentation : Voir les fichiers .md
- Logs : `docker-compose logs`
- Health : `curl localhost:3000/health`
- GitHub Issues : Pour bugs

---

**🚀 SANTE.GA est maintenant prêt pour la production !**
