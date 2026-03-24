# 🚀 Quick Start - Rental Property Management
## ⚡ Inicio Rápido (5 minutos)
### 1️⃣ Generar Certificados SSL
```bash
bash docker/generate-ssl.sh
```
✅ Crea certificados autofirmados válidos por 365 días
### 2️⃣ Iniciar Servicios
```bash
docker-compose up -d
```
✅ Inicia MySQL, phpMyAdmin, App (Next.js) y Nginx
### 3️⃣ Verificar Estado
```bash
docker-compose ps
```
✅ Todos deben estar con estado "healthy"
---
## 📊 Acceder a los Servicios
| Servicio | URL | Credenciales |
|----------|-----|---|
| **App** | http://localhost:3000 | - |
| **phpMyAdmin** | http://localhost:8080 | user: `app_user` / pass: `contraseñasegura` |
| **MySQL** | localhost:3306 | user: `app_user` / pass: `contraseñasegura` |
| **Nginx (HTTP)** | http://localhost | → Redirige a HTTPS |
| **Nginx (HTTPS)** | https://localhost | Certificado autofirmado |
---
## 🛠️ Comandos Útiles
### Opción A: Usar el script helper (Recomendado)
```bash
./docker/docker-helper.sh up          # Iniciar
./docker/docker-helper.sh down        # Detener
./docker/docker-helper.sh logs app    # Ver logs de la app
./docker/docker-helper.sh status      # Estado
./docker/docker-helper.sh restart     # Reiniciar
./docker/docker-helper.sh build       # Reconstruir app
./docker/docker-helper.sh clean       # Limpieza total
```
### Opción B: Usar docker-compose directamente
```bash
docker-compose up -d          # Iniciar
docker-compose down           # Detener
docker-compose logs -f        # Ver logs
docker-compose ps             # Estado
docker-compose restart        # Reiniciar
```
---
## 📚 Documentación Completa
- **DOCKER_SETUP.md** - Guía detallada de instalación y configuración
- **CAMBIOS_DOCKER.md** - Resumen de todos los cambios realizados
- **docker/README.md** - Información sobre la carpeta docker/
---
## 🆘 Troubleshooting
### Puertos en uso
```bash
# Cambiar puerto en docker-compose.yml
# Ejemplo: puertos: "8000:80" en lugar de "80:80"
```
### MySQL no inicia
```bash
docker-compose logs mysql
docker-compose down -v
docker-compose up -d mysql
```
### Ver configuración
```bash
bash docker/validate.sh    # Validar setup
docker-compose config      # Ver configuración final
```
---
## 🎯 Próximos Pasos
1. ✅ Generar certificados: `bash docker/generate-ssl.sh`
2. ✅ Iniciar servicios: `docker-compose up -d`
3. ✅ Verificar: `docker-compose ps`
4. ✅ Acceder a la app: http://localhost:3000
¡Listo para desarrollar! 🎉
