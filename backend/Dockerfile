FROM node:20-alpine
WORKDIR /app

# Install dependencies and copy schema
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["npm", "start"]
