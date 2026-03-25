# 🚀 Guía de Desarrollo - Backend NestJS

## Descripción General

Este es un backend desarrollado con **NestJS** e integrado con **MySQL** mediante **TypeORM**. El proyecto incluye autenticación con JWT, validación de datos y documentación automática con Swagger.

## Estructura del Proyecto

```
src/
├── config/              # Configuraciones tipadas (database, jwt, etc.)
├── modules/             # Módulos de negocio (users, auth, properties, etc.)
├── common/              # Guards, decorators, filters, interceptors compartidos
│   ├── guards/
│   ├── decorators/
│   ├── filters/
│   └── interceptors/
├── database/            # Migraciones, seeds y subscribers de TypeORM
│   ├── migrations/
│   ├── seeds/
│   └── subscribers/
├── app.module.ts        # Módulo raíz
└── main.ts              # Entry point con validación y Swagger
```

## Instalación y Configuración

### 1. Variables de Entorno

El proyecto utiliza un archivo `.env` con las siguientes variables:

```env
# MySQL
MYSQL_ROOT_PASSWORD=INXS3330
MYSQL_DATABASE=rentals_db
MYSQL_USER=rentals_user
MYSQL_PASSWORD=INXS3330

# Backend
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

**En producción**, cambiar `JWT_SECRET` por un valor seguro y poner `NODE_ENV=production`.

### 2. Iniciar con Docker Compose

```bash
# Levantar contenedores (MySQL + phpMyAdmin)
make up

# Verificar estado
make ps

# Ver logs
make logs-service SERVICE=mysql
```

**Acceso a phpMyAdmin:** http://localhost:8080

### 3. Instalar Dependencias

```bash
make nest-install
```

## 🚀 Scripts y Comandos Makefile

```bash
# Desarrollo
make nest-dev              # Hot-reload
make nest-build            # Compilar a producción
make nest-start            # Ejecutar compilado

# Testing
make nest-test             # Tests unitarios
make nest-test-watch       # Tests en watch
make nest-test-cov         # Con coverage

# Código
make nest-lint             # ESLint + fix
make nest-clean            # Limpiar dist/

# Migraciones
make nest-migration-create NAME=MiMigracion
make nest-migration-generate NAME=MiMigracion
make nest-migration-run
make nest-migration-revert

# Datos
make nest-seed             # Ejecutar seeds

# Setup completo
make nest-full-setup       # Instala todo
```

**Ver todos los comandos:** `make help`

## Dependencias Principales

### Core NestJS
- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- `@nestjs/config` - Variables de entorno
- `@nestjs/cli` - CLI

### Base de Datos
- `@nestjs/typeorm`, `typeorm`, `mysql2`

### Autenticación
- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`

### Validación
- `class-validator`, `class-transformer`

### Documentación
- `@nestjs/swagger`, `swagger-ui-express`

## Rutas y Funcionalidades

### Documentación de API
- **Swagger UI:** http://localhost:3000/api/docs

## Crear Módulos

```bash
npx nest generate module modules/users
npx nest generate service modules/users
npx nest generate controller modules/users
```

## Crear Entidades

Ejemplo en `src/modules/users/entities/user.entity.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
```

## Crear DTOs

Ejemplo en `src/modules/users/dto/create-user.dto.ts`:

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

## Migraciones

```bash
# Generar migración de entidades
make nest-migration-generate NAME=CreateUsers

# Ejecutar
make nest-migration-run

# Revertir
make nest-migration-revert
```

## JWT Autenticación

Crear Guard en `src/common/guards/jwt.guard.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
```

Usar en controladores:

```typescript
import { JwtGuard } from '@common/guards/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  @Get()
  findAll() {
    // Solo usuarios autenticados
  }
}
```

## Troubleshooting

### Error: "Cannot connect to MySQL"
```bash
make up                # Levantar Docker
sleep 5
make nest-migration-run
```

### Error: "Cannot find module '@config'"
```bash
npm run build
```

### Limpiar todo
```bash
make nest-clean
make nest-install
make nest-build
```

## Recursos

- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [Swagger UI](https://swagger.io)
- [JWT](https://jwt.io)

## Próximos Pasos

1. ✅ `make nest-full-setup` - Setup completo
2. ✅ `make nest-migration-run` - Ejecutar migraciones
3. ✅ `make nest-dev` - Iniciar servidor
4. ✅ Crear módulos en `src/modules/`
5. ✅ Definir entidades y DTOs
6. ✅ Implementar lógica de negocio

