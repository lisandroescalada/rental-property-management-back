# 📦 Makefile - Comandos Docker (Actualizado)

---

## 🐳 Contenedor Objetivo

El contenedor se llama **`app`** (en docker-compose.yml aparece como `app-nextjs`).

Todos los comandos usan:
```makefile
$(COMPOSE) exec app <comando>
```

Donde `$(COMPOSE)` = `docker compose`

---

## 📋 Comandos Rápidos (Atajos)

Se ejecutan **DENTRO del contenedor**:

```bash
make dev               # npm run dev (watch mode) ✓ EN CONTENEDOR
make build             # npm run build (compilar) ✓ EN CONTENEDOR
make start             # npm start (ejecutar compilado) ✓ EN CONTENEDOR
make test              # npm test (tests) ✓ EN CONTENEDOR
make lint              # npm run lint (linting) ✓ EN CONTENEDOR
make clean             # Limpiar dist/ y cache ✓ EN CONTENEDOR
make install           # npm install (instalar dependencias) ✓ EN CONTENEDOR
```

---

## 🚀 Comandos Detallados de NestJS

Se ejecutan **DENTRO del contenedor**:

```bash
make nest-install      # Instalar dependencias npm
make nest-dev          # Iniciar en desarrollo (watch mode)
make nest-build        # Compilar para producción
make nest-start        # Ejecutar compilado
make nest-test         # Ejecutar tests
make nest-test-watch   # Tests en watch mode
make nest-test-cov     # Tests con coverage
make nest-lint         # Linting y fix
make nest-clean        # Limpiar dist/ y cache
```

---

## 🗄️ Migraciones TypeORM

Se ejecutan **DENTRO del contenedor**:

```bash
make nest-migration-create NAME=CreateUsersTable
make nest-migration-generate NAME=AgregarCampo
make nest-migration-run       # Ejecutar migraciones pendientes
make nest-migration-revert    # Revertir última migración
```

---

## 🌱 Seeds (Datos)

Se ejecuta **DENTRO del contenedor**:

```bash
make nest-seed  # Ejecutar seeds para poblar datos
```

---

## ⚡ Setup Completo

```bash
make nest-full-setup
```

Ejecuta en orden:
1. `make up` - Levanta los servicios Docker
2. `make nest-install` - Instala dependencias (en contenedor)
3. `make nest-build` - Compila NestJS (en contenedor)

Luego muestra instrucciones para:
- Ejecutar migraciones
- Iniciar en desarrollo
- Acceder a URLs útiles

---

## 🐳 Servicios Docker

Se ejecutan en **host local** (no en contenedor):

```bash
make up                # Levantar servicios
make down              # Parar servicios
make restart           # Reiniciar servicios
make rebuild           # Reconstruir + levantar
make logs              # Ver logs
make logs-service SERVICE=mysql  # Logs específico
make ps                # Ver estado
make validate          # Validación
make mysql-migrate     # Scripts SQL
make db-backup         # Backup BD
```

---

## 📍 URLs Útiles

Una vez iniciado el proyecto:

```
http://localhost:3000              # API NestJS
http://localhost:3000/api/docs     # Swagger (documentación)
http://localhost:8080              # phpMyAdmin
```

---

## ✨ Flujo de Trabajo Recomendado

### 1️⃣ Primera Vez (Setup Completo)

```bash
make nest-full-setup
```

### 2️⃣ Desarrollo Diario

```bash
# Terminal 1: Levanta servicios (si no están corriendo)
make up

# Terminal 2: Inicia NestJS en modo desarrollo
make nest-dev

# Para ejecutar comandos puntuales:
make build
make test
make lint
```

### 3️⃣ Trabajar con Migraciones

```bash
# Crear migración vacía
make nest-migration-create NAME=CreateUsersTable

# O generar desde entidades
make nest-migration-generate NAME=AddUserFields

# Ejecutar migraciones
make nest-migration-run

# Revertir si es necesario
make nest-migration-revert
```

### 4️⃣ Parar Todo

```bash
make down
```

---

## ⚠️ Notas Importantes

1. **El contenedor debe estar corriendo** para que `docker compose exec` funcione:
   ```bash
   make up  # Levanta servicios primero
   ```

2. **Los cambios en el código** se sincronizan automáticamente si usas volúmenes en docker-compose.yml

3. **watch mode (`make dev`)** mantiene la aplicación actualizada mientras editas

4. **No mezcles comandos locales con docker**: usa siempre `make` para consistencia

---

## 🔍 Verificación

Para confirmar que todo funciona:

```bash
# 1. Levanta servicios
make up

# 2. Instala dependencias (en contenedor)
make install

# 3. Compila
make build

# 4. Ejecuta tests
make test

# 5. Ver logs del contenedor
make logs SERVICE=app
```

Si todo pasa correctamente, ¡tu setup Docker está listo! 🎉

