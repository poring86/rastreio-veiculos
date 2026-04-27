FROM node:22.8.0-slim

WORKDIR /home/node/app

# Instala dependências
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta padrão do Next.js
EXPOSE 3000

# Comando padrão: desenvolvimento
CMD ["npm", "run", "dev"]
