# 🚀 Rental Property Management - Backend

Backend NestJS + Docker para gestión de propiedades en alquiler.

---

## 📚 Documentación

**👉 [Ver documentación completa aquí](./docs/GUIA_COMPLETA.md)**

La documentación está unificada en un único archivo que contiene:
- Inicio rápido (5 minutos)
- Docker setup
- NestJS backend
- Todos los comandos
- Troubleshooting

---

## ⚡ Quick Start

```bash
# 1. Generar SSL
bash docker/generate-ssl.sh

# 2. Iniciar Docker
docker-compose up -d

# 3. Instalar dependencias
npm install --legacy-peer-deps

# 4. Compilar
npm run build

# 5. Ejecutar en desarrollo
npm run dev
```

Luego accede a: **http://localhost:3000/api/docs**

---

## 📦 Stack Tecnológico

**Backend:**
- NestJS 11.1.17
- TypeScript
- Express

**Base de Datos:**
- MySQL 8.0
- TypeORM

**Autenticación:**
- JWT
- Passport

**Documentación:**
- Swagger/OpenAPI

**DevOps:**
- Docker
- Docker Compose
- Nginx

---

## 🎯 Características

✅ API RESTful completa  
✅ Autenticación con JWT  
✅ Base de datos MySQL con TypeORM  
✅ Documentación automática con Swagger  
✅ Validación de datos integrada  
✅ Docker Compose para desarrollo  
✅ Sistema de migraciones  
✅ Testing con Jest  

---

## 🔗 URLs Principales

| Servicio | URL |
|----------|-----|
| **API Base** | http://localhost:3000 |
| **Swagger Docs** | http://localhost:3000/api/docs |
| **Health Check** | http://localhost:3000/health |
| **phpMyAdmin** | http://localhost:8080 |
| **MySQL** | localhost:3306 |

---

## 📖 Más Información

- [📚 Documentación Completa](./docs/GUIA_COMPLETA.md)
- [🐳 Docker Setup](./docs/DOCKER_SETUP.md)
- [🎯 NestJS Quick Start](./docs/QUICK_START.md)
- [🛠️ Makefile Commands](./Makefile)

---

## 🤝 Contribuir

1. Crea una rama: `git checkout -b feature/tu-feature`
2. Commit: `git commit -m "feat: descripción"`
3. Push: `git push origin feature/tu-feature`
4. Pull Request

---

## 📝 Licencia

ISC

