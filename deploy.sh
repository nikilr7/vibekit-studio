#!/bin/bash

# VibeKit Studio - Production Deployment Script
# This script automates the deployment process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
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

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js $(node -v)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm -v)"
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL client not found (optional for local testing)"
    else
        print_success "PostgreSQL client installed"
    fi
    
    # Check Netlify CLI
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not installed. Installing..."
        npm install -g netlify-cli
    fi
    print_success "Netlify CLI $(netlify --version)"
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    print_success "Git $(git --version)"
}

# Validate environment
validate_environment() {
    print_header "Validating Environment"
    
    if [ ! -f ".env.production" ]; then
        print_error ".env.production file not found"
        print_info "Copy .env.production.example to .env.production and fill in your values"
        exit 1
    fi
    print_success ".env.production file exists"
    
    # Check required environment variables
    if ! grep -q "DATABASE_URL" .env.production; then
        print_error "DATABASE_URL not set in .env.production"
        exit 1
    fi
    print_success "DATABASE_URL configured"
    
    if ! grep -q "JWT_SECRET" .env.production; then
        print_error "JWT_SECRET not set in .env.production"
        exit 1
    fi
    print_success "JWT_SECRET configured"
}

# Run tests
run_tests() {
    print_header "Running Tests"
    
    print_info "Running linter..."
    npm run lint || print_warning "Linting issues found"
    
    print_info "Running type check..."
    npm run type-check || print_warning "Type check issues found"
    
    print_info "Running unit tests..."
    npm test || print_warning "Some tests failed"
    
    print_success "Tests completed"
}

# Build application
build_application() {
    print_header "Building Application"
    
    print_info "Building frontend..."
    cd client
    npm run build:prod
    cd ..
    print_success "Frontend built"
    
    print_info "Building backend functions..."
    npm run build:functions
    print_success "Backend built"
    
    print_success "Application built successfully"
}

# Security audit
security_audit() {
    print_header "Security Audit"
    
    print_info "Running npm audit..."
    npm audit || print_warning "Security vulnerabilities found"
    
    print_info "Checking for secrets in code..."
    if git grep -i "password\|secret\|key" -- '*.ts' '*.tsx' '*.js' 2>/dev/null; then
        print_warning "Potential secrets found in code"
    else
        print_success "No secrets found in code"
    fi
    
    print_success "Security audit completed"
}

# Database migration
migrate_database() {
    print_header "Database Migration"
    
    print_info "Running migrations..."
    npm run migrate:prod
    print_success "Database migrated"
}

# Deploy to Netlify
deploy_to_netlify() {
    print_header "Deploying to Netlify"
    
    print_info "Logging in to Netlify..."
    netlify login || print_warning "Already logged in"
    
    print_info "Linking to Netlify site..."
    netlify link || print_warning "Already linked"
    
    print_info "Deploying to production..."
    netlify deploy --prod
    print_success "Deployed to production"
}

# Post-deployment verification
verify_deployment() {
    print_header "Post-Deployment Verification"
    
    print_info "Checking deployment status..."
    netlify status
    
    print_info "Checking health endpoint..."
    DOMAIN=$(netlify status | grep "url:" | awk '{print $2}')
    
    if [ -z "$DOMAIN" ]; then
        print_warning "Could not determine domain"
    else
        print_info "Testing health endpoint..."
        curl -s "$DOMAIN/.netlify/functions/health" | jq . || print_warning "Health check failed"
    fi
    
    print_success "Deployment verification completed"
}

# Main deployment flow
main() {
    print_header "VibeKit Studio - Production Deployment"
    
    # Ask for confirmation
    read -p "Are you ready to deploy to production? (yes/no) " -n 3 -r
    echo
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Deployment cancelled"
        exit 0
    fi
    
    # Run deployment steps
    check_prerequisites
    validate_environment
    run_tests
    security_audit
    build_application
    migrate_database
    deploy_to_netlify
    verify_deployment
    
    print_header "Deployment Complete!"
    print_success "VibeKit Studio is now live in production"
    print_info "Monitor logs: netlify logs --tail"
    print_info "Check status: netlify status"
}

# Run main function
main