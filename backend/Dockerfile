FROM node:alpine AS base

# Set working directory
WORKDIR /app

# Install bun globally
RUN npm install -g bun

# Copy package files first (for better caching)
COPY package.json bun.lock ./

# Install dependencies (include dev for build)
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build TypeScript → dist/
RUN bun run build


# 2️⃣ Runtime image
FROM node:alpine AS prod

WORKDIR /app

# Install bun again (runtime environment)
RUN npm install -g bun

# Create the appuser BEFORE chown
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only what’s needed from builder
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/bun.lock ./bun.lock
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/migrate.cjs ./migrate.cjs
COPY --from=base /app/migrations ./migrations



# # Ensure /app/public always exists (even if missing in source)
# RUN mkdir -p /app/public

# Copy only if it exists — this works safely if it does
COPY --from=base /app/public ./public

# Copy the rest of the source code
COPY . .

# Make sure upload temp dir exists & has right permissions
RUN mkdir -p /app/public/temp && chown -R appuser:appgroup /app/public


# COPY --from=base /app/.env ./.env

# Expose your Express port
EXPOSE 8080

# Use a non-root user (recommended)
USER appuser

# Start the app
# CMD ["bun", "start"]
CMD ["sh", "-c", "bun run migrate && bun start"]

