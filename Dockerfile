# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files (package-lock.json may not exist — that's OK)
COPY package.json* package-lock.json* ./
# Use 'npm install' (not 'npm ci') so it works without a lockfile.
# Also install nodemailer (used for the email feature; not in package.json
# to avoid a next-auth peerOptional conflict).
RUN npm install --no-audit --no-fund --legacy-peer-deps
RUN npm install nodemailer@6 --no-audit --no-fund --legacy-peer-deps

# Copy source and build
COPY . .
RUN npx prisma generate
RUN npm run build

# ── Runtime stage ────────────────────────────────────────────
# Single-stage would be simpler but heavier. We use a full runtime stage
# so that 'npx prisma db push' and 'npm start' both work on Render.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy everything needed for runtime (package.json + node_modules for prisma/start)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/postcss.config.mjs ./
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/components.json ./

# Create directory for SQLite DB
RUN mkdir -p /app/db

EXPOSE 3000

# Default command — Render's startCommand overrides this if using render.yaml
CMD ["npm", "start"]
