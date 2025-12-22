#!/bin/bash
set -e

# Install Node.js 18 using nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18.0.0
nvm use 18.0.0

# Verify Node.js version
echo "Using Node.js version: $(node -v)"

# Set corepack for Yarn
corepack enable
yarn set version 1.22.22

# Install dependencies
yarn install --frozen-lockfile
