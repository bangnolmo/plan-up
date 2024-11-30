FROM node:18-alpine AS builder

WORKDIR /app

# COPY .env .env

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN npm install --production

ENV NODE_ENV=production

CMD ["npm", "start"]