# Use Node.js 18
FROM node:18.20.2-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN corepack enable && \
    yarn set version 1.22.22 && \
    yarn install --frozen-lockfile

# Copy application code
COPY . .

# Build the application (if needed)
# RUN yarn build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]