# 🚀 Guide de Déploiement - Tennis String Advisor

## 📋 Checklist Pré-Déploiement

### ✅ Configuration Requise
- [ ] Node.js 18+ installé
- [ ] PostgreSQL 14+ configuré
- [ ] Variables d'environnement définies
- [ ] Clés API obtenues (Stripe, OAuth, etc.)
- [ ] Domaine configuré avec SSL

### ✅ Base de Données
```bash
# Migration de la base de données
npx prisma migrate deploy

# Génération du client Prisma
npx prisma generate

# Seed des données initiales
npm run db:seed
```

### ✅ Tests et Validation
```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Audit de sécurité
npm audit

# Analyse du bundle
npm run analyze
```

## 🔧 Déploiement sur Vercel (Recommandé)

### 1. Préparation
```bash
# Installation de Vercel CLI
npm i -g vercel

# Login
vercel login

# Configuration du projet
vercel
```

### 2. Variables d'Environnement
Dans le dashboard Vercel, configurer :

**Production:**
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tennisstringadvisor.org
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
# etc.
```

### 3. Déploiement
```bash
# Déploiement automatique via Git
git push origin main

# Ou déploiement manuel
vercel --prod
```

### 4. Configuration DNS
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

## 🐳 Déploiement Docker

### 1. Build de l'image
```bash
# Créer l'image Docker
docker build -t tennis-string-advisor .

# Test local
docker run -p 3000:3000 tennis-string-advisor
```

### 2. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: tennis_string_advisor
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 3. Déploiement
```bash
docker-compose up -d
```

## ☁️ Déploiement sur AWS

### 1. Configuration ECS/Fargate
```bash
# Installation AWS CLI
aws configure

# Création du cluster ECS
aws ecs create-cluster --cluster-name tennis-string-advisor

# Push de l'image vers ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin xxx.dkr.ecr.us-east-1.amazonaws.com
docker tag tennis-string-advisor:latest xxx.dkr.ecr.us-east-1.amazonaws.com/tennis-string-advisor:latest
docker push xxx.dkr.ecr.us-east-1.amazonaws.com/tennis-string-advisor:latest
```

### 2. Configuration RDS
```bash
# Création de l'instance PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier tennis-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password SecurePassword123 \
  --allocated-storage 20
```

## 🔍 Monitoring et Maintenance

### 1. Monitoring Applicatif
- **Sentry** pour le monitoring des erreurs
- **Vercel Analytics** pour les métriques de performance
- **Google Analytics** pour l'usage utilisateur

### 2. Monitoring Infrastructure
```bash
# Health checks
curl https://tennisstringadvisor.org/api/health

# Métriques de performance
npm run audit:performance
```

### 3. Backups Automatiques
```bash
# Backup de la base de données
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup des données utilisateur
npm run db:backup
```

## 🚨 Rollback et Récupération

### 1. Rollback Vercel
```bash
# Liste des déploiements
vercel ls

# Rollback vers une version précédente
vercel rollback [deployment-url]
```

### 2. Rollback Base de Données
```bash
# Restauration depuis backup
psql $DATABASE_URL < backup_20240825_120000.sql

# Migration rollback
npx prisma migrate reset
```

## 📈 Optimisations Post-Déploiement

### 1. Performance
- Configurer le CDN Vercel/CloudFlare
- Optimiser les images avec Vercel Image Optimization
- Activer la compression Gzip/Brotli

### 2. SEO
- Configurer Google Search Console
- Générer et soumettre le sitemap
- Vérifier les méta-données

### 3. Sécurité
- Configurer les headers de sécurité
- Activer HTTPS strict
- Configurer les CORS appropriés

## 📞 Support et Maintenance

### Contacts d'Urgence
- **DevOps Lead:** [email]
- **Database Admin:** [email]
- **Security Team:** [email]

### Procédures d'Urgence
1. **Incident de sécurité:** Isoler, analyser, corriger
2. **Panne de base de données:** Basculer sur le backup
3. **Surcharge serveur:** Activer l'auto-scaling

### Maintenance Programmée
- **Mise à jour mensuelle** des dépendances
- **Backup hebdomadaire** complet
- **Audit trimestriel** de sécurité

---

**Note:** Ce guide doit être mis à jour à chaque changement d'infrastructure ou de processus de déploiement.