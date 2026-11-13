FROM node:20-alpine
WORKDIR /app

# Install OpenSSL for Prisma engine detection on Alpine
RUN apk add --no-cache openssl

# Copy backend package files and prisma schema
# (prisma must be copied before npm ci so postinstall: prisma generate can find schema)
COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm ci

# Copy the rest of the backend source and compile TypeScript
COPY backend/ .
RUN npm run build

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["npm", "start"]
