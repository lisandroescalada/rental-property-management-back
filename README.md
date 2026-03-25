# 🏠 Rental Property Management - Backend

Backend NestJS + Docker para gestión de propiedades en alquiler.

---

## 📚 Documentación

**👉 [VER DOCUMENTACIÓN COMPLETA](./docs/GUIA_COMPLETA.md)** ⭐

Documentación unificada que contiene:
- ⚡ Inicio rápido (5 minutos)
- 🐳 Docker setup completo
- 🎯 Backend NestJS
- 📡 Todos los servicios
- 🛠️ Comandos útiles
- 🆘 Troubleshooting

---

## ⚡ Quick Start (5 minutos)

```bash
# 1. Generar certificados SSL
bash docker/generate-ssl.sh

# 2. Levantar Docker
docker-compose up -d

# 3. Instalar dependencias NestJS
npm install --legacy-peer-deps

# 4. Compilar
npm run build

# 5. Ejecutar en desarrollo
npm run dev
```

**Luego abre:** http://localhost:3000/api/docs

---

## 📖 Documentación Rápida

| Recurso | Descripción |
|---------|-------------|
| [📚 GUIA_COMPLETA.md](./docs/GUIA_COMPLETA.md) | **Todo en un archivo** - Recomendado |
| [📑 DOCUMENTACION_INDEX.md](./docs/DOCUMENTACION_INDEX.md) | Índice de todas las documentaciones |
| [🐳 DOCKER_SETUP.md](./docs/DOCKER_SETUP.md) | Setup específico de Docker |
| [🎯 QUICK_START.md](./docs/QUICK_START.md) | Quick start NestJS |
| [📡 API_URLS.md](./docs/API_URLS.md) | Endpoints disponibles |
| [🛠️ Makefile](./Makefile) | Comandos disponibles |

---

## 🌐 URLs Principales

```
API Base:          http://localhost:3000
Swagger Docs:      http://localhost:3000/api/docs
Health Check:      http://localhost:3000/health
phpMyAdmin:        http://localhost:8080
MySQL:             localhost:3306
```

---

## 📦 Stack Tecnológico

**Backend:** NestJS 11 + TypeScript  
**Base de Datos:** MySQL 8.0 + TypeORM  
**Autenticación:** JWT + Passport  
**API Docs:** Swagger/OpenAPI  
**DevOps:** Docker + Docker Compose  

---

## 🎯 Características

✅ API RESTful  
✅ Autenticación JWT  
✅ Base de datos MySQL  
✅ Documentación Swagger automática  
✅ Validación de datos  
✅ Docker Compose setup  
✅ Sistema de migraciones  
✅ Testing con Jest  

---

## 🚀 Próximos Pasos

1. **Lee la documentación:** [GUIA_COMPLETA.md](./docs/GUIA_COMPLETA.md)
2. **Ejecuta el setup:** Copia el Quick Start arriba
3. **Abre Swagger:** http://localhost:3000/api/docs
4. **Crea módulos:** `nest generate module modules/users`

---

## 📝 Licencia

ISC

---

**Última actualización:** 2026-03-25  
**Status:** ✅ Completado y funcionando

