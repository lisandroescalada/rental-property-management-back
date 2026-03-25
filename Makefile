# Makefile: tareas comunes para el entorno Docker
# Uso: make <target>

SHELL := /bin/bash
ENV_FILE := .env
COMPOSE := docker-compose

DB_USER := $(shell grep -E '^MYSQL_USER=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)
DB_PASS := $(shell grep -E '^MYSQL_PASSWORD=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)
DB_NAME := $(shell grep -E '^MYSQL_DATABASE=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)

.PHONY: help ssl up down restart rebuild logs logs-service ps status validate migrate mysql-migrate sql-import db-backup \
         nest-install nest-dev nest-build nest-start nest-test nest-test-watch nest-test-cov nest-lint \
         nest-migration-create nest-migration-generate nest-migration-run nest-migration-revert nest-seed nest-clean nest-full-setup \
         dev build start test lint clean install

# ...existing code...

# Levantar servicios Docker
up:
	@echo "⬆️ Levantando servicios..."
	@$(COMPOSE) up -d

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
# 🚀 NestJS Backend - Comandos de Instalación y Desarrollo
# ============================================================================

.PHONY: nest-install nest-dev nest-build nest-start nest-test nest-lint \
        nest-migration-create nest-migration-generate nest-migration-run \
        nest-migration-revert nest-seed nest-clean nest-full-setup \
        dev build start test lint clean

# ============================================================================
# 📦 Comandos npm Rápidos (Atajos)
# ============================================================================

# Instalador dependencias
install: nest-install

# Desarrollo con watch mode (automático)
dev:
	@echo "🚀 Iniciando NestJS en modo desarrollo..."
	@npm run dev

# Compilar para producción
build:
	@echo "🔨 Compilando NestJS para producción..."
	@npm run build
	@echo "✅ Compilación completada en dist/"

# Ejecutar desde dist/ compilado
start:
	@echo "▶️  Iniciando NestJS (compilado)..."
	@npm start

# Ejecutar tests
test:
	@echo "🧪 Ejecutando tests unitarios..."
	@npm test

# Linting
lint:
	@echo "📝 Ejecutando linting..."
	@npm run lint

# Limpiar
clean:
	@echo "🧹 Limpiando dist/ y cache..."
	@rm -rf dist/
	@npm cache clean --force
	@echo "✅ Limpieza completada"

# ============================================================================
# 📦 Comandos npm Detallados (Con descripción)
# ============================================================================

# Instalar dependencias de NestJS
nest-install:
	@echo "📦 Instalando dependencias de NestJS..."
	@npm install --legacy-peer-deps

# Ejecutar en modo desarrollo (watch mode)
nest-dev:
	@echo "🚀 Iniciando NestJS en modo desarrollo..."
	@npm run dev

# Compilar proyecto para producción
nest-build:
	@echo "🔨 Compilando NestJS para producción..."
	@npm run build
	@echo "✅ Compilación completada en dist/"

# Ejecutar proyecto compilado
nest-start:
	@echo "▶️  Iniciando NestJS (compilado)..."
	@npm start

# Ejecutar tests unitarios
nest-test:
	@echo "🧪 Ejecutando tests unitarios..."
	@npm test

# Ejecutar tests en modo watch
nest-test-watch:
	@echo "🧪 Tests en modo watch..."
	@npm run test:watch

# Ejecutar tests con coverage
nest-test-cov:
	@echo "📊 Tests con coverage..."
	@npm run test:cov

# Ejecutar linting y fix
nest-lint:
	@echo "📝 Ejecutando linting..."
	@npm run lint

# Crear una migración vacía
nest-migration-create:
	@if [ -z "$(NAME)" ]; then \
		echo "ERROR: especifica NAME=NombreMigracion"; \
		echo "Ejemplo: make nest-migration-create NAME=CreateUsersTable"; \
		exit 1; \
	fi
	@echo "📝 Creando migración: $(NAME)"
	@npm run migration:create -- -n $(NAME)

# Generar migración basada en cambios de entidades
nest-migration-generate:
	@if [ -z "$(NAME)" ]; then \
		echo "ERROR: especifica NAME=NombreMigracion"; \
		echo "Ejemplo: make nest-migration-generate NAME=AgregarPropiedad"; \
		exit 1; \
	fi
	@echo "🔄 Generando migración: $(NAME)"
	@npm run migration:generate -- -n $(NAME)

# Ejecutar migraciones pendientes
nest-migration-run:
	@echo "⬆️  Ejecutando migraciones..."
	@npm run migration:run
	@echo "✅ Migraciones ejecutadas"

# Revertir última migración
nest-migration-revert:
	@echo "⬇️  Revirtiendo última migración..."
	@npm run migration:revert
	@echo "✅ Migración revertida"

# Ejecutar seeds (si existen)
nest-seed:
	@echo "🌱 Ejecutando seeds..."
	@npm run seed:run

# Limpiar dist/ y node_modules
nest-clean:
	@echo "🧹 Limpiando dist/ y cache..."
	@rm -rf dist/
	@npm cache clean --force
	@echo "✅ Limpieza completada"

# Setup completo: instalar + docker up + build
nest-full-setup: nest-install up nest-build
	@echo ""
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║  ✅ Setup completo de NestJS finalizado                     ║"
	@echo "╠════════════════════════════════════════════════════════════╣"
	@echo "║  Próximos pasos:                                           ║"
	@echo "║  1. make nest-migration-run    # Ejecutar migraciones      ║"
	@echo "║  2. make nest-dev              # Iniciar en desarrollo     ║"
	@echo "║  3. Acceder a Swagger:                                     ║"
	@echo "║     http://localhost:3000/api/docs                        ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""

# Actualizar información de ayuda
help:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║          Makefile - Comandos Disponibles                   ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "📦 NPM RÁPIDO (Atajos):"
	@echo "  make dev               # npm run dev (watch mode)"
	@echo "  make build             # npm run build (compilar)"
	@echo "  make start             # npm start (ejecutar compilado)"
	@echo "  make test              # npm test (tests)"
	@echo "  make lint              # npm run lint (linting)"
	@echo "  make clean             # Limpiar dist/ y cache"
	@echo "  make install           # npm install (instalar dependencias)"
	@echo ""
	@echo "🐳 DOCKER & BASE DE DATOS:"
	@echo "  make ssl               # Generar certificados SSL"
	@echo "  make up                # Levantar servicios (docker-compose up -d)"
	@echo "  make down              # Parar servicios (docker-compose down)"
	@echo "  make restart           # Reiniciar servicios"
	@echo "  make rebuild           # Reconstruir imágenes y levantar"
	@echo "  make logs              # Ver logs de todos los servicios"
	@echo "  make logs-service SERVICE=<name>  # Logs de servicio específico"
	@echo "  make ps                # Estado de contenedores"
	@echo "  make status            # Alias para ps"
	@echo "  make validate          # Ejecutar validación (docker/validate.sh)"
	@echo "  make mysql-migrate     # Aplicar scripts SQL (docker/sql/)"
	@echo "  make sql-import FILE=<path>  # Importar SQL al contenedor"
	@echo "  make db-backup         # Backup de la BD (en ./backups/)"
	@echo ""
	@echo "🚀 NESTJS BACKEND (Detallado):"
	@echo "  make nest-install      # Instalar dependencias npm"
	@echo "  make nest-dev          # Iniciar en desarrollo (watch mode)"
	@echo "  make nest-build        # Compilar para producción"
	@echo "  make nest-start        # Ejecutar compilado"
	@echo "  make nest-test         # Ejecutar tests"
	@echo "  make nest-test-watch   # Tests en watch mode"
	@echo "  make nest-test-cov     # Tests con coverage"
	@echo "  make nest-lint         # Linting y fix"
	@echo "  make nest-clean        # Limpiar dist/ y cache"
	@echo ""
	@echo "🗄️  MIGRACIONES TYPEORM:"
	@echo "  make nest-migration-create NAME=MigracionVacia"
	@echo "  make nest-migration-generate NAME=AgregarCampo"
	@echo "  make nest-migration-run     # Ejecutar migraciones pendientes"
	@echo "  make nest-migration-revert  # Revertir última migración"
	@echo ""
	@echo "🌱 DATOS:"
	@echo "  make nest-seed         # Ejecutar seeds (poblar datos)"
	@echo ""
	@echo "⚡ SETUP COMPLETO:"
	@echo "  make nest-full-setup   # Install + Docker + Build"
	@echo ""


