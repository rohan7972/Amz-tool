#!/bin/bash

###############################################################################
# Amazon FDC Tool - EC2 Deployment Script
# 
# This script automates the deployment of Amazon FDC Tool to EC2
# 
# Usage: ./deploy-to-ec2.sh
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
# IMPORTANT: Update these values before running this script
# EC2_HOST should be your actual EC2 instance hostname
# EC2_IP should be your actual EC2 instance IP
# PEM_FILE should be the path to your EC2 key pair file
EC2_HOST="${EC2_HOST:-your-ec2-host.compute.amazonaws.com}"
EC2_USER="${EC2_USER:-ubuntu}"
EC2_IP="${EC2_IP:-xxx.xxx.xxx.xxx}"
PEM_FILE="${PEM_FILE:-./path/to/your-key.pem}"
APP_DIR="${APP_DIR:-/opt/amazon-fdc-tool}"
REPO_URL="${REPO_URL:-https://github.com/your-org/Amazon-FDC-Tool.git}"
BRANCH="${BRANCH:-main}"

# Functions
print_header() {
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check if PEM file exists
    if [ ! -f "$PEM_FILE" ]; then
        print_error "PEM file not found: $PEM_FILE"
        exit 1
    fi
    print_success "PEM file found: $PEM_FILE"
    
    # Check PEM file permissions
    PERMS=$(stat -c %a "$PEM_FILE" 2>/dev/null || stat -f %A "$PEM_FILE")
    if [ "$PERMS" != "400" ]; then
        print_warning "Fixing PEM file permissions..."
        chmod 400 "$PEM_FILE"
        print_success "PEM file permissions set to 400"
    fi
    
    # Test SSH connection
    print_info "Testing SSH connection..."
    if ssh -i "$PEM_FILE" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "echo 'Connection successful'" > /dev/null 2>&1; then
        print_success "SSH connection successful"
    else
        print_error "Cannot connect to EC2 server"
        exit 1
    fi
}

install_dependencies() {
    print_header "Installing Server Dependencies"
    
    ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" << 'ENDSSH'
        set -e
        
        echo "Updating system packages..."
        sudo apt update
        
        echo "Checking Docker installation..."
        if ! command -v docker &> /dev/null; then
            echo "Installing Docker..."
            curl -fsSL https://get.docker.com -o get-docker.sh
            sudo sh get-docker.sh
            sudo usermod -aG docker ubuntu
            rm get-docker.sh
            echo "Docker installed successfully"
        else
            echo "Docker is already installed"
        fi
        
        echo "Checking Docker Compose installation..."
        if ! command -v docker-compose &> /dev/null; then
            echo "Installing Docker Compose..."
            sudo apt install -y docker-compose
            echo "Docker Compose installed successfully"
        else
            echo "Docker Compose is already installed"
        fi
        
        echo "Checking Git installation..."
        if ! command -v git &> /dev/null; then
            echo "Installing Git..."
            sudo apt install -y git
            echo "Git installed successfully"
        else
            echo "Git is already installed"
        fi
        
        echo "Installing additional utilities..."
        sudo apt install -y curl wget htop vim
        
        echo "Versions:"
        docker --version
        docker-compose --version
        git --version
ENDSSH
    
    print_success "Dependencies installed"
}

setup_application() {
    print_header "Setting Up Application"
    
    ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" << ENDSSH
        set -e
        
        # Create application directory
        echo "Creating application directory..."
        sudo mkdir -p $APP_DIR
        sudo chown ubuntu:ubuntu $APP_DIR
        
        # Clone or update repository
        if [ -d "$APP_DIR/.git" ]; then
            echo "Repository exists, pulling latest changes..."
            cd $APP_DIR
            git fetch origin
            git checkout $BRANCH
            git pull origin $BRANCH
        else
            echo "Cloning repository..."
            git clone -b $BRANCH $REPO_URL $APP_DIR
            cd $APP_DIR
        fi
        
        echo "Application setup complete"
ENDSSH
    
    print_success "Application set up"
}

configure_environment() {
    print_header "Configuring Environment"
    
    print_info "Generating secure passwords..."
    DB_PASSWORD=$(openssl rand -base64 32)
    REDIS_PASSWORD=$(openssl rand -base64 32)
    JWT_SECRET=$(openssl rand -base64 48)
    JWT_REFRESH_SECRET=$(openssl rand -base64 48)
    
    print_info "Creating .env file..."
    
    cat > .env.production << EOF
# Database Configuration
DB_USER=amazon_fdc_user
DB_PASSWORD=$DB_PASSWORD
POSTGRES_PASSWORD=$DB_PASSWORD

# Redis Configuration
REDIS_PASSWORD=$REDIS_PASSWORD

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET

# Amazon API Configuration (Update with your credentials)
AMAZON_CLIENT_ID=your_amazon_client_id
AMAZON_CLIENT_SECRET=your_amazon_client_secret
AMAZON_ADVERTISING_CLIENT_ID=your_ad_client_id
AMAZON_ADVERTISING_CLIENT_SECRET=your_ad_client_secret

# Application URLs
REACT_APP_API_URL=http://$EC2_IP:3001
EOF
    
    # Copy .env file to server
    scp -i "$PEM_FILE" .env.production "$EC2_USER@$EC2_HOST:$APP_DIR/.env"
    
    # Create nginx configuration
    print_info "Creating Nginx configuration..."
    
    cat > nginx.conf << 'EOF'
upstream frontend {
    server frontend:80;
}

upstream backend {
    server backend:3001;
}

server {
    listen 80;
    server_name _;
    
    client_max_body_size 10M;
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://backend;
        access_log off;
    }
}
EOF
    
    ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" "mkdir -p $APP_DIR/nginx"
    scp -i "$PEM_FILE" nginx.conf "$EC2_USER@$EC2_HOST:$APP_DIR/nginx/nginx.conf"
    
    # Create backend .env
    ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" << ENDSSH
        cd $APP_DIR
        
        # Backend .env
        cat > backend/.env << 'BACKENDENV'
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://$EC2_IP

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=amazon_fdc_tool
DB_USER=amazon_fdc_user
DB_PASSWORD=$DB_PASSWORD

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=$REDIS_PASSWORD

# JWT
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Amazon API (Sandbox mode)
AMAZON_SANDBOX_MODE=true
AMAZON_AUTH_URL=https://api.amazon.com/auth/o2/token
AMAZON_API_URL=https://advertising-api.amazon.com
BACKENDENV

        # Frontend .env
        cat > frontend/.env << 'FRONTENDENV'
VITE_API_URL=http://$EC2_IP:3001
FRONTENDENV
        
        chmod 600 .env backend/.env frontend/.env
ENDSSH
    
    print_success "Environment configured"
    print_warning "Generated passwords saved in .env.production (keep this file secure!)"
}

deploy_application() {
    print_header "Deploying Application"
    
    ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" << ENDSSH
        set -e
        cd $APP_DIR
        
        echo "Stopping existing containers..."
        docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
        
        echo "Building Docker images..."
        docker-compose -f docker-compose.prod.yml build
        
        echo "Starting services..."
        docker-compose -f docker-compose.prod.yml up -d
        
        echo "Waiting for services to start..."
        sleep 15
        
        echo "Running database migrations..."
        docker-compose -f docker-compose.prod.yml exec -T backend npm run migrate 2>/dev/null || echo "Migration skipped or already run"
        
        echo "Deployment complete!"
ENDSSH
    
    print_success "Application deployed"
}

verify_deployment() {
    print_header "Verifying Deployment"
    
    print_info "Checking container status..."
    ssh -i "$PEM_FILE" "$EC2_USER@$EC2_HOST" "cd $APP_DIR && docker-compose -f docker-compose.prod.yml ps"
    
    print_info "Checking backend health..."
    sleep 5
    if curl -s "http://$EC2_IP:3001/health" > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_warning "Backend health check failed (may still be starting)"
    fi
    
    print_info "Checking frontend..."
    if curl -s "http://$EC2_IP" > /dev/null 2>&1; then
        print_success "Frontend is accessible"
    else
        print_warning "Frontend not accessible yet (may still be building)"
    fi
    
    print_success "Verification complete"
}

show_summary() {
    print_header "Deployment Summary"
    
    echo ""
    print_success "Deployment completed successfully!"
    echo ""
    echo -e "${GREEN}Application URLs:${NC}"
    echo -e "  Frontend: ${BLUE}http://$EC2_IP${NC}"
    echo -e "  Backend:  ${BLUE}http://$EC2_IP:3001${NC}"
    echo -e "  Health:   ${BLUE}http://$EC2_IP:3001/health${NC}"
    echo ""
    echo -e "${YELLOW}Important Files:${NC}"
    echo -e "  Environment: ${BLUE}.env.production${NC} (saved locally - keep secure!)"
    echo -e "  Server Path: ${BLUE}$APP_DIR${NC}"
    echo ""
    echo -e "${YELLOW}Useful Commands:${NC}"
    echo -e "  View logs:    ${BLUE}ssh -i $PEM_FILE $EC2_USER@$EC2_HOST 'cd $APP_DIR && docker-compose -f docker-compose.prod.yml logs -f'${NC}"
    echo -e "  Restart:      ${BLUE}ssh -i $PEM_FILE $EC2_USER@$EC2_HOST 'cd $APP_DIR && docker-compose -f docker-compose.prod.yml restart'${NC}"
    echo -e "  Stop:         ${BLUE}ssh -i $PEM_FILE $EC2_USER@$EC2_HOST 'cd $APP_DIR && docker-compose -f docker-compose.prod.yml down'${NC}"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "  1. Update Amazon API credentials in .env file on server"
    echo "  2. Set up SSL certificate with Let's Encrypt (optional)"
    echo "  3. Configure AWS Security Group firewall rules"
    echo "  4. Set up monitoring and backups"
    echo "  5. Test all functionality"
    echo ""
}

# Main execution
main() {
    clear
    print_header "Amazon FDC Tool - EC2 Deployment"
    echo ""
    
    print_info "Target: $EC2_HOST ($EC2_IP)"
    print_info "Branch: $BRANCH"
    echo ""
    
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled"
        exit 0
    fi
    
    check_prerequisites
    install_dependencies
    setup_application
    configure_environment
    deploy_application
    verify_deployment
    show_summary
}

# Run main function
main
