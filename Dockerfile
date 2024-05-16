FROM node:20-buster-slim AS builder
WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

FROM node:20-buster-slim AS server

WORKDIR /app

COPY package* ./
COPY prisma ./prisma

RUN npm install --omit=dev
RUN apt-get update -y && apt-get install -y openssl
RUN npx prisma generate

COPY --from=builder ./app/dist ./dist
EXPOSE 3000

CMD ["npm", "run", "start:prod"]