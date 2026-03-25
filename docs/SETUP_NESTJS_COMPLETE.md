# Setup NestJS Completado ✅

## Resumen de Instalación

Se ha completado la configuración de un proyecto **NestJS** con Docker, MySQL y todas las dependencias necesarias para un backend moderno.

## 📦 Dependencias Instaladas

### Core NestJS
- `@nestjs/common@^11.1.17` - Módulo principal
- `@nestjs/core@^11.1.17` - Core functionality
- `@nestjs/platform-express@^11.1.17` - Express adapter

### Base de Datos
- `@nestjs/typeorm@^11.0.0` - ORM para TypeORM
- `typeorm@^0.3.28` - ORM TypeScript
- `mysql2@^3.20.0` - Driver MySQL

### Validación y Transformación
- `class-validator@^0.15.1` - Validación de clases
- `class-transformer@^0.5.1` - Transformación de datos

### Autenticación y Seguridad
- `@nestjs/jwt@^11.0.2` - Módulo JWT
- `@nestjs/passport@^11.0.5` - Integración Passport
- `passport@^0.7.0` - Librería autenticación
- `passport-jwt@^4.0.1` - Estrategia JWT
- `bcrypt@^6.0.0` - Hash de contraseñas

### Documentación API
- `@nestjs/swagger@^11.2.6` - Swagger/OpenAPI
- `swagger-ui-express@^5.0.1` - UI Swagger

### Configuración
- `@nestjs/config@^4.0.3` - Gestión de variables de entorno
- `reflect-metadata@^0.2.2` - Metadata reflection
- `rxjs@^7.8.2` - Programación reactiva

### DevDependencies
- `@nestjs/cli@^11.0.16` - CLI NestJS
- `@nestjs/testing@^11.1.17` - Testing utilities
- `@nestjs/schematics@^11.0.1` - Schematics
- `@typescript-eslint/eslint-plugin@^8.57.2` - Linting TypeScript
- `@types/bcrypt@^5.0.2` - Types para bcrypt
- `@types/passport-jwt@^3.0.13` - Types para passport-jwt
- TypeScript y otros dev tools

## 🏗️ Estructura del Proyecto

```
src/
├── app.module.ts           # Módulo raíz (configuración principal)
├── main.ts                 # Entry point (Swagger, CORS, Validation Pipe)
├── config/
│   ├── database.config.ts  # Configuración TypeORM
│   ├── jwt.config.ts       # Configuración JWT
│   └── index.ts            # Exportaciones
├── database/
│   ├── migrations/         # Archivos de migraciones
│   ├── seeds/              # Seeds de datos
│   └── subscribers/        # TypeORM subscribers
├── modules/
│   ├── health/             # Módulo de Health Check (ejemplo)
│   │   ├── health.controller.ts
│   │   ├── health.module.ts
│   │   └── index.ts
│   └── index.ts
└── common/
    ├── decorators/         # Decoradores personalizados
    ├── filters/            # Exception filters
    ├── guards/             # Guards (auth, roles, etc.)
    ├── interceptors/       # Interceptores
    └── index.ts
```

## ⚙️ Configuración

### Variables de Entorno (.env)
```bash
# MySQL
MYSQL_ROOT_PASSWORD=INXS3330
MYSQL_DATABASE=rentals_db
MYSQL_USER=rentals_user
MYSQL_PASSWORD=INXS3330

# Backend
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# TypeORM
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

### App Module
- ✅ ConfigModule global
- ✅ TypeOrmModule.forRootAsync() con variables de entorno
- ✅ JwtModule registrado
- ✅ PassportModule configurado
- ✅ HealthModule incluido

### Main.ts
- ✅ ValidationPipe global con whitelist
- ✅ CORS configurado
- ✅ Swagger en `/api/docs`
- ✅ Puerto desde variable de entorno (default: 3000)

## 🚀 Comandos Disponibles

### Instalación y Build
```bash
make nest-install     # Instalar dependencias (npm install)
make nest-build       # Compilar TypeScript a JavaScript
make nest-clean       # Limpiar dist/ y cache
```

### Desarrollo
```bash
make nest-dev         # Ejecutar en modo watch (desarrollo)
make nest-start       # Ejecutar desde dist/
```

### Testing
```bash
make nest-test        # Ejecutar tests unitarios
make nest-test-watch  # Tests en modo watch
make nest-test-cov    # Tests con coverage
```

### Migraciones
```bash
make nest-migration-create NAME=MigracionVacia
make nest-migration-generate NAME=AgregarCampo
make nest-migration-run       # Ejecutar migraciones
make nest-migration-revert    # Revertir última
```

### Otros
```bash
make nest-seed        # Ejecutar seeds
make nest-lint        # Linting con fix
make nest-full-setup  # Install + Docker + Build
```

### Docker
```bash
make up               # Levantar docker-compose
make down             # Parar servicios
make restart          # Reiniciar
make logs             # Ver logs
make mysql-migrate    # Aplicar SQL scripts
```

## 📡 Endpoints

### Health Check
```
GET http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-25T07:39:33.000Z",
  "message": "Rental Property Management Backend is running"
}
```

### Swagger Documentation
```
http://localhost:3000/api/docs
```

## ✅ Verificación

```bash
# Compilación exitosa
$ npm run build
> nest build
# ✅ Sin errores

# Servidor en desarrollo
$ npm run dev
> nest start --watch
[Nest] 12345 - 03/25/2026, 7:39:33 AM   LOG [NestFactory] Starting Nest application...
```

## 🔐 Producción

Para preparar para producción:

1. **Cambiar JWT_SECRET** en .env
2. **Cambiar contraseñas** de MySQL
3. **Desactivar DB_LOGGING** (ya está false)
4. **Usar migraciones** en lugar de synchronize
5. **Revisar CORS_ORIGIN** (restrictiva)
6. **Validar variables de entorno** obligatorias

## 📚 Próximos Pasos

1. Crear módulos de negocio (users, properties, rentals, etc.)
2. Generar entidades TypeORM
3. Crear migraciones iniciales
4. Implementar autenticación con JWT
5. Crear DTOs y validators
6. Escribir tests unitarios
7. Documentar endpoints en Swagger

## 🔧 Troubleshooting

### Error: Cannot find module '@config'
- Asegurar que tsconfig.json tenga los path aliases configurados

### Error: Cannot connect to MySQL
- Verificar que docker-compose está levantado: `make up`
- Verificar variables de entorno en .env

### Error: CORS bloqueado
- Actualizar CORS_ORIGIN en .env si es necesario

### Error: npm install falla
- Usar: `npm install --legacy-peer-deps`

## 📖 Recursos

- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [Swagger/OpenAPI](https://swagger.io)
- [JWT Auth](https://tools.ietf.org/html/rfc7519)

