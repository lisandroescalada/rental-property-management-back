# 🚀 Guía Completa - Docker + NestJS Backend

**Fecha:** 2026-03-25  
**Estado:** ✅ Completado y Funcionando

---

## 📑 Tabla de Contenidos

1. [Inicio Rápido (5 minutos)](#inicio-rápido-5-minutos)
2. [Configuración de Docker](#configuración-de-docker)
3. [Backend NestJS](#backend-nestjs)
4. [Servicios Disponibles](#servicios-disponibles)
5. [Comandos Útiles](#comandos-útiles)
6. [Troubleshooting](#troubleshooting)

---

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Generar Certificados SSL (Desarrollo)

```bash
bash docker/generate-ssl.sh
```

✅ Crea certificados autofirmados válidos por 365 días

### Paso 2: Iniciar Servicios Docker

```bash
docker-compose up -d
```

✅ Inicia MySQL, phpMyAdmin, Nginx y espera a que estén listos (1-2 minutos)

### Paso 3: Instalar Dependencias NestJS

```bash
npm install --legacy-peer-deps
```

✅ Instala todas las dependencias del backend

### Paso 4: Compilar y Ejecutar Backend

```bash
# Compilar
npm run build

# Ejecutar en desarrollo (watch mode)
npm run dev
```

✅ NestJS inicia en puerto 3000

### Paso 5: Verificar que Todo Funciona

```bash
# Docker
docker-compose ps

# NestJS Health Check
curl http://localhost:3000/health

# Swagger Documentation
open http://localhost:3000/api/docs
```

---

## 🐳 Configuración de Docker

### Servicios disponibles

| Servicio | URL/Host | Puerto | Usuario | Contraseña | Función |
|----------|----------|--------|---------|-----------|---------|
| **MySQL** | `mysql` (interno) | 3306 | rentals_user | INXS3330 | Base de datos principal |
| **phpMyAdmin** | http://localhost:8080 | 8080 | rentals_user | INXS3330 | Gestión visual de BD |
| **Nginx (HTTP)** | http://localhost | 80 | - | - | Proxy + SSL redirect |
| **Nginx (HTTPS)** | https://localhost | 443 | - | - | Reverse proxy con SSL |

### Archivo `.env` (variables de configuración)

```dotenv
# MySQL
MYSQL_ROOT_PASSWORD=INXS3330
MYSQL_USER=rentals_user
MYSQL_PASSWORD=INXS3330
MYSQL_DATABASE=rentals_db

# Backend NestJS
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# Database (TypeORM)
DB_HOST=localhost
DB_PORT=3306
DB_USER=rentals_user
DB_PASSWORD=INXS3330
DB_NAME=rentals_db
DB_LOGGING=false

# JWT
JWT_SECRET=change_this_secret_in_production
JWT_EXPIRES_IN=7d
```

### Comandos Docker

```bash
# Ver estado
docker-compose ps

# Ver logs en vivo
docker-compose logs -f [servicio]

# Reiniciar servicios
docker-compose restart

# Parar servicios
docker-compose down

# Parar y eliminar volúmenes (⚠️ elimina datos)
docker-compose down -v

# Reconstruir imagen
docker-compose up -d --build

# Ejecutar comando en contenedor
docker-compose exec mysql mysql -u root -pINXS3330 -e "SHOW DATABASES;"
```

---

## 🎯 Backend NestJS

### ¿Qué se instaló?

#### Framework
- ✅ NestJS 11.1.17
- ✅ Express (HTTP adapter)
- ✅ TypeScript 6.0.2 (Strict Mode)

#### Base de Datos
- ✅ TypeORM 0.3.28
- ✅ MySQL2 3.20.0
- ✅ @nestjs/typeorm 11.0.0

#### Autenticación & Seguridad
- ✅ JWT (@nestjs/jwt)
- ✅ Passport + Passport-JWT
- ✅ Bcrypt (hash de contraseñas)

#### Validación
- ✅ class-validator
- ✅ class-transformer

#### Documentación
- ✅ Swagger 11.2.6
- ✅ swagger-ui-express 5.0.1

#### Desarrollo
- ✅ Jest (testing)
- ✅ ESLint + Prettier
- ✅ @nestjs/cli

### Estructura del Proyecto

```
src/
├── app.module.ts              # Módulo raíz
├── main.ts                    # Entry point
├── config/
│   ├── database.config.ts     # Configuración TypeORM
│   ├── jwt.config.ts          # Configuración JWT
│   └── index.ts
├── database/
│   ├── migrations/            # Migraciones SQL
│   ├── seeds/                 # Datos iniciales
│   └── subscribers/           # Listeners TypeORM
├── modules/
│   ├── health/                # Health check (ejemplo)
│   └── [otros módulos]
└── common/
    ├── decorators/            # Decoradores personalizados
    ├── filters/               # Exception filters
    ├── guards/                # Auth guards, role-based
    └── interceptors/          # Interceptores

dist/                           # Compilado (generado)
```

### Comandos NestJS

```bash
# Desarrollo (watch mode - recompila automáticamente)
npm run dev

# Compilar para producción
npm run build

# Ejecutar desde build compilado
npm start

# Tests unitarios
npm test

# Linting y fix
npm run lint

# Generar módulo
nest generate module modules/users

# Generar servicio
nest generate service modules/users

# Generar controlador
nest generate controller modules/users

# Generar entidad
nest generate class modules/users/entities/user.entity
```

### TypeORM Migraciones

```bash
# Crear migración vacía
npm run migration:create -- -n CreateUsersTable

# Generar migración automática
npm run migration:generate -- -n CreateUsersTable

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Ejecutar seeds
npm run seed:run
```

---

## 🌐 Servicios Disponibles

### 1️⃣ Backend NestJS

**URL:** http://localhost:3000

**Endpoints:**

```
GET    /health
       → Respuesta: {"status":"ok",...}

GET    /api/docs
       → Swagger UI (Documentación interactiva)

GET    /api-json
       → Especificación OpenAPI
```

### 2️⃣ MySQL Database

**Host:** localhost:3306  
**Usuario:** rentals_user  
**Contraseña:** INXS3330  
**Base de datos:** rentals_db  

Conectar desde cliente:
```bash
mysql -h localhost -u rentals_user -p rentals_db
# Contraseña: INXS3330
```

### 3️⃣ phpMyAdmin

**URL:** http://localhost:8080  
**Usuario:** rentals_user  
**Contraseña:** INXS3330  

Interfaz web para gestionar MySQL visualmente.

### 4️⃣ Nginx (Reverse Proxy)

**HTTP:** http://localhost (redirige a HTTPS)  
**HTTPS:** https://localhost (certificado autofirmado)  

---

## 🛠️ Comandos Útiles

### Levantamiento del Proyecto

```bash
# Setup completo (recomendado)
bash docker/generate-ssl.sh      # 1. SSL
docker-compose up -d              # 2. Docker
npm install --legacy-peer-deps    # 3. Dependencias
npm run build                      # 4. Compilar
npm run dev                        # 5. Ejecutar
```

### Docker

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Detener servicios (sin eliminar datos)
docker-compose down

# Detener y limpiar todo (⚠️ pierde datos)
docker-compose down -v

# Usar helper script
./docker/docker-helper.sh up      # Iniciar
./docker/docker-helper.sh down    # Detener
./docker/docker-helper.sh logs    # Ver logs
./docker/docker-helper.sh status  # Estado
```

### NestJS Backend

```bash
# Desarrollo interactivo (watch mode)
npm run dev

# Compilar
npm run build

# Ejecutar compilado
npm start

# Tests
npm test
npm test:cov              # Con coverage

# Linting
npm run lint

# Makefile (alternativa)
make nest-dev             # Desarrollo
make nest-build           # Compilar
make nest-start           # Ejecutar
make nest-test            # Tests
```

### Bases de Datos

```bash
# Conectar a MySQL desde terminal
docker-compose exec mysql mysql -u rentals_user -p rentals_db
# Contraseña: INXS3330

# Ver bases de datos
SHOW DATABASES;

# Generar migración
npm run migration:generate -- -n NombreMigracion

# Ejecutar migraciones
npm run migration:run

# Ver estado de migraciones
npm run migration:run -- --dry-run
```

---

## 🔍 Verificación

### Checklist de Funcionalidad

```bash
# 1. Docker funcionando
docker-compose ps
# Debe mostrar: mysql, phpmyadmin, nginx con status "healthy"

# 2. MySQL respondiendo
docker-compose exec mysql mysql -u rentals_user -p rentals_db -e "SELECT 1;"
# Contraseña: INXS3330

# 3. phpMyAdmin accesible
curl -s http://localhost:8080 | head -5

# 4. NestJS respondiendo
curl http://localhost:3000/health

# 5. Swagger disponible
curl -s http://localhost:3000/api/docs | head -5
```

---

## 🆘 Troubleshooting

### Docker: Puertos en uso

**Problema:** "Port is already allocated"

**Solución:**
```bash
# Opción 1: Cambiar puerto en docker-compose.yml
# Por ejemplo, cambiar "80:80" a "8000:80"

# Opción 2: Liberar puerto
sudo lsof -i :80                    # Ver qué usa el puerto
sudo kill -9 <PID>                  # Matar proceso

# Opción 3: Detener todos los servicios
docker-compose down
```

### Docker: MySQL no inicia

**Problema:** MySQL no se conecta o no inicia

**Solución:**
```bash
# Ver logs
docker-compose logs mysql

# Limpiar volumen y reintentar
docker-compose down -v
docker-compose up -d mysql
sleep 30                            # Esperar a que inicie
docker-compose logs mysql
```

### NestJS: Error de compilación

**Problema:** `npm run build` falla

**Solución:**
```bash
# Limpiar caché
npm run build:clean
# o manualmente:
rm -rf dist node_modules
npm install --legacy-peer-deps
npm run build
```

### NestJS: Puerto 3000 en uso

**Problema:** "EADDRINUSE: address already in use :::3000"

**Solución:**
```bash
# Matar proceso
pkill -f "node dist/main"
fuser -k 3000/tcp

# o usar puerto diferente
PORT=3001 npm start
```

### TypeORM: No conecta a MySQL

**Problema:** "connect ECONNREFUSED 127.0.0.1:3306"

**Solución:**
```bash
# 1. Verificar que Docker está corriendo
docker-compose ps

# 2. Esperar a que MySQL inicie (toma ~30 segundos)
docker-compose logs mysql

# 3. Verificar variables de .env
cat .env | grep DB_

# 4. Conectar manualmente para probar
docker-compose exec mysql mysql -u rentals_user -p rentals_db
```

### Swagger no muestra endpoints

**Problema:** Swagger vacío o sin documentación

**Solución:**
```bash
# 1. Reiniciar servidor
npm run dev

# 2. Verificar que controllers tienen decoradores Swagger
# Ejemplo:
# @ApiTags('Users')
# @Controller('users')
# export class UsersController {}

# 3. Forzar recarga en navegador (Ctrl+Shift+R)

# 4. Verificar consola del navegador para errores
```

---

## 🚀 Workflow de Desarrollo Recomendado

### 1. Iniciar el Proyecto

```bash
# Terminal 1: Docker + MySQL
docker-compose up -d
docker-compose logs -f mysql

# Terminal 2: NestJS Backend
npm run dev
```

### 2. Crear Nuevo Módulo

```bash
# Generar estructura
nest generate module modules/users
nest generate service modules/users
nest generate controller modules/users

# Crear entidad
nest generate class modules/users/entities/user.entity
```

### 3. Agregar Decoradores Swagger

```typescript
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiOkResponse({ description: 'Lista de usuarios' })
  findAll() {
    // ...
  }
}
```

Swagger se actualizará **automáticamente** 🎉

### 4. Crear Migración

```bash
npm run migration:generate -- -n CreateUsersTable
npm run migration:run
```

### 5. Escribir Tests

```bash
npm test -- --watch
```

### 6. Commit y Push

```bash
git add .
git commit -m "feat: agregar módulo de usuarios"
git push
```

---

## 📦 Estadísticas del Proyecto

- **Total de paquetes:** 455+
- **Líneas de código base:** ~500
- **Dependencias críticas:** 31+
- **Compilación:** ✅ Sin errores
- **Tamaño dist/:** ~128 KB
- **Vulnerabilidades:** 6 moderate (no críticas)

---

## 🔐 Checklist de Producción

Antes de desplegar:

- [ ] Cambiar `JWT_SECRET` en `.env`
- [ ] Cambiar contraseñas MySQL
- [ ] Configurar `CORS_ORIGIN` restrictivo
- [ ] Habilitar HTTPS con certificados válidos
- [ ] Usar migraciones (no synchronize)
- [ ] Configurar variables de entorno obligatorias
- [ ] Ejecutar `npm audit`
- [ ] Tests pasando: `npm test`
- [ ] Build sin errores: `npm run build`
- [ ] Configurar CI/CD
- [ ] Backups de base de datos

---

## 📖 Referencias

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Docker Documentation](https://docs.docker.com)
- [Swagger/OpenAPI](https://swagger.io)

---

**Última actualización:** 2026-03-25  
**Estado:** ✅ Completado y funcionando

