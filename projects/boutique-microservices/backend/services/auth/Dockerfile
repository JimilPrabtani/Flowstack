# Auth Service Dockerfile
#
# Build context is backend/, not this directory, so that shared/ is visible.
# Dependencies install at /app rather than /app/services/auth so that both the
# service and shared/ resolve node_modules by Node's normal upward lookup.
FROM node:20-alpine AS builder

WORKDIR /app

COPY services/auth/package*.json ./
RUN npm install

COPY tsconfig.base.json ./
COPY shared/ ./shared/
COPY services/auth/ ./services/auth/

RUN npx tsc --project services/auth

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY services/auth/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/services/auth/dist ./dist

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3002

CMD ["node", "dist/services/auth/src/index.js"]
