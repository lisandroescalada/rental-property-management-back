# 🐳 Flujo de Desarrollo con Docker — Hot-Reload

## La pregunta clave: ¿tengo que hacer rebuild cada vez que cambio código?

**No.** En modo desarrollo el código fuente de tu máquina se monta directamente
dentro del contenedor mediante un volumen de Docker. Cada vez que guardas un
archivo `.ts`, NestJS detecta el cambio y reinicia automáticamente el servidor
dentro del contenedor, sin ninguna intervención tuya.

```
Tu editor (host)          Contenedor app-nestjs-dev
─────────────────         ──────────────────────────
src/users/...   ────────▶  /app/src/users/...   ← mismo archivo
Dockerfile.dev             npm run dev (watch)
                           NestJS reinicia solo 🔄
```

---

## ¿Cuándo SÍ necesitas rebuild?

| Situación | Comando |
|-----------|---------|
| Añades un paquete npm (`npm install <pkg>`) | `make rebuild-dev` |
| Cambias el `Dockerfile.dev` | `make rebuild-dev` |
| Primera vez que levantas el entorno | Solo `make up-dev` (construye sola) |
| Cambias código TypeScript | ✅ Automático, no hace falta nada |
| Cambias `.env` | `make down && make up-dev` |

---

## Levantar el entorno de desarrollo

### Primera vez (o tras clonar el repo)

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Generar certificados SSL (solo desarrollo local)
bash docker/generate-ssl.sh

# 3. Levantar MySQL + phpMyAdmin + NestJS con hot-reload
make up-dev
```

Esto construye la imagen `Dockerfile.dev` **una sola vez** e inicia tres contenedores:

| Contenedor | Puerto | Qué hace |
|------------|--------|----------|
| `app-mysql` | 3306 | Base de datos MySQL |
| `app-phpmyadmin` | 8080 | Interfaz visual de la BD |
| `app-nestjs-dev` | 3000 | NestJS con `npm run dev` (watch) |

### Día a día

```bash
# Levantar todo
make up-dev

# Ver logs de NestJS en tiempo real (en otra terminal)
make logs-service SERVICE=app-nestjs-dev

# Parar todo al terminar el día
make down
```

---

## Verificar que hot-reload funciona

1. Levanta el entorno: `make up-dev`
2. Abre los logs: `make logs-service SERVICE=app-nestjs-dev`
3. Edita cualquier archivo `.ts` en `src/` y guarda
4. Verás en los logs:

```
[NestJS] File change detected. Restarting...
[NestJS] Application is running on: http://[::1]:3000
```

---

## ¿Necesito `node_modules` en local (en mi máquina)?

**Respuesta corta:** No es obligatorio para que Docker funcione, pero **sí es muy recomendable** tenerlo.

### Situaciones y comportamiento

| Situación | ¿Funciona Docker? | ¿Funciona el IDE? |
|-----------|:-----------------:|:-----------------:|
| Tienes `node_modules` en local | ✅ | ✅ Autocompletado, tipos, lint |
| No tienes `node_modules` en local | ✅ | ❌ Sin autocompletado, errores rojos en el IDE |

### Por qué Docker no necesita tu `node_modules` local

El `Dockerfile.dev` instala las dependencias **dentro de la imagen** al construirla:

```dockerfile
COPY package*.json ./
RUN npm install --legacy-peer-deps   # ← instala en el contenedor
```

Y el `docker-compose.yml` protege ese `node_modules` interno con un volumen anónimo:

```yaml
volumes:
  - .:/app              # monta TODO tu proyecto en el contenedor...
  - /app/node_modules   # ...pero este node_modules lo deja intacto (el del contenedor)
```

El segundo volumen hace que aunque tu carpeta local `.` se monte sobre `/app`,
el directorio `/app/node_modules` del contenedor **no se sobreescribe** con el tuyo.

### Por qué el IDE sí necesita tu `node_modules` local

Tu editor (VSCode, WebStorm, etc.) lee los tipos de TypeScript directamente
desde `node_modules/` en tu máquina. Sin esa carpeta:
- No hay autocompletado de NestJS, TypeORM, etc.
- Aparecen errores rojos en los imports aunque el código funcione perfectamente en Docker
- El linter no puede analizar el código

### Conclusión: ¿qué debes hacer?

```bash
# Instala las dependencias en local (una sola vez, o al añadir paquetes nuevos)
npm install --legacy-peer-deps
```

Esto no afecta al contenedor. Cada uno tiene su propio `node_modules` independiente.
El del contenedor puede ser diferente al tuyo (ej: binarios compilados para Linux
vs tu arquitectura local), pero el código TypeScript es el mismo.

---

## Cómo funciona internamente

El `docker-compose.yml` define el servicio `app-dev` con dos volúmenes:

```yaml
volumes:
  - .:/app              # ← Todo el proyecto montado en el contenedor
  - /app/node_modules   # ← node_modules del contenedor (no sobreescrito por el host)
```

- El primer volumen sincroniza en tiempo real cualquier cambio de archivo.
- El segundo volumen es un "volumen anónimo" que protege los `node_modules`
  instalados dentro del contenedor de ser sobreescritos por los del host
  (que pueden ser de diferente arquitectura: arm64 vs amd64).

El `Dockerfile.dev` instala dependencias al construir la imagen y luego
arranca con `npm run dev`, que internamente usa `nest start --watch`.

---

## Ejecutar comandos dentro del contenedor

A veces necesitas correr algo puntualmente (tests, migraciones, lint):

```bash
# Forma corta con el Makefile
make exec CMD="npm test"
make exec CMD="npm run lint"
make exec CMD="npm run migration:run"

# O abrir una shell interactiva
make shell
# Ya dentro del contenedor:
# /app $ npm test
# /app $ exit
```

---

## Entornos disponibles

```
make up       → Producción: imagen multi-stage, dist/ compilado, node dist/main
make up-dev   → Desarrollo: código montado, hot-reload, npm run dev
```

Nunca uses `make up` para desarrollar: esa imagen no tiene watch mode
y requeriría rebuild ante cada cambio.


