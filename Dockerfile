# ─────────────────────────────────────────────────────────────
# Stage 1: Dependencies
# Install production and dev dependencies in isolation
# ─────────────────────────────────────────────────────────────
FROM node:22-slim AS deps

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci

# ─────────────────────────────────────────────────────────────
# Stage 2: Builder
# Compile TypeScript and generate Prisma Client
# ─────────────────────────────────────────────────────────────
FROM node:22-slim AS builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 3: Production
# Minimal image — only compiled output and production deps
# ─────────────────────────────────────────────────────────────
FROM node:22-slim AS production

LABEL org.opencontainers.image.title="NestJS Tasks API"
LABEL org.opencontainers.image.description="Task management REST API built with NestJS and Prisma"
LABEL org.opencontainers.image.source="https://github.com/estebanlizama/nestjs-backend-test"

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled app and Prisma artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Run as non-root user for security
USER node

EXPOSE 3001

ENTRYPOINT ["node", "dist/main"]
