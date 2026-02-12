#!/bin/bash

# SSL and Domain Setup Script
# Sets up app.sellerai.in with Let's Encrypt SSL certificate

set -e

DOMAIN="app.sellerai.in"
EMAIL="admin@sellerai.in"  # Change this to your actual email
SERVER_IP="13.204.41.42"

echo "================================================"
echo "  SSL Setup for Amazon FDC Tool"
echo "  Domain: $DOMAIN"
echo "================================================"
echo ""

echo "✅ Step 1: Verifying DNS configuration..."
RESOLVED_IP=$(getent hosts $DOMAIN | awk '{ print $1 }')
if [ "$RESOLVED_IP" == "$SERVER_IP" ]; then
    echo "✅ DNS correctly points to $SERVER_IP"
else
    echo "⚠️  Warning: DNS points to $RESOLVED_IP, expected $SERVER_IP"
    echo "Please wait for DNS propagation or check your DNS settings"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📦 Step 2: Installing certbot and nginx..."
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

echo ""
echo "🔧 Step 3: Creating temporary nginx configuration..."
sudo tee /etc/nginx/sites-available/amazon-fdc-tool > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name app.sellerai.in;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://localhost:51439;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

echo "🔗 Step 4: Enabling site configuration..."
sudo ln -sf /etc/nginx/sites-available/amazon-fdc-tool /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo "✅ Step 5: Testing nginx configuration..."
sudo nginx -t

echo "🔄 Step 6: Restarting nginx..."
sudo systemctl restart nginx

echo ""
echo "🔐 Step 7: Obtaining SSL certificate from Let's Encrypt..."
echo "This will request a certificate for $DOMAIN"
echo ""

sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

echo ""
echo "✅ SSL certificate obtained successfully!"
echo ""

echo "🔧 Step 8: Updating nginx configuration with full settings..."
sudo tee /etc/nginx/sites-available/amazon-fdc-tool > /dev/null <<'EOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name app.sellerai.in;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.sellerai.in;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/app.sellerai.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.sellerai.in/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # SSL Session Cache
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Frontend (React App)
    location / {
        proxy_pass http://localhost:51439;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Proxy to Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

echo "✅ Step 9: Testing nginx configuration..."
sudo nginx -t

echo "🔄 Step 10: Reloading nginx..."
sudo systemctl reload nginx

echo ""
echo "🔧 Step 11: Setting up auto-renewal for SSL certificate..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "✅ Step 12: Testing SSL certificate auto-renewal..."
sudo certbot renew --dry-run

echo ""
echo "================================================"
echo "  ✅ SSL Setup Complete!"
echo "================================================"
echo ""
echo "📋 Summary:"
echo "  Domain: https://$DOMAIN"
echo "  SSL Certificate: Valid (Let's Encrypt)"
echo "  Auto-Renewal: Enabled"
echo ""
echo "🔐 SSL Certificate Info:"
sudo certbot certificates
echo ""
echo "⚠️  IMPORTANT: Update environment variables!"
echo ""
echo "Next steps:"
echo "1. Update .env.production with new domain"
echo "2. Update OAuth redirect URIs in Amazon Seller Central"
echo "3. Rebuild and restart Docker containers"
echo ""
echo "Run: ./update-domain-config.sh"
echo ""
