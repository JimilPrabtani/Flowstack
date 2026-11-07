# Product Service Dockerfile
#
# Build context is backend/, matching the other services, so tsconfig.base.json
# is reachable. Unlike them this one does not copy shared/ — it imports nothing
# from it — so its output stays flat at dist/index.js.
FROM node:20-alpine AS builder

WORKDIR /app

COPY services/product-service/package*.json ./
RUN npm install

COPY tsconfig.base.json ./
COPY services/product-service/ ./services/product-service/

RUN npx tsc --project services/product-service

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY services/product-service/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/services/product-service/dist ./dist

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3003

CMD ["node", "dist/index.js"]
