# Domain & SSL Setup Guide

## 🎯 Overview

This guide will help you set up **app.sellerai.in** with **HTTPS/SSL** for the Amazon FDC Tool.

## ✅ Prerequisites

- [x] Domain `app.sellerai.in` is pointed to IP `13.204.41.42` (Verified ✅)
- [x] Server is accessible via SSH
- [x] Docker containers are running
- [ ] Port 80 and 443 are open in AWS Security Group
- [ ] Email for SSL certificate registration

## 🚀 Quick Setup

### Step 1: SSH to Server

```bash
ssh -i Rohan.pem ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com
```

### Step 2: Clone/Update Repository to v5 Branch

```bash
cd /opt/amazon-fdc-tool
sudo git fetch origin
sudo git checkout v5
sudo git pull origin v5
sudo chmod +x setup-ssl-domain.sh update-domain-config.sh
```

### Step 3: Open Required Ports in AWS Security Group

1. Go to AWS Console → EC2 → Security Groups
2. Find security group for your instance
3. Add inbound rules:
   - **HTTP**: Port 80, Source: 0.0.0.0/0
   - **HTTPS**: Port 443, Source: 0.0.0.0/0

### Step 4: Run SSL Setup Script

```bash
cd /opt/amazon-fdc-tool
sudo ./setup-ssl-domain.sh
```

This will:
- Install certbot and nginx
- Configure nginx for your domain
- Obtain SSL certificate from Let's Encrypt
- Set up auto-renewal
- Configure HTTPS redirect

### Step 5: Update Application Configuration

```bash
sudo ./update-domain-config.sh
```

This will:
- Update `.env.production` with HTTPS URLs
- Rebuild Docker containers
- Restart all services
- Verify deployment

### Step 6: Update Amazon Seller Central OAuth Settings

1. Go to: https://sellercentral.amazon.com/apps/manage
2. Select your application
3. Update OAuth Redirect URI to:
   ```
   https://app.sellerai.in/api/oauth/callback/sp-api
   ```
4. Save changes

### Step 7: Test Your Application

1. Open browser: https://app.sellerai.in
2. Verify SSL certificate is valid (green padlock)
3. Test login with Google OAuth
4. Test Amazon Seller Central connection

## 📋 Detailed Steps

### SSL Certificate Setup

The script will:

1. **Install Certbot**:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Configure Nginx**:
   - Sets up domain routing
   - Configures proxy to Docker containers
   - Adds security headers

3. **Obtain SSL Certificate**:
   ```bash
   sudo certbot --nginx -d app.sellerai.in
   ```

4. **Auto-Renewal**:
   - Certificate auto-renews before expiration
   - Certbot timer runs daily

### Nginx Configuration

The setup creates:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name app.sellerai.in;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name app.sellerai.in;
    
    ssl_certificate /etc/letsencrypt/live/app.sellerai.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.sellerai.in/privkey.pem;
    
    # Frontend
    location / {
        proxy_pass http://localhost:51439;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

### Environment Updates

The script updates `.env.production`:

```bash
# Before
FRONTEND_URL=http://13.204.41.42
BACKEND_URL=http://13.204.41.42:3001

# After
FRONTEND_URL=https://app.sellerai.in
BACKEND_URL=https://app.sellerai.in
```

## 🧪 Testing Checklist

After setup, verify:

- [ ] https://app.sellerai.in loads (no SSL warnings)
- [ ] http://app.sellerai.in redirects to HTTPS
- [ ] Login with Google OAuth works
- [ ] API calls work (check browser console)
- [ ] Amazon OAuth redirect works
- [ ] SSL certificate shows as valid
- [ ] All pages load without errors

## 🔒 Security Features

### SSL/TLS Configuration

- ✅ TLS 1.2 and 1.3 only
- ✅ Strong cipher suites
- ✅ HSTS enabled (Strict-Transport-Security)
- ✅ Auto-renewal enabled
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff

### OAuth Security

All OAuth callbacks now use HTTPS:
- Google: `https://app.sellerai.in/api/auth/google/callback`
- Amazon SP-API: `https://app.sellerai.in/api/oauth/callback/sp-api`

## 🛠️ Troubleshooting

### Issue: SSL Certificate Not Obtained

**Error**: `Certbot failed to obtain certificate`

**Causes**:
1. DNS not propagated yet
2. Port 80/443 not open
3. Nginx already running on port 80

**Fix**:
```bash
# Check DNS
dig app.sellerai.in

# Check if ports are open
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Stop nginx temporarily
sudo systemctl stop nginx

# Try certbot again
sudo certbot certonly --standalone -d app.sellerai.in

# Start nginx
sudo systemctl start nginx
```

### Issue: Port Already in Use

**Error**: `nginx: [emerg] bind() to 0.0.0.0:80 failed`

**Fix**:
```bash
# Find what's using port 80
sudo lsof -i :80

# If it's Apache
sudo systemctl stop apache2
sudo systemctl disable apache2

# Restart nginx
sudo systemctl restart nginx
```

### Issue: Domain Not Resolving

**Error**: DNS doesn't resolve to correct IP

**Fix**:
```bash
# Check DNS resolution
dig app.sellerai.in

# If wrong IP, update DNS records in your domain registrar
# Wait 5-60 minutes for propagation
```

### Issue: OAuth Redirect Not Working

**Error**: `redirect_uri_mismatch`

**Fix**:
1. Verify redirect URI in Amazon Seller Central exactly matches:
   ```
   https://app.sellerai.in/api/oauth/callback/sp-api
   ```
2. No trailing slash
3. Must be HTTPS
4. Exact domain match

### Issue: Mixed Content Errors

**Error**: Browser shows mixed content warnings

**Fix**:
- Verify all API calls use relative URLs (`/api/...`)
- Check `.env.production` has correct HTTPS URLs
- Rebuild frontend container:
  ```bash
  sudo docker-compose -f docker-compose.prod.yml --env-file .env.production build frontend
  sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d frontend
  ```

## 📊 Monitoring

### Check SSL Certificate Status

```bash
# View certificate details
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run

# Check certificate expiration
echo | openssl s_client -servername app.sellerai.in -connect app.sellerai.in:443 2>/dev/null | openssl x509 -noout -dates
```

### Check Nginx Status

```bash
# Status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### Check Docker Services

```bash
# Service status
sudo docker-compose -f docker-compose.prod.yml ps

# Backend logs
sudo docker logs -f amazon-fdc-backend

# Frontend logs
sudo docker logs -f amazon-fdc-frontend
```

## 🔄 SSL Certificate Renewal

Certificates auto-renew, but you can manually renew:

```bash
# Manual renewal
sudo certbot renew

# Force renewal (for testing)
sudo certbot renew --force-renewal

# Reload nginx after renewal
sudo systemctl reload nginx
```

## 📝 Configuration Files

### Location of Important Files

| File | Location |
|------|----------|
| Nginx config | `/etc/nginx/sites-available/amazon-fdc-tool` |
| SSL certificates | `/etc/letsencrypt/live/app.sellerai.in/` |
| Environment | `/opt/amazon-fdc-tool/.env.production` |
| Docker Compose | `/opt/amazon-fdc-tool/docker-compose.prod.yml` |

### Backup Important Files

```bash
# Backup SSL certificates
sudo tar -czf ssl-backup-$(date +%Y%m%d).tar.gz /etc/letsencrypt/

# Backup configuration
sudo cp /opt/amazon-fdc-tool/.env.production /opt/amazon-fdc-tool/.env.production.backup

# Backup nginx config
sudo cp /etc/nginx/sites-available/amazon-fdc-tool /etc/nginx/sites-available/amazon-fdc-tool.backup
```

## 🎯 Expected Results

After successful setup:

| URL | Result |
|-----|--------|
| http://app.sellerai.in | Redirects to HTTPS |
| https://app.sellerai.in | Shows app with valid SSL |
| https://app.sellerai.in/api/health | Returns "healthy" |
| https://app.sellerai.in/settings | OAuth settings page |

## 🔗 OAuth Redirect URIs

Update these in respective platforms:

### Google OAuth Console
```
https://app.sellerai.in/api/auth/google/callback
```

### Amazon Seller Central
```
https://app.sellerai.in/api/oauth/callback/sp-api
```

## 📚 Additional Resources

- Let's Encrypt Documentation: https://letsencrypt.org/docs/
- Certbot Documentation: https://certbot.eff.org/
- Nginx SSL Configuration: https://nginx.org/en/docs/http/configuring_https_servers.html

## 🆘 Getting Help

If you encounter issues:

1. Check logs:
   ```bash
   # Nginx errors
   sudo tail -f /var/log/nginx/error.log
   
   # Certbot logs
   sudo tail -f /var/log/letsencrypt/letsencrypt.log
   
   # Docker logs
   sudo docker logs amazon-fdc-backend
   ```

2. Verify DNS:
   ```bash
   dig app.sellerai.in
   ```

3. Test SSL:
   ```bash
   curl -I https://app.sellerai.in
   ```

4. Check firewall:
   ```bash
   sudo ufw status
   ```

## ✅ Post-Setup Checklist

- [ ] SSL certificate obtained and valid
- [ ] HTTPS redirect working (HTTP → HTTPS)
- [ ] Application loads at https://app.sellerai.in
- [ ] Google OAuth working with new domain
- [ ] Amazon OAuth redirect URI updated
- [ ] All API calls working
- [ ] No mixed content warnings
- [ ] Auto-renewal configured
- [ ] Backups created

---

**Domain**: app.sellerai.in  
**SSL Provider**: Let's Encrypt  
**Auto-Renewal**: Enabled  
**Certificate Validity**: 90 days (auto-renews at 60 days)
