# ========================================================
# ESTÁGIO 1: Build (Compilação do TypeScript)
# ========================================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia arquivos de definição de pacotes
COPY package*.json ./
COPY prisma ./prisma/

# Instala TODAS as dependências (incluindo as devDependencies necessárias para o build)
RUN npm ci

# Copia o restante do código fonte e o arquivo de configuração do TS
COPY tsconfig.json ./
COPY src ./src

# Gera o Prisma Client e compila o TypeScript para JavaScript puro (dist/)
RUN npm run prisma:generate
RUN npm run build

# Remove as devDependencies para poupar espaço antes de preparar a imagem final
RUN npm prune --production

# ========================================================
# ESTÁGIO 2: Runner (Imagem de Execução Leve)
# ========================================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copia apenas o necessário do estágio de build
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Expõe a porta padrão configurada
EXPOSE 3000

# Executa a aplicação usando Node.js nativo (sem ts-node-dev ou typescript em runtime)
CMD ["node", "dist/server.js"]