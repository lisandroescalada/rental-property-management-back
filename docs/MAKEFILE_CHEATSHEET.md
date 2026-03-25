# 🚀 Quick Reference - Comandos Makefile NestJS

**Copiar y pegar directamente en la terminal:**

## 🎯 Primeros Pasos

```bash
# Instalación completa (instala deps + levanta Docker + compila)
make nest-full-setup

# Ejecutar migraciones después de setup
make nest-migration-run

# Iniciar servidor en desarrollo
make nest-dev
```

## ⚡ Desarrollo Diario

```bash
# Iniciar Docker y servidor
make up && make nest-dev

# En otra terminal: tests en watch mode
make nest-test-watch

# Parar todo al terminar
make down
```

## 🔨 Compilación y Deploy

```bash
# Compilar a producción
make nest-build

# Ejecutar servidor compilado
make nest-start
```

## 🗄️ Migraciones

```bash
# Crear migración vacía
make nest-migration-create NAME=CreateUsersTable

# Generar migración desde entidades
make nest-migration-generate NAME=AgregarCampoEmail

# Ejecutar migraciones pendientes
make nest-migration-run

# Revertir última migración
make nest-migration-revert
```

## 🧪 Testing

```bash
# Ejecutar tests
make nest-test

# Tests en watch mode
make nest-test-watch

# Con coverage
make nest-test-cov
```

## 📝 Código

```bash
# Linting y fix automático
make nest-lint

# Limpiar compilado
make nest-clean
```

## ℹ️ Información

```bash
# Ver todos los comandos disponibles
make help

# Estado de contenedores Docker
make ps

# Logs de todos los servicios
make logs

# Logs de MySQL específicamente
make logs-service SERVICE=mysql
```

## 🐳 Docker

```bash
# Levantar servicios
make up

# Parar servicios
make down

# Reiniciar
make restart

# Reconstruir imágenes
make rebuild
```

---

**Para documentación completa:** `MAKEFILE_NESTJS.md`

**Para guía de desarrollo:** `README-DEV.md`

**Para resumen de instalación:** `INSTALLATION_SUMMARY.md`

