#!/bin/bash
# Commands to run on production server to download enhanced UI

echo "Downloading enhanced UI files..."

# Create backup of current files
mkdir -p /var/www/html/backup-$(date +%Y%m%d_%H%M%S)
cp -r /var/www/html/* /var/www/html/backup-$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# Download new files
cd /tmp
wget -r -np -nH -nd http://172.17.0.3:8080/ -P enhanced-ui/
wget -r -np -nH -nd http://172.17.0.3:8080/assets/ -P enhanced-ui/assets/

# Copy to web directory
cp -r enhanced-ui/* /var/www/html/
chown -R www-data:www-data /var/www/html/
chmod -R 644 /var/www/html/*
chmod 755 /var/www/html/

# Restart nginx
systemctl reload nginx

echo "Enhanced UI deployment completed!"
