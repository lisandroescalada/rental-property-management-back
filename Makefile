# Makefile: tareas comunes para el entorno Docker
# Uso: make <target>

SHELL := /bin/bash
ENV_FILE := .env
COMPOSE := docker compose

# docker compose exec → service name  (key in docker-compose.yml services:)
# docker exec         → container name (container_name in docker-compose.yml)
APP_SERVICE   := app         # ← used with: $(COMPOSE) exec $(APP_SERVICE) ...
APP_CONTAINER := app-nestjs  # ← used with: docker exec $(APP_CONTAINER) ...

DB_USER := $(shell grep -E '^MYSQL_USER=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)
DB_PASS := $(shell grep -E '^MYSQL_PASSWORD=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)
DB_NAME := $(shell grep -E '^MYSQL_DATABASE=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)

.PHONY: help ssl up up-dev down restart rebuild rebuild-dev logs logs-service ps status validate \
        migrate mysql-migrate sql-import db-backup exec shell \
        nest-install nest-dev nest-build nest-start nest-test nest-test-watch nest-test-cov nest-lint \
        nest-migration-create nest-migration-generate nest-migration-run nest-migration-revert \
        nest-seed nest-clean nest-full-setup \
        dev build start test lint clean install


# Levantar servicios Docker (producción: MySQL + phpMyAdmin + Nginx + app)
up:
	@echo "⬆️ Levantando servicios..."
	@$(COMPOSE) up -d

up-dev:
	@echo "⬆️ Levantando infraestructura + app en modo desarrollo..."
	@$(COMPOSE) --profile dev up -d mysql phpmyadmin app-dev
	@echo "✅ MySQL en :3306 | phpMyAdmin en :8080 | NestJS dev en :3000"
	@echo "📋 Logs: make logs-service SERVICE=app-nestjs-dev"

# Parar servicios
down:
	@echo "⬇️ Parando servicios..."
	@$(COMPOSE) down

# Reiniciar
restart:
	@echo "🔄 Reiniciando servicios..."
	@$(COMPOSE) restart

# Reconstruir + levantar
rebuild:
	@echo "🔨 Reconstruyendo imágenes y levantando servicios..."
	@$(COMPOSE) up -d --build

# Reconstruir solo la imagen de desarrollo
rebuild-dev:
	@echo "🔨 Reconstruyendo imagen de desarrollo..."
	@$(COMPOSE) --profile dev build app-dev
	@$(COMPOSE) --profile dev up -d app-dev

# Ejecutar un comando puntual dentro del contenedor app (producción)
# Uso: make exec CMD="npm run migration:run"
exec:
	@if [ -z "$(CMD)" ]; then echo "❌ ERROR: especifica CMD=\"<comando>\""; exit 1; fi
	@$(COMPOSE) exec $(APP_SERVICE) sh -c "$(CMD)"

# Abrir una shell interactiva dentro del contenedor app
shell:
	@echo "🐚 Abriendo shell en $(APP_SERVICE)..."
	@$(COMPOSE) exec $(APP_SERVICE) sh

# Logs
logs:
	@$(COMPOSE) logs -f

logs-service:
	@if [ -z "$(SERVICE)" ]; then echo "ERROR: especifica SERVICE=<name>"; exit 1; fi
	@$(COMPOSE) logs -f $(SERVICE)

# Estado
ps:
	@$(COMPOSE) ps

status: ps

# Validación (si existe script)
validate:
	@if [ -f docker/validate.sh ]; then bash docker/validate.sh; else echo "No existe docker/validate.sh"; fi

# Ejecutar todos los .sql dentro de docker/sql/ (orden natural) con comprobación previa
mysql-migrate:
	@echo "🗄️  Preparando para aplicar scripts SQL desde docker/sql/"
	@if ! ls docker/sql/*.sql >/dev/null 2>&1; then \
		echo "No se encontraron archivos .sql en docker/sql/"; exit 1; \
	fi
	@echo "Comprobando si la base de datos ya contiene tablas..."
	@COUNT=`$(COMPOSE) exec -T mysql sh -c "mysql -u '$(DB_USER)' -p'$(DB_PASS)' -sN -e \"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$(DB_NAME)';\""` || COUNT=0; \
	if [ "$$COUNT" -gt 0 ] && [ "$(FORCE)" != "1" ]; then \
		echo "ADVERTENCIA: la base de datos '$(DB_NAME)' ya contiene $$COUNT tablas."; \
		echo "Si quieres forzar la reaplicación de los scripts SQL ejecuta: make mysql-migrate FORCE=1"; \
		exit 0; \
	fi; \
	for f in docker/sql/*.sql; do \
		echo " -> aplicando $$f"; \
		$(COMPOSE) exec -T mysql sh -c "mysql -u '$(DB_USER)' -p'$(DB_PASS)' '$(DB_NAME)'" < $$f || { echo "ERROR al aplicar $$f"; exit 2; }; \
	done; \
	echo "✅ Todos los scripts en docker/sql/ aplicados."

# Migraciones: prioriza scripts SQL en docker/sql/, después detecta Prisma/TypeORM/npm
migrate: mysql-migrate
	@echo "Nota: si necesitas ejecutar migraciones desde la app, usa los objetivos específicos (prisma/typeorm/npm) o make migrate-app"

# Importar SQL desde host
sql-import:
	@if [ -z "$(FILE)" ]; then echo "ERROR: especifica FILE=path.sql"; exit 1; fi
	@echo "Importando $(FILE) a la base de datos..."
	@$(COMPOSE) exec -T mysql sh -c 'mysql -u "${DB_USER}" -p"${DB_PASS}" "${DB_NAME}"' < $(FILE)

# Backup de la base de datos
db-backup:
	@mkdir -p backups
	@TS=$$(date +%Y%m%d_%H%M%S) ; \
	echo "Haciendo dump de ${DB_NAME} en backups/backup_$${TS}.sql" ; \
	$(COMPOSE) exec -T mysql sh -c 'exec mysqldump -u "${DB_USER}" -p"${DB_PASS}" "${DB_NAME}"' > backups/backup_$${TS}.sql

# ============================================================================
# 🚀 NestJS — all commands run INSIDE the Docker container via compose exec
# $(APP_SERVICE) = compose service name ("app")  → docker compose exec $(APP_SERVICE)
# $(APP_CONTAINER) = container name ("app-nestjs") → only for docker exec (non-compose)
# To run locally without Docker use npm scripts directly: npm run <script>
# ============================================================================

# ── Aliases ─────────────────────────────────────────────────────────────────
install: nest-install
dev:     up-dev
build:   nest-build
test:    nest-test
lint:    nest-lint
clean:   nest-clean

start:
	@echo "▶️  Service '$(APP_SERVICE)' (container: $(APP_CONTAINER)) runs 'node dist/main' on startup."
	@echo "     To restart it: make restart"

# ── Dependencies ─────────────────────────────────────────────────────────────
nest-install:
	@echo "📦 Installing dependencies inside the container..."
	@$(COMPOSE) exec $(APP_SERVICE) npm install --legacy-peer-deps

# ── Development (hot-reload via app-dev container) ───────────────────────────
nest-dev: up-dev
	@echo "🚀 NestJS running in development mode."
	@echo "📋 Live logs: make logs-service SERVICE=app-nestjs-dev"

# ── Build ────────────────────────────────────────────────────────────────────
nest-build:
	@echo "🔨 Building NestJS inside the container..."
	@$(COMPOSE) exec $(APP_SERVICE) npm run build
	@echo "✅ Build complete — output in dist/"

# ── Tests ────────────────────────────────────────────────────────────────────
nest-test:
	@echo "🧪 Running unit tests..."
	@$(COMPOSE) exec $(APP_SERVICE) npm test

nest-test-watch:
	@echo "🧪 Running tests in watch mode..."
	@$(COMPOSE) exec $(APP_SERVICE) npm run test:watch

nest-test-cov:
	@echo "📊 Running tests with coverage..."
	@$(COMPOSE) exec $(APP_SERVICE) npm run test:cov

# ── Lint ─────────────────────────────────────────────────────────────────────
nest-lint:
	@echo "📝 Running ESLint..."
	@$(COMPOSE) exec $(APP_SERVICE) npm run lint

# ── Clean ────────────────────────────────────────────────────────────────────
nest-clean:
	@echo "🧹 Cleaning dist/ inside the container..."
	@$(COMPOSE) exec $(APP_SERVICE) sh -c "rm -rf dist/ && npm cache clean --force"
	@echo "✅ Clean complete"

# ── Migrations ───────────────────────────────────────────────────────────────
nest-migration-create:
	@if [ -z "$(NAME)" ]; then \
		echo "❌ ERROR: specify NAME=MigrationName"; \
		echo "Example: make nest-migration-create NAME=CreateUsersTable"; \
		exit 1; \
	fi
	@echo "📝 Creating empty migration: $(NAME)"
	@$(COMPOSE) exec $(APP_SERVICE) npm run migration:create -- src/database/migrations/$(NAME)

nest-migration-generate:
	@if [ -z "$(NAME)" ]; then \
		echo "❌ ERROR: specify NAME=MigrationName"; \
		echo "Example: make nest-migration-generate NAME=AddEmailColumn"; \
		exit 1; \
	fi
	@echo "🔄 Generating migration from entity changes: $(NAME)"
	@$(COMPOSE) exec $(APP_SERVICE) npm run migration:generate -- src/database/migrations/$(NAME)

nest-migration-run:
	@echo "⬆️  Running pending migrations..."
	@$(COMPOSE) exec $(APP_SERVICE) npm run migration:run
	@echo "✅ Migrations complete"

nest-migration-revert:
	@echo "⬇️  Reverting last migration..."
	@$(COMPOSE) exec $(APP_SERVICE) npm run migration:revert
	@echo "✅ Migration reverted"

# ── Seeds ────────────────────────────────────────────────────────────────────
nest-seed:
	@echo "🌱 Running seeds..."
	@$(COMPOSE) exec $(APP_SERVICE) npm run seed:run

# ── Full setup ───────────────────────────────────────────────────────────────
nest-full-setup: up
	@echo ""
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║  ✅ NestJS setup complete                                  ║"
	@echo "╠════════════════════════════════════════════════════════════╣"
	@echo "║  Next steps:                                              ║"
	@echo "║  1. make nest-migration-run   # run pending migrations    ║"
	@echo "║  2. make up-dev               # start with hot-reload     ║"
	@echo "║  3. Swagger: http://localhost:3000/api/docs               ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""

# ── Help ─────────────────────────────────────────────────────────────────────
help:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║              Makefile — Available Commands                 ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "🐳 DOCKER:"
	@echo "  make up                           # Start all services (production)"
	@echo "  make up-dev                       # MySQL + phpMyAdmin + NestJS hot-reload"
	@echo "  make down                         # Stop all services"
	@echo "  make restart                      # Restart all services"
	@echo "  make rebuild                      # Rebuild production image and start"
	@echo "  make rebuild-dev                  # Rebuild dev image and start"
	@echo "  make logs                         # Stream logs from all services"
	@echo "  make logs-service SERVICE=<name>  # Stream logs from one service"
	@echo "  make ps                           # Show container status"
	@echo "  make exec CMD=\"<cmd>\"             # Run a command in app-nestjs"
	@echo "  make shell                        # Open a shell in app-nestjs"
	@echo ""
	@echo "🗄️  DATABASE:"
	@echo "  make ssl                          # Generate self-signed SSL certs"
	@echo "  make validate                     # Run docker/validate.sh"
	@echo "  make mysql-migrate                # Apply SQL scripts from docker/sql/"
	@echo "  make sql-import FILE=<path>       # Import a SQL file into MySQL"
	@echo "  make db-backup                    # Dump the database to ./backups/"
	@echo ""
	@echo "🚀 NESTJS (run inside container):"
	@echo "  make dev  / make up-dev           # Hot-reload via app-nestjs-dev"
	@echo "  make build / nest-build           # Compile for production"
	@echo "  make test  / nest-test            # Unit tests"
	@echo "  make nest-test-watch              # Tests in watch mode"
	@echo "  make nest-test-cov                # Tests with coverage"
	@echo "  make lint  / nest-lint            # ESLint + autofix"
	@echo "  make clean / nest-clean           # Remove dist/"
	@echo "  make install / nest-install       # npm install"
	@echo ""
	@echo "🗄️  TYPEORM MIGRATIONS (run inside container):"
	@echo "  make nest-migration-create  NAME=CreateUsersTable"
	@echo "  make nest-migration-generate NAME=AddEmailColumn"
	@echo "  make nest-migration-run           # Run pending migrations"
	@echo "  make nest-migration-revert        # Revert last migration"
	@echo ""
	@echo "🌱 SEEDS:"
	@echo "  make nest-seed                    # Populate the database"
	@echo ""
	@echo "⚡ FULL SETUP:"
	@echo "  make nest-full-setup              # docker up + wait for app"
	@echo ""

