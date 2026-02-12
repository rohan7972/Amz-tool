#!/bin/bash

# Amazon FDC Tool - Docker Production Deployment Script
# This script deploys the application to a VPS server using Docker

set -e

echo "🚀 Amazon FDC Tool - Docker Production Deployment"
echo "================================================="

# Configuration
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="backups"
LOG_FILE="deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a $LOG_FILE
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
    fi
}

# Install Docker and Docker Compose if not present
install_docker() {
    if ! command -v docker &> /dev/null; then
        log "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        log "Docker installed ✅"
    else
        log "Docker already installed ✅"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log "Installing Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        log "Docker Compose installed ✅"
    else
        log "Docker Compose already installed ✅"
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        install_docker
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        install_docker
    fi
    
    # Check if environment file exists
    if [[ ! -f $ENV_FILE ]]; then
        warning "Environment file $ENV_FILE not found. Creating from template..."
        cp .env.production.template $ENV_FILE 2>/dev/null || {
            error "Environment template not found. Please create $ENV_FILE manually."
        }
    fi
    
    # Check if docker-compose file exists
    if [[ ! -f $DOCKER_COMPOSE_FILE ]]; then
        error "Docker Compose file $DOCKER_COMPOSE_FILE not found."
    fi
    
    log "Prerequisites check passed ✅"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    mkdir -p $BACKUP_DIR
    mkdir -p logs
    mkdir -p data/postgres
    mkdir -p data/redis
    
    log "Directories created ✅"
}

# Backup existing data
backup_data() {
    if docker-compose -f $DOCKER_COMPOSE_FILE ps | grep -q "Up"; then
        log "Creating backup of existing data..."
        
        BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"
        
        # Backup PostgreSQL database
        docker-compose -f $DOCKER_COMPOSE_FILE exec -T postgres pg_dump -U amazon_fdc_user amazon_fdc_db > $BACKUP_FILE
        
        if [[ $? -eq 0 ]]; then
            log "Database backup created: $BACKUP_FILE ✅"
        else
            warning "Database backup failed, but continuing deployment"
        fi
    else
        info "No existing containers found, skipping backup"
    fi
}

# Build and deploy
deploy() {
    log "Starting deployment..."
    
    # Pull latest images and build
    log "Building Docker images..."
    docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose -f $DOCKER_COMPOSE_FILE down
    
    # Start new containers
    log "Starting new containers..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
    
    log "Deployment completed ✅"
}

# Health check
health_check() {
    log "Performing health checks..."
    
    # Wait for services to start
    sleep 30
    
    # Check if all containers are running
    if docker-compose -f $DOCKER_COMPOSE_FILE ps | grep -q "Exit"; then
        error "Some containers failed to start. Check logs with: docker-compose -f $DOCKER_COMPOSE_FILE logs"
    fi
    
    # Check backend health
    if curl -f http://localhost/api/health &> /dev/null; then
        log "Backend health check passed ✅"
    else
        error "Backend health check failed"
    fi
    
    # Check frontend
    if curl -f http://localhost &> /dev/null; then
        log "Frontend health check passed ✅"
    else
        error "Frontend health check failed"
    fi
    
    log "All health checks passed ✅"
}

# Show deployment info
show_info() {
    log "Deployment Information:"
    echo "======================="
    echo "Application URL: http://localhost (or your domain)"
    echo "API URL: http://localhost/api"
    echo "Health Check: http://localhost/api/health"
    echo ""
    echo "Container Status:"
    docker-compose -f $DOCKER_COMPOSE_FILE ps
    echo ""
    echo "To view logs: docker-compose -f $DOCKER_COMPOSE_FILE logs -f"
    echo "To stop: docker-compose -f $DOCKER_COMPOSE_FILE down"
    echo "To restart: docker-compose -f $DOCKER_COMPOSE_FILE restart"
}

# Cleanup old images
cleanup() {
    log "Cleaning up old Docker images..."
    docker image prune -f
    log "Cleanup completed ✅"
}

# Main deployment function
main() {
    log "Starting Amazon FDC Tool deployment..."
    
    check_root
    check_prerequisites
    create_directories
    backup_data
    deploy
    health_check
    cleanup
    show_info
    
    log "🎉 Deployment completed successfully!"
    log "Your Amazon FDC Tool is now running at http://localhost"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "stop")
        log "Stopping Amazon FDC Tool..."
        docker-compose -f $DOCKER_COMPOSE_FILE down
        log "Application stopped ✅"
        ;;
    "restart")
        log "Restarting Amazon FDC Tool..."
        docker-compose -f $DOCKER_COMPOSE_FILE restart
        log "Application restarted ✅"
        ;;
    "logs")
        docker-compose -f $DOCKER_COMPOSE_FILE logs -f
        ;;
    "status")
        docker-compose -f $DOCKER_COMPOSE_FILE ps
        ;;
    "backup")
        backup_data
        ;;
    "health")
        health_check
        ;;
    *)
        echo "Usage: $0 {deploy|stop|restart|logs|status|backup|health}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Deploy the application (default)"
        echo "  stop    - Stop all containers"
        echo "  restart - Restart all containers"
        echo "  logs    - Show container logs"
        echo "  status  - Show container status"
        echo "  backup  - Create database backup"
        echo "  health  - Run health checks"
        exit 1
        ;;
esac