FROM node:22-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma/schema.prisma ./prisma/schema.prisma

RUN pnpm install --frozen-lockfile

COPY . .

ENV DATABASE_URL="file:/data/dev.db"
ENV PORT=3001

RUN pnpm prisma generate && pnpm build

EXPOSE 3001

CMD ["sh", "-c", "pnpm prisma migrate deploy && exec node dist/main"]
