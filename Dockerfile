FROM node:23-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY nest-cli.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:23-slim AS production

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./

RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main"]
