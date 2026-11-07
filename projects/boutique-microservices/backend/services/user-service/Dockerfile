# User Service Dockerfile
#
# Build context is backend/, not this directory, so that shared/ is visible.
# Dependencies install at /app rather than /app/services/user-service so that
# both the service and shared/ resolve node_modules by Node's upward lookup.
FROM node:20-alpine AS builder

WORKDIR /app

COPY services/user-service/package*.json ./
RUN npm install

COPY tsconfig.base.json ./
COPY shared/ ./shared/
COPY services/user-service/ ./services/user-service/

RUN npx tsc --project services/user-service

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY services/user-service/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/services/user-service/dist ./dist

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3006

CMD ["node", "dist/services/user-service/src/index.js"]
