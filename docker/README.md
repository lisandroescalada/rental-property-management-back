# 🐳 Docker - README

Este directorio contiene la configuración de Docker Compose para el proyecto.

## 📁 Contenido

- `docker-compose.yml` - Configuración principal de servicios
- `Dockerfile` - Imagen para NestJS
- `nginx.conf` - Configuración del reverse proxy
- `generate-ssl.sh` - Script para generar certificados SSL
- `docker-helper.sh` - Funciones auxiliares
- `sql/init.sql` - Scripts SQL iniciales
- `ssl/` - Certificados SSL generados

## 🚀 Uso Rápido

```bash
# Ver estado
docker compose ps

# Ver logs
docker compose logs -f app

# Parar
docker compose down

# Reconstruir
docker compose up -d --build
```

## 📚 Más Información

Ver documentación en `docs/` del proyecto raíz.

