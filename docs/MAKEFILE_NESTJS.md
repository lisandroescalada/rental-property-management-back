# 📚 Documentación - Comandos Makefile para NestJS

Este documento detalla todos los comandos agregados al `Makefile` para gestionar el backend NestJS.

## Visualizar Ayuda

```bash
make help
```

Muestra todos los comandos disponibles organizados por categoría.

---

## 🚀 Instalación y Ejecución

### Instalar Dependencias

```bash
make nest-install
```

Instala todas las dependencias del proyecto definidas en `package.json`.

**Equivalente a:** `npm install`

### Ejecutar en Desarrollo (Watch Mode)

```bash
make nest-dev
```

Inicia el servidor en modo desarrollo con hot-reload automático. Cualquier cambio en los archivos fuente se recompila automáticamente.

**Características:**
- ✅ Hot reload
- ✅ Source maps
- ✅ Logs en consola
- ✅ Swagger disponible en http://localhost:3000/api/docs

**Equivalente a:** `npm run dev`

### Compilar para Producción

```bash
make nest-build
```

Compila el código TypeScript a JavaScript y genera la carpeta `dist/`.

**Output:** `dist/` con toda la aplicación compilada

**Equivalente a:** `npm run build`

### Ejecutar Proyecto Compilado

```bash
make nest-start
```

Inicia la aplicación usando los archivos compilados en `dist/`.

**Nota:** Primero ejecutar `make nest-build`

**Equivalente a:** `npm start`

---

## 🧪 Testing

### Ejecutar Tests Unitarios

```bash
make nest-test
```

Ejecuta todos los archivos `*.spec.ts` una sola vez.

**Equivalente a:** `npm test`

### Tests en Modo Watch

```bash
make nest-test-watch
```

Ejecuta tests y mantiene el proceso activo, reejecutando cuando hay cambios.

**Equivalente a:** `npm run test:watch`

### Tests con Coverage

```bash
make nest-test-cov
```

Ejecuta tests y genera un reporte de cobertura en `coverage/`.

**Equivalente a:** `npm run test:cov`

---

## 📝 Linting y Código

### Linting y Fix Automático

```bash
make nest-lint
```

Ejecuta ESLint en todo el código y corrige automáticamente los problemas detectados.

**Equivalente a:** `npm run lint`

---

## 🗄️ Migraciones TypeORM

Las migraciones permiten versionar los cambios en la estructura de la base de datos.

### Crear Migración Vacía

```bash
make nest-migration-create NAME=CreateUsersTable
```

Crea un archivo de migración vacío en `src/database/migrations/` con timestamp y nombre especificado.

**Ejemplo completo:**
```bash
make nest-migration-create NAME=AddEmailToUsers
# Crea: src/database/migrations/1719273600000-AddEmailToUsers.ts
```

**Equivalente a:** `npm run migration:create -- -n AddEmailToUsers`

### Generar Migración Automáticamente

```bash
make nest-migration-generate NAME=AgregarCampoPhone
```

Analiza los cambios en las entidades TypeORM y genera una migración automáticamente.

**Útil cuando:**
- Agregaste campos a una entidad
- Eliminaste campos
- Cambiaste tipos de datos

**Ejemplo:**
```bash
make nest-migration-generate NAME=AgregarPhoneAlUsuario
# Analiza diferencias y genera la migración
```

**Equivalente a:** `npm run migration:generate -- -n AgregarPhoneAlUsuario`

### Ejecutar Migraciones Pendientes

```bash
make nest-migration-run
```

Aplica todas las migraciones pendientes a la base de datos.

**Debe ejecutarse:**
- ✅ Después de crear nuevas migraciones
- ✅ Al hacer deploy a producción
- ✅ Cuando alguien más agregó migraciones

**Estado actual de migraciones:**

Ver qué migraciones se han aplicado:
```bash
# En la base de datos (tabla typeorm_metadata)
docker-compose exec mysql mysql -u rentals_user -p rentals_db -e "SELECT * FROM typeorm_metadata;"
```

**Equivalente a:** `npm run migration:run`

### Revertir Última Migración

```bash
make nest-migration-revert
```

Revierte la última migración aplicada (ejecuta el método `down`).

**Cuidado:** Esta acción modifica la base de datos.

**Ejemplo de uso:**
```bash
# Si algo salió mal con la última migración
make nest-migration-revert
# Luego ajusta la migración y vuelve a ejecutar
make nest-migration-run
```

**Equivalente a:** `npm run migration:revert`

---

## 🌱 Datos y Seeds

### Ejecutar Seeds (Poblar Datos)

```bash
make nest-seed
```

Ejecuta los seeds ubicados en `src/database/seeds/` para poblar la base de datos con datos iniciales.

**Útil para:**
- ✅ Cargar datos de prueba en desarrollo
- ✅ Inicializar datos requeridos (usuarios admin, roles, etc.)

**Equivalente a:** `npm run seed:run`

---

## 🧹 Limpieza

### Limpiar Compilado y Cache

```bash
make nest-clean
```

Elimina:
- ✅ Carpeta `dist/` (compilado)
- ✅ Cache de npm

**Útil cuando:**
- Hay problemas de compilación
- Necesitas un clean rebuild

---

## ⚡ Setup Completo

### Instalación y Setup Automático

```bash
make nest-full-setup
```

Ejecuta automáticamente:
1. `make nest-install` - Instala dependencias
2. `make up` - Levanta contenedores Docker (MySQL, phpMyAdmin)
3. `make nest-build` - Compila el proyecto

**Después del setup:**
```bash
make nest-migration-run  # Aplicar migraciones
make nest-dev            # Iniciar servidor
```

---

## 🔄 Flujo de Trabajo Recomendado

### Desarrollo Diario

```bash
# Al iniciar
make up                    # Levantar Docker
make nest-dev              # Iniciar servidor en desarrollo

# En otra terminal para tests
make nest-test-watch       # Tests en watch mode

# Cuando termines
make down                  # Parar Docker
```

### Agregar Nuevas Entidades

```bash
# 1. Crear la entidad en src/modules/users/entities/user.entity.ts
# 2. Generar migración automáticamente
make nest-migration-generate NAME=CreateUserEntity

# 3. Ejecutar la migración
make nest-migration-run

# 4. Si hay errores, revertir
make nest-migration-revert
```

### Deployment a Producción

```bash
# 1. Compilar
make nest-build

# 2. Revisar cambios
git status

# 3. Aplicar migraciones en producción
make nest-migration-run

# 4. Iniciar servidor compilado
make nest-start
```

### Testing Antes de Commit

```bash
# Linting
make nest-lint

# Tests
make nest-test

# Compilación
make nest-build

# Si todo está bien, hacer commit
git add .
git commit -m "feature: ..."
```

---

## 📋 Tabla de Referencia Rápida

| Comando | Descripción | Cuándo usar |
|---------|-------------|------------|
| `make nest-install` | Instalar dependencias | Setup inicial |
| `make nest-dev` | Desarrollo (watch mode) | Diariamente |
| `make nest-build` | Compilar a producción | Pre-deploy |
| `make nest-start` | Ejecutar compilado | Producción |
| `make nest-test` | Tests unitarios | Pre-commit |
| `make nest-test-watch` | Tests en watch | Durante desarrollo |
| `make nest-test-cov` | Tests con coverage | Code review |
| `make nest-lint` | Linting y fix | Pre-commit |
| `make nest-migration-create NAME=X` | Crear migración | Manual |
| `make nest-migration-generate NAME=X` | Generar migración | Después entidad |
| `make nest-migration-run` | Ejecutar migraciones | Después crear |
| `make nest-migration-revert` | Revertir migración | Si hay error |
| `make nest-seed` | Poblar datos | Setup inicial |
| `make nest-clean` | Limpiar dist/ | Si hay problemas |
| `make nest-full-setup` | Setup completo | Inicial |

---

## 🐳 Integración con Docker

Los comandos de NestJS funcionan junto con los comandos Docker:

```bash
# Levantar servicios
make up

# En otra terminal: iniciar NestJS
make nest-dev

# Después de cambios de BD: ejecutar migraciones
make nest-migration-run

# Logs de MySQL
make logs-service SERVICE=mysql

# Parar todo
make down
```

---

## ⚙️ Variables de Entorno

Los comandos usan variables en `.env`:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=rentals_user
DB_PASSWORD=INXS3330
DB_NAME=rentals_db
JWT_SECRET=change_this_in_production
```

Cambiar `NODE_ENV=production` para compilación de producción.

---

## 🆘 Troubleshooting

### Error: "Cannot connect to MySQL"

```bash
# Verificar que Docker está corriendo
make ps

# Si no, levantar servicios
make up

# Esperar a que MySQL esté listo (healthcheck)
sleep 10

# Luego ejecutar migraciones
make nest-migration-run
```

### Error: "Cannot find module"

```bash
# Limpiar y reinstalar
make nest-clean
make nest-install
make nest-build
```

### Migraciones no aparecen

```bash
# Verificar base de datos
docker-compose exec mysql mysql -u rentals_user -p rentals_db -e "SHOW TABLES;"

# Ejecutar migraciones manualmente
make nest-migration-run
```

---

## 📞 Más Información

- [Documentación NestJS](https://docs.nestjs.com)
- [TypeORM Migraciones](https://typeorm.io/migrations)
- Ver también: `README-DEV.md` en este repositorio


