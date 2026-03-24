# Makefile: tareas comunes para el entorno Docker
# Uso: make <target>

SHELL := /bin/bash
ENV_FILE := .env
COMPOSE := docker-compose

DB_USER := $(shell grep -E '^MYSQL_USER=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)
DB_PASS := $(shell grep -E '^MYSQL_PASSWORD=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)
DB_NAME := $(shell grep -E '^MYSQL_DATABASE=' $(ENV_FILE) 2>/dev/null | cut -d= -f2)

.PHONY: help ssl up down restart rebuild logs logs-service ps status validate migrate mysql-migrate sql-import db-backup

help:
	@echo "Makefile - comandos disponibles"
	@echo "  make ssl               # Generar certificados SSL (docker/generate-ssl.sh)"
	@echo "  make up                # Levantar todos los servicios (docker-compose up -d)"
	@echo "  make down              # Parar todos los servicios (docker-compose down)"
	@echo "  make restart           # Reiniciar servicios"
	@echo "  make rebuild           # Reconstruir imágenes y levantar (docker-compose up -d --build)"
	@echo "  make logs              # Ver logs de todos los servicios (seguimiento)"
	@echo "  make logs-service SERVICE=<name>  # Ver logs de un servicio específico"
	@echo "  make ps                # Mostrar estado de contenedores"
	@echo "  make validate          # Ejecutar docker/validate.sh si existe"
	@echo "  make migrate           # Ejecutar migraciones (prioriza docker/sql/*.sql)"
	@echo "  make mysql-migrate     # Ejecutar todos los .sql en docker/sql/ contra MySQL"
	@echo "  make sql-import FILE=archivo.sql  # Importar un SQL al contenedor mysql"
	@echo "  make db-backup         # Hacer dump de la base de datos (se guarda en ./backups/)"

# Generar certificados SSL (script de repo)
ssl:
	@echo "🔐 Generando certificados SSL (docker/generate-ssl.sh)..."
	@bash docker/generate-ssl.sh

# Levantar servicios
start:
	@echo "⬆️ Levantando servicios..."
	@$(COMPOSE) up -d

# Parar servicios
stop:
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
