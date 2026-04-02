FROM node:22.13.1-slim

RUN apt update && \
  apt install openssl procps -y && \
  npm install -g @nestjs/cli@10.4.8

USER node

WORKDIR /home/node/app

CMD bash -c "npm install && npx prisma@6.0.1 generate && npm run start:dev"