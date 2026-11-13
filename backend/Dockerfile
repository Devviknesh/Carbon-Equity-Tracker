FROM node:20-alpine
WORKDIR /app

# Install OpenSSL (required by Prisma engine detection on Alpine)
RUN apk add --no-cache openssl

# Copy package files and prisma schema (needed for postinstall: prisma generate)
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Copy source and build TypeScript
COPY . .
RUN npm run build

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["npm", "start"]
