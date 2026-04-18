#!/bin/bash
# ============================================================
# PADEL CLUB STARTER — Setup Script
# ============================================================
# Usage: bash scripts/setup.sh

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}"
echo "  ╔══════════════════════════════════╗"
echo "  ║  PADEL CLUB STARTER — SETUP      ║"
echo "  ╚══════════════════════════════════╝"
echo -e "${NC}"

# 1. Check Node.js
echo -e "${CYAN}▸ Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js 18+ required. Found: $(node --version)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# 2. Install dependencies
echo -e "${CYAN}▸ Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# 3. Copy .env
echo -e "${CYAN}▸ Setting up environment...${NC}"
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${YELLOW}⚠ .env.local created. Please fill in your credentials.${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

# 4. Check Supabase CLI
echo -e "${CYAN}▸ Checking Supabase CLI...${NC}"
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✓ Supabase CLI found${NC}"
else
    echo -e "${YELLOW}⚠ Supabase CLI not found. Install with: npm install -g supabase${NC}"
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Setup complete!                     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "Next steps:"
echo -e "  1. Edit ${YELLOW}.env.local${NC} with your Supabase credentials"
echo -e "  2. Edit ${YELLOW}config/brand.ts${NC} with client information"
echo -e "  3. Run ${YELLOW}supabase db push${NC} to apply database schema"
echo -e "  4. Run ${YELLOW}npm run dev${NC} to start development server"
echo ""
