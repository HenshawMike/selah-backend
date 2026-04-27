# Use Node 20 as the base image
FROM node:20-slim AS base

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the TypeScript application
RUN pnpm build

# --- Production Stage ---
FROM node:20-slim AS release

WORKDIR /app

# Copy built files and necessary production dependencies
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules

# Set environment to production
ENV NODE_ENV=production

# Expose the port (Render will override this, but good for documentation)
EXPOSE 5000

# Start the application
CMD ["node", "dist/server.js"]
