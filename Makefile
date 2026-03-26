# Makefile: tareas comunes para el entorno Docker
# Uso: make <target>

SHELL := /bin/bash
ENV_FILE := .env
COMPOSE := docker compose

DB_USER := $(shell grep -E '^MYSQL_USER=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)
DB_PASS := $(shell grep -E '^MYSQL_PASSWORD=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)
DB_NAME := $(shell grep -E '^MYSQL_DATABASE=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)

# Función para verificar si el contenedor app está corriendo
define check_app_running
	@if ! $(COMPOSE) ps app 2>/dev/null | grep -q "running"; then \
		echo ""; \
		echo "❌ Error: El contenedor 'app' no está corriendo"; \
		echo ""; \
		echo "📍 Solución: Primero levanta los servicios con:"; \
		echo ""; \
		echo "   make up"; \
		echo ""; \
		echo "⏳ Espera ~30-40 segundos a que todo inicialice"; \
		echo ""; \
		echo "✅ Luego ejecuta tu comando nuevamente"; \
		echo ""; \
		exit 1; \
	fi
endef

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

# Ver logs de compilación de NestJS
logs-build:
	@echo "📝 Mostrando logs de compilación de NestJS..."
	@$(COMPOSE) logs app | tail -100

# Ver logs de app en tiempo real
logs-app:
	@$(COMPOSE) logs -f app

# Estado y healthchecks
ps:
	@echo "📊 Estado de contenedores:"
	@$(COMPOSE) ps
	@echo ""
	@echo "🏥 Healthchecks (Estado de salud):"
	@$(COMPOSE) ps --format "table {{.Names}}\t{{.Status}}"

status: ps

# Verificar si los servicios están corriendo
check:
	@echo "🔍 Verificando estado de servicios..."
	@echo ""
	@if $(COMPOSE) ps app 2>/dev/null | grep -q "running"; then \
		echo "✅ Contenedor 'app' está CORRIENDO"; \
	else \
		echo "❌ Contenedor 'app' NO está corriendo"; \
		echo ""; \
		echo "📍 Para levantarlo ejecuta: make up"; \
	fi
	@echo ""
	@if $(COMPOSE) ps mysql 2>/dev/null | grep -q "running"; then \
		echo "✅ Contenedor 'mysql' está CORRIENDO"; \
	else \
		echo "❌ Contenedor 'mysql' NO está corriendo"; \
	fi
	@echo ""
	@if $(COMPOSE) ps nginx 2>/dev/null | grep -q "running"; then \
		echo "✅ Contenedor 'nginx' está CORRIENDO"; \
	else \
		echo "❌ Contenedor 'nginx' NO está corriendo"; \
	fi
	@echo ""

# Verificar que app está healthy
health:
	@echo "🏥 Verificando healthcheck del contenedor app..."
	@echo ""
	@curl -s http://localhost:3000/api/health 2>/dev/null | grep -q "ok" && \
		echo "✅ NestJS está saludable y respondiendo en /api/health" || \
		echo "❌ Endpoint /api/health no disponible"
	@echo ""

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
# 📦 Comandos npm Rápidos (Atajos) - Ejecutados DENTRO del contenedor Docker
# ============================================================================

# Instalador dependencias
install: nest-install

# Desarrollo con watch mode (automático)
dev:
	$(check_app_running)
	@echo "🚀 Iniciando NestJS en modo desarrollo dentro del contenedor..."
	@$(COMPOSE) exec app npm run dev

# Compilar para producción
build:
	$(check_app_running)
	@echo "🔨 Compilando NestJS para producción dentro del contenedor..."
	@$(COMPOSE) exec app npm run build
	@echo "✅ Compilación completada en dist/"

# Ejecutar desde dist/ compilado
start:
	$(check_app_running)
	@echo "▶️  Iniciando NestJS (compilado) dentro del contenedor..."
	@$(COMPOSE) exec app npm start

# Ejecutar tests
test:
	$(check_app_running)
	@echo "🧪 Ejecutando tests unitarios dentro del contenedor..."
	@$(COMPOSE) exec app npm test

# Linting
lint:
	$(check_app_running)
	@echo "📝 Ejecutando linting dentro del contenedor..."
	@$(COMPOSE) exec app npm run lint

# Limpiar
clean:
	$(check_app_running)
	@echo "🧹 Limpiando dist/ y cache dentro del contenedor..."
	@$(COMPOSE) exec app rm -rf dist/
	@$(COMPOSE) exec app npm cache clean --force
	@echo "✅ Limpieza completada"

# ============================================================================
# 📦 Comandos npm Detallados (Con descripción) - Ejecutados DENTRO del contenedor
# ============================================================================

# Instalar dependencias de NestJS
nest-install:
	@echo "📦 Instalando dependencias de NestJS dentro del contenedor..."
	@$(COMPOSE) exec app npm install --legacy-peer-deps

# Ejecutar en modo desarrollo (watch mode)
nest-dev:
	$(check_app_running)
	@echo "🚀 Iniciando NestJS en modo desarrollo dentro del contenedor..."
	@$(COMPOSE) exec app npm run dev

# Compilar proyecto para producción
nest-build:
	$(check_app_running)
	@echo "🔨 Compilando NestJS para producción dentro del contenedor..."
	@$(COMPOSE) exec app npm run build
	@echo "✅ Compilación completada en dist/"

# Ejecutar proyecto compilado
nest-start:
	$(check_app_running)
	@echo "▶️  Iniciando NestJS (compilado) dentro del contenedor..."
	@$(COMPOSE) exec app npm start

# Ejecutar tests unitarios
nest-test:
	$(check_app_running)
	@echo "🧪 Ejecutando tests unitarios dentro del contenedor..."
	@$(COMPOSE) exec app npm test

# Ejecutar tests en modo watch
nest-test-watch:
	$(check_app_running)
	@echo "🧪 Tests en modo watch dentro del contenedor..."
	@$(COMPOSE) exec app npm run test:watch

# Ejecutar tests con coverage
nest-test-cov:
	$(check_app_running)
	@echo "📊 Tests con coverage dentro del contenedor..."
	@$(COMPOSE) exec app npm run test:cov

# Ejecutar linting y fix
nest-lint:
	$(check_app_running)
	@echo "📝 Ejecutando linting dentro del contenedor..."
	@$(COMPOSE) exec app npm run lint

# Crear una migración vacía
nest-migration-create:
	$(check_app_running)
	@if [ -z "$(NAME)" ]; then \
		echo "ERROR: especifica NAME=NombreMigracion"; \
		echo "Ejemplo: make nest-migration-create NAME=CreateUsersTable"; \
		exit 1; \
	fi
	@echo "📝 Creando migración: $(NAME)"
	@$(COMPOSE) exec app npm run migration:create -- -n $(NAME)

# Generar migración basada en cambios de entidades
nest-migration-generate:
	$(check_app_running)
	@if [ -z "$(NAME)" ]; then \
		echo "ERROR: especifica NAME=NombreMigracion"; \
		echo "Ejemplo: make nest-migration-generate NAME=AgregarPropiedad"; \
		exit 1; \
	fi
	@echo "🔄 Generando migración: $(NAME)"
	@$(COMPOSE) exec app npm run migration:generate -- -n $(NAME)

# Ejecutar migraciones pendientes
nest-migration-run:
	$(check_app_running)
	@echo "⬆️  Ejecutando migraciones dentro del contenedor..."
	@$(COMPOSE) exec app npm run migration:run
	@echo "✅ Migraciones ejecutadas"

# Revertir última migración
nest-migration-revert:
	$(check_app_running)
	@echo "⬇️  Revirtiendo última migración dentro del contenedor..."
	@$(COMPOSE) exec app npm run migration:revert
	@echo "✅ Migración revertida"

# Ejecutar seeds (si existen)
nest-seed:
	$(check_app_running)
	@echo "🌱 Ejecutando seeds dentro del contenedor..."
	@$(COMPOSE) exec app npm run seed:run

# Limpiar dist/ y node_modules
nest-clean:
	$(check_app_running)
	@echo "🧹 Limpiando dist/ y cache dentro del contenedor..."
	@$(COMPOSE) exec app rm -rf dist/
	@$(COMPOSE) exec app npm cache clean --force
	@echo "✅ Limpieza completada"

# Setup completo: instalar + docker up + build
nest-full-setup: up nest-install nest-build
	@echo ""
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║  ✅ Setup completo de NestJS finalizado                     ║"
	@echo "╠════════════════════════════════════════════════════════════╣"
	@echo "║  Próximos pasos:                                           ║"
	@echo "║  1. make nest-migration-run    # Ejecutar migraciones      ║"
	@echo "║  2. make nest-dev              # Iniciar en desarrollo     ║"
	@echo "║  3. Acceder a la aplicación:                               ║"
	@echo "║     http://localhost:3000                                  ║"
	@echo "║  4. Ver documentación Swagger:                             ║"
	@echo "║     http://localhost:3000/api/docs                        ║"
	@echo "║  5. Acceder a phpMyAdmin:                                  ║"
	@echo "║     http://localhost:8080                                  ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""

# Actualizar información de ayuda
help:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║          Makefile - Comandos Disponibles                   ║"
	@echo "║     ℹ️  Los comandos npm se ejecutan DENTRO del contenedor   ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "📦 NPM RÁPIDO (Atajos) - Se ejecutan DENTRO del contenedor:"
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
	@echo "  make check             # ✅ Ver si app está corriendo"
	@echo "  make logs              # Ver logs de todos los servicios"
	@echo "  make logs-app          # Ver logs de app en TIEMPO REAL (watchmode)"
	@echo "  make logs-build        # Ver últimos logs de compilación"
	@echo "  make logs-service SERVICE=<name>  # Logs de servicio específico"
	@echo "  make ps                # Estado de contenedores"
	@echo "  make status            # Alias para ps"
	@echo "  make health            # Verificar healthcheck de app"
	@echo "  make validate          # Ejecutar validación (docker/validate.sh)"
	@echo "  make mysql-migrate     # Aplicar scripts SQL (docker/sql/)"
	@echo "  make sql-import FILE=<path>  # Importar SQL al contenedor"
	@echo "  make db-backup         # Backup de la BD (en ./backups/)"
	@echo ""
	@echo "🚀 NESTJS BACKEND (Detallado) - Se ejecutan DENTRO del contenedor:"
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
	@echo "🗄️  MIGRACIONES TYPEORM (Se ejecutan DENTRO del contenedor):"
	@echo "  make nest-migration-create NAME=MigracionVacia"
	@echo "  make nest-migration-generate NAME=AgregarCampo"
	@echo "  make nest-migration-run     # Ejecutar migraciones pendientes"
	@echo "  make nest-migration-revert  # Revertir última migración"
	@echo ""
	@echo "🌱 DATOS:"
	@echo "  make nest-seed         # Ejecutar seeds (poblar datos)"
	@echo ""
	@echo "⚡ SETUP COMPLETO:"
	@echo "  make nest-full-setup   # Up + Install + Build (todo en contenedor)"
	@echo ""
	@echo "📍 URLs ÚTILES DESPUÉS DE INICIAR:"
	@echo "  http://localhost:3000              # API NestJS"
	@echo "  http://localhost:3000/api/docs     # Swagger (documentación)"
	@echo "  http://localhost:8080              # phpMyAdmin"
	@echo ""


