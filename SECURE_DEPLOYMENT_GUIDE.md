# Secure Deployment Guide

This guide provides the safe, recommended way to deploy Amazon FDC Tool without exposing credentials or sensitive infrastructure details.

---

## 📋 Pre-Deployment Setup

### Step 1: Prepare Your Local Environment

```bash
# 1. Clone the repository
git clone https://github.com/your-org/Amazon-FDC-Tool.git
cd Amazon-FDC-Tool

# 2. Copy environment template
cp .env.example .env

# 3. Configure your environment (LOCALLY ONLY)
# Open .env and add your credentials from your secure credential manager:
nano .env
```

### Step 2: Configure Environment Variables

Edit your `.env` file with actual values from your secure credential storage:

```bash
# Database
DATABASE_URL=postgresql://user:password@your-postgres-host:5432/amazon_fdc_db
DB_PASSWORD=your-actual-password

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=copy-from-secure-storage
JWT_REFRESH_SECRET=copy-from-secure-storage

# Amazon APIs (from your Amazon Developer Console)
AMAZON_CLIENT_ID=copy-from-secure-storage
AMAZON_CLIENT_SECRET=copy-from-secure-storage
AMAZON_REFRESH_TOKEN=copy-from-secure-storage

# Amazon Advertising API
AMAZON_AD_CLIENT_ID=copy-from-secure-storage
AMAZON_AD_CLIENT_SECRET=copy-from-secure-storage
AMAZON_AD_REFRESH_TOKEN=copy-from-secure-storage

# Email (SMTP)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Domains & URLs
FRONTEND_URL=https://your-actual-domain.com
BACKEND_URL=https://your-actual-domain.com/api
CORS_ORIGIN=https://your-actual-domain.com
```

### Step 3: Export Deployment Variables

Set deployment-specific environment variables in your shell:

```bash
# Export these to your current shell (not in .env)
export EC2_HOST="your-ec2-instance.compute.amazonaws.com"
export EC2_USER="ubuntu"
export EC2_IP="xxx.xxx.xxx.xxx"  # Only if needed for specific operations
export PEM_FILE="/path/to/your/aws-key.pem"
export REPO_URL="https://github.com/your-org/Amazon-FDC-Tool.git"
export BRANCH="main"
export APP_DIR="/opt/amazon-fdc-tool"
```

---

## 🔍 Pre-Flight Checks

### Verify Environment Variables

```bash
# Check that variables are set
echo "EC2_HOST: $EC2_HOST"
echo "PEM_FILE: $PEM_FILE"
echo "REPO_URL: $REPO_URL"
echo "BRANCH: $BRANCH"
```

### Test SSH Connection

```bash
# Test connection to EC2
./check-connection.sh

# Manual test:
ssh -i "$PEM_FILE" $EC2_USER@$EC2_HOST "echo 'Connection successful'"
```

### Verify .env File

```bash
# Ensure .env is NOT committed
git status | grep .env
# Should return: nothing (file is in .gitignore)

# Verify sensitive files are excluded
cat .gitignore | grep -E "^\.env|\.pem|credentials"
# Should show multiple matches
```

---

## 🚀 Deployment Methods

### Method 1: Automated Deployment (Recommended)

```bash
# Set environment variables (see Step 3 above)

# Run deployment script
./deploy-to-ec2.sh

# The script will:
# 1. Test SSH connection
# 2. Clone/pull repository
# 3. Install dependencies
# 4. Build application
# 5. Start services with Docker
# 6. Display health check URL
```

### Method 2: Manual SSH Access

```bash
# Connect to EC2 instance
ssh -i "$PEM_FILE" $EC2_USER@$EC2_HOST

# On the server:
cd /opt/amazon-fdc-tool

# Pull latest code
git pull origin $BRANCH

# Update environment (manually or via scp)
scp -i "$PEM_FILE" .env $EC2_USER@$EC2_HOST:/opt/amazon-fdc-tool/

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Verify health
curl http://localhost:3001/health
```

### Method 3: Using GitHub Actions (Recommended for Automated CI/CD)

1. **Add GitHub Secrets** (in GitHub repo settings):
   - `DEPLOY_EC2_HOST` - Your EC2 hostname
   - `DEPLOY_EC2_USER` - EC2 SSH user (ubuntu)
   - `DEPLOY_PEM_KEY` - Contents of your .pem file
   - `DB_PASSWORD` - Database password
   - `JWT_SECRET` - JWT secret
   - `AMAZON_CLIENT_ID` - Amazon API credentials
   - etc.

2. **Create `.github/workflows/deploy.yml`**:
   ```yaml
   name: Deploy to EC2
   
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Configure SSH
           run: |
             mkdir -p ~/.ssh
             echo "${{ secrets.DEPLOY_PEM_KEY }}" > ~/.ssh/deploy.pem
             chmod 600 ~/.ssh/deploy.pem
             ssh-keyscan -H ${{ secrets.DEPLOY_EC2_HOST }} >> ~/.ssh/known_hosts
         
         - name: Deploy
           run: |
             ssh -i ~/.ssh/deploy.pem ${{ secrets.DEPLOY_EC2_USER }}@${{ secrets.DEPLOY_EC2_HOST }} << 'EOF'
             cd /opt/amazon-fdc-tool
             git pull origin main
             docker-compose -f docker-compose.prod.yml down
             docker-compose -f docker-compose.prod.yml up -d
             EOF
   ```

---

## 📊 Post-Deployment Verification

### Check Application Health

```bash
# Test backend API
curl https://your-domain.com/api/health

# Check logs
ssh -i "$PEM_FILE" $EC2_USER@$EC2_HOST "docker-compose -f /opt/amazon-fdc-tool/docker-compose.prod.yml logs --tail=100 backend"

# Check frontend
curl https://your-domain.com
```

### Monitor Services

```bash
# SSH into server
ssh -i "$PEM_FILE" $EC2_USER@$EC2_HOST

# Check running containers
docker ps

# View logs
docker-compose -f /opt/amazon-fdc-tool/docker-compose.prod.yml logs -f

# Check resource usage
docker stats
```

---

## 🔐 Security Checklist for Deployment

Before deploying to production:

- [x] `.env` file created locally with real credentials
- [x] `.env` is in `.gitignore` and won't be committed
- [x] All environment variables exported
- [x] SSH connection tested with `check-connection.sh`
- [x] PEM file permissions: `chmod 400 your-key.pem`
- [x] Password-based sudo configured on EC2 (if needed)
- [x] SSL/TLS certificates obtained (Let's Encrypt recommended)
- [x] Domain DNS configured to point to EC2 instance
- [x] Security group allows SSH (port 22), HTTP (port 80), HTTPS (port 443)
- [x] Firewall rules configured on server
- [x] Database backups configured
- [x] Monitoring/alerts set up
- [x] Disaster recovery plan documented

---

## 🚨 Troubleshooting

### SSH Connection Refused

```bash
# Check EC2 security group
aws ec2 describe-security-groups --group-ids sg-xxxxx

# Verify PEM file permissions
ls -la your-key.pem
# Should show: -r--------

# Fix if needed:
chmod 400 your-key.pem

# Test SSH manually
ssh -v -i "your-key.pem" ubuntu@your-ec2-host.compute.amazonaws.com
```

### Port Already in Use

```bash
# SSH into server
ssh -i "$PEM_FILE" $EC2_USER@$EC2_HOST

# Check what's using port 3001
lsof -i :3001

# Kill process if needed
kill -9 <PID>

# Restart Docker containers
docker-compose -f docker-compose.prod.yml restart
```

### Database Connection Issues

```bash
# Check PostgreSQL service
ssh -i "$PEM_FILE" $EC2_USER@$EC2_HOST "docker ps | grep postgres"

# Check logs
docker logs amazon-fdc-tool_postgres_1

# Verify connection string in .env
echo $DATABASE_URL  # Should show correct DB URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Application Crashes

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs backend --tail=200

# Restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Check environment variables
cat /opt/amazon-fdc-tool/.env | head -20
```

---

## 📈 Maintenance & Updates

### Regular Updates

```bash
# Create a cron job for automated deployments:
ssh -i "$PEM_FILE" $EC2_USER@$EC2_HOST

# Edit crontab
crontab -e

# Add line to pull and restart daily at 2 AM:
0 2 * * * cd /opt/amazon-fdc-tool && git pull origin main && docker-compose -f docker-compose.prod.yml restart
```

### Database Backups

```bash
# Manual backup
docker exec amazon-fdc-tool_postgres_1 pg_dump -U amazon_fdc_user amazon_fdc_db > backup-$(date +%Y%m%d).sql

# Restore from backup
docker exec -i amazon-fdc-tool_postgres_1 psql -U amazon_fdc_user amazon_fdc_db < backup-20260212.sql
```

### Log Rotation

The Docker setup should handle log rotation automatically. To verify:

```bash
# Check Docker log driver
docker inspect amazon-fdc-tool_backend_1 | grep -A 5 LogConfig
```

---

## 🔐 Credential Management Best Practices

### For Local Development:
- Store `.env` file locally (in `.gitignore`)
- Store PEM file outside the repository
- Use local `.env` without committing

### For Production:
- Use AWS Secrets Manager for credentials
- Use GitHub Secrets for CI/CD deployments
- Rotate credentials regularly
- Monitor credential usage

### For Team Collaboration:
- Use 1Password, LastPass, or similar vault
- Share credentials through secure channels only
- Never share via Slack, email, or Discord
- Maintain audit logs of credential access

---

## 📞 Getting Help

- Check logs: `docker-compose logs backend`
- Review error messages carefully
- Check variable exports: `echo $EC2_HOST`
- Run pre-flight checks: `./check-connection.sh`
- Test SSH manually before running scripts

---

## 📝 Deployment Record

Keep track of deployments:

```bash
# Create deployment log
cat > ~/amazon-fdc-tool-deployments.log << EOF
Date: $(date)
EC2_HOST: $EC2_HOST
BRANCH: $BRANCH
Result: Success|Failed
Notes: Any special notes

EOF

# Check git log for code changes
git log --oneline -10
```

---

**Last Updated**: February 2026  

---

**Remember**: 
- ✅ Never commit `.env` files with real credentials
- ✅ Always use environment variables for sensitive data
- ✅ Keep deployment credentials in secure vaults
- ✅ Use `.env.example` as template for team members
- ✅ Regular security audits and credential rotation
