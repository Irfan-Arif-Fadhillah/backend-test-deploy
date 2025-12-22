#!/bin/bash
# Exit on error
set -e

# Ensure we're using Node.js 18
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18.0.0
nvm use 18.0.0

# Install dependencies
yarn install --frozen-lockfile

# Build the application (if needed)
# yarn build
