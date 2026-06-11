# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY backend/package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Instalar dumb-init para gerenciar processos
RUN apk add --no-cache dumb-init

# Copiar node_modules do builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar código da aplicação
COPY backend/src ./src
COPY frontend ./frontend
COPY backend/.env.example ./.env

# Criar diretório para dados
RUN mkdir -p /dados && chmod 777 /dados

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# User não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Usar dumb-init como entrypoint
ENTRYPOINT ["dumb-init", "--"]

# Iniciar aplicação
CMD ["node", "src/server.js"]