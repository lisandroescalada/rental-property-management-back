# Docker Setup - Guía de Uso

## 📋 Requisitos Previos

- Docker y Docker Compose instalados
- OpenSSL (para generar certificados SSL)
- Linux/macOS o WSL en Windows

## 🚀 Configuración Inicial

### 1. Generar Certificados SSL (Desarrollo Local)

```bash
bash docker/generate-ssl.sh
```

Esto creará certificados autofirmados en `docker/ssl/`. Los certificados son válidos por 365 días.

**Nota:** Para producción, usa certificados válidos emitidos por una autoridad certificadora.

### 2. Configurar Variables de Entorno

El archivo `.env` ya está configurado. Para personalizar valores:

```bash
cp .env.example .env
# Editar .env con tus valores
```

### 3. Iniciar los Servicios

```bash
docker-compose up -d
```

**Primera vez:** Espera ~1-2 minutos a que MySQL se inicialice.

## 📦 Servicios Disponibles

| Servicio | URL | Puerto | Usuario | Contraseña |
|----------|-----|--------|---------|-----------|
| MySQL | `mysql` | 3306 | `app_user` | `contraseñasegura` |
| phpMyAdmin | `http://localhost:8080` | 8080 | `app_user` | `contraseñasegura` |
| App (Next.js) | `http://localhost:3000` | 3000 | - | - |
| Nginx (HTTP) | `http://localhost` | 80 | - | - |
| Nginx (HTTPS) | `https://localhost` | 443 | - | - |

## 🔍 Comandos Útiles

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs en vivo
docker-compose logs -f [servicio]

# Reiniciar un servicio
docker-compose restart [servicio]

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes (⚠️ elimina datos de MySQL)
docker-compose down -v

# Reconstruir la imagen de la app
docker-compose up -d --build app

# Ejecutar comandos dentro de un contenedor
docker-compose exec app npm run [comando]
docker-compose exec mysql mysql -u root -p[contraseña] -e "SHOW DATABASES;"
```

## 📝 Estructura de Carpetas

```
docker/
├── sql/
│   └── init.sql          # Scripts SQL que se ejecutan al iniciar MySQL
├── nginx.conf            # Configuración de Nginx
├── ssl/
│   ├── certs/
│   │   └── certificate.crt
│   └── private/
│       └── certificate.key
└── generate-ssl.sh       # Script para generar certificados
```

## 🔐 Seguridad

### SSL/TLS
- Se redirige automáticamente HTTP → HTTPS
- Headers de seguridad incluidos (HSTS, X-Frame-Options, etc.)
- TLSv1.2 y TLSv1.3 habilitados

### Límites de Recursos
- MySQL: 512 MB
- App (Next.js): 512 MB
- phpMyAdmin: 256 MB
- Nginx: 256 MB

### Health Checks
Todos los servicios tienen health checks:
- **MySQL:** Verifica conexión cada 10s
- **phpMyAdmin:** Verifica HTTP cada 30s
- **App:** Verifica puerto 3000 cada 15s
- **Nginx:** Verifica puerto 80 cada 30s

## ⚠️ Problemas Comunes

### Puertos en uso
Si los puertos 80, 443, 3000 u 8080 están en uso:
```yaml
# Edita docker-compose.yml:
ports:
  - "8000:80"  # Puerto host:Puerto contenedor
```

### MySQL no inicia
```bash
# Ver logs de MySQL
docker-compose logs mysql

# Eliminar volumen y reintentar
docker-compose down -v
docker-compose up -d mysql
```

### Certificados SSL no encontrados
```bash
# Regenerar certificados
rm -rf docker/ssl
bash docker/generate-ssl.sh
docker-compose restart nginx
```

### Conexión rechazada a MySQL desde app
- Espera a que MySQL esté health (ver `docker-compose ps`)
- Usa `mysql` como host (no localhost)
- Verifica .env con credenciales correctas

## 📊 Monitoreo

### Ver health status
```bash
docker-compose ps
# Busca "(healthy)" o "(starting)"
```

### Inspeccionar red
```bash
docker network ls
docker network inspect app-network
```

### Estadísticas de contenedores
```bash
docker stats
```

## 🧹 Limpieza

```bash
# Eliminar solo contenedores y redes
docker-compose down

# Eliminar todo incluyendo volúmenes
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all
```

## 📚 Recursos Adicionales

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [Next.js Docs](https://nextjs.org/docs)

