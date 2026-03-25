# URLs y Acceso al Backend NestJS

## 🌐 URLs Principales

### API Base
```
http://localhost:3000
```

### Health Check Endpoint
```
GET http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-25T07:39:33.000Z",
  "message": "Rental Property Management Backend is running"
}
```

---

## 📚 Documentación Swagger/OpenAPI

### 📍 URL de Swagger UI
```
http://localhost:3000/api/docs
```

**Características:**
- ✅ Interfaz gráfica para probar endpoints
- ✅ Documentación automática desde decoradores
- ✅ Soporte para autenticación Bearer JWT
- ✅ Especificación OpenAPI 3.0
- ✅ Descarga de especificación JSON

### 📖 JSON de Especificación OpenAPI
```
http://localhost:3000/api-json
```

---

## 🔑 Autenticación

### Bearer Token en Swagger
1. Obtener un JWT del endpoint de login (cuando se implemente)
2. Hacer clic en el botón **"Authorize"** (con icono de candado)
3. Pegar el token en el campo: `Bearer <tu_token_aqui>`
4. Hacer clic en **"Authorize"**
5. Todos los requests posteriores incluirán el header:
   ```
   Authorization: Bearer <tu_token>
   ```

---

## 📡 Estructura de Respuestas

### Exitosa (200)
```json
{
  "status": "ok",
  "timestamp": "2026-03-25T07:39:33.000Z",
  "message": "Rental Property Management Backend is running"
}
```

### Error de Validación (400)
```json
{
  "statusCode": 400,
  "message": [
    "email debe ser un email válido",
    "password debe tener al menos 8 caracteres"
  ],
  "error": "Bad Request"
}
```

### No Autenticado (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### No Encontrado (404)
```json
{
  "statusCode": 404,
  "message": "Not Found"
}
```

---

## 🚀 Iniciar el Servidor

### En Modo Desarrollo (Watch Mode)
```bash
make nest-dev
```

**Output:**
```
> rental-property-management-back@1.0.0 dev
> nest start --watch

[Nest] 12345 - 03/25/2026, 7:39:33 AM   LOG [NestFactory] Starting Nest application...
...
╔═══════════════════════════════════════════════════════════╗
║   Rental Property Management Backend - Iniciado           ║
╠═══════════════════════════════════════════════════════════╣
║ Ambiente:     DEVELOPMENT                                 ║
║ Puerto:       3000                                        ║
║ URL Base:     http://localhost:3000                       ║
║ Swagger:      http://localhost:3000/api/docs              ║
╚═══════════════════════════════════════════════════════════╝
```

### En Modo Producción (Compilado)
```bash
npm run build  # Compilar
npm start      # Ejecutar dist/main.js
```

---

## 🔄 Docker + Backend

### Setup Completo (Recomendado)
```bash
make nest-full-setup
```

Esto ejecutará:
1. `npm install` - Instalar dependencias
2. `make up` - Levantar Docker Compose (MySQL)
3. `npm run build` - Compilar TypeScript

---

## 📊 Verificación Rápida

### 1. Verificar que el servidor está levantado
```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-25T08:00:00.000Z",
  "message": "Rental Property Management Backend is running"
}
```

### 2. Ver logs en tiempo real
```bash
make logs
```

### 3. Ver estado de servicios Docker
```bash
make ps
```

---

## ⚠️ Solución de Problemas

### "Connection refused" en http://localhost:3000
- El servidor no está levantado
- Solución: `make nest-dev`

### Swagger no carga en `/api/docs`
- Está con documentación no correcta
- Solución: Verificar que el servidor está levantado y sin errores
- Verificar: `http://localhost:3000/health`

### MySQL no conecta
- Docker no está levantado
- Solución: `make up`

### Cambios en código no se reflejan
- No está en modo watch
- Solución: Usar `make nest-dev` en lugar de `make nest-start`

---

## 🎯 Próximos Endpoints a Implementar

Cuando se creen módulos, aparecerán en Swagger automáticamente:

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login (obtener JWT)
- `GET /auth/profile` - Perfil del usuario actual
- `GET /properties` - Listar propiedades
- `POST /properties` - Crear propiedad
- `GET /rentals` - Listar alquileres
- Etc.

---

## 📝 Notas

- El puerto **3000** se define en la variable de entorno `PORT` del `.env`
- Swagger se configura en `src/main.ts`
- La ruta base es `/api/docs` (configurable)
- Todos los endpoints estarán documentados automáticamente en Swagger

