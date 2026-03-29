# 📚 Índice de Documentación

## 🎯 Por dónde empezar

| Necesidad | Documento |
|-----------|-----------|
| Levantar el entorno por primera vez | [QUICKSTART.md](./QUICKSTART.md) |
| Entender el flujo de desarrollo con Docker | [DEV_WORKFLOW.md](./DEV_WORKFLOW.md) ⭐ |
| Entender la arquitectura del código | [ARCHITECTURE_USERS.md](./ARCHITECTURE_USERS.md) ⭐ |
| Referencia rápida de comandos `make` | [MAKEFILE_CHEATSHEET.md](./MAKEFILE_CHEATSHEET.md) |
| Setup detallado de Docker | [DOCKER_SETUP.md](./DOCKER_SETUP.md) |
| Guía completa (todo en uno) | [GUIA_COMPLETA.md](./GUIA_COMPLETA.md) |

---

## 📑 Documentación por Tema

### 🐳 Docker & Flujo de Desarrollo
- [DEV_WORKFLOW.md](./DEV_WORKFLOW.md) — **Hot-reload, cuándo hacer rebuild, comandos del día a día** ⭐
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) — Setup detallado de Docker y servicios
- [QUICKSTART.md](./QUICKSTART.md) — Inicio rápido (5 min)

### 🏛️ Arquitectura
- [ARCHITECTURE_USERS.md](./ARCHITECTURE_USERS.md) — **Arquitectura hexagonal + CQRS del módulo Users** ⭐

### 🚀 Backend NestJS
- [README-DEV.md](./README-DEV.md) — Guía de desarrollo NestJS
- [SETUP_NESTJS_COMPLETE.md](./SETUP_NESTJS_COMPLETE.md) — Detalles técnicos de instalación
- [INSTALLATION_SUMMARY.md](./INSTALLATION_SUMMARY.md) — Resumen de instalación

### 📡 API
- [API_URLS.md](./API_URLS.md) — Endpoints disponibles

### ⚙️ Makefile
- [MAKEFILE_CHEATSHEET.md](./MAKEFILE_CHEATSHEET.md) — Referencia rápida de comandos
- [MAKEFILE_NESTJS.md](./MAKEFILE_NESTJS.md) — Comandos NestJS específicos

---

## 🎬 Flujos comunes

### Primera vez en el proyecto
```bash
# 1. Leer DEV_WORKFLOW.md para entender el entorno
# 2. Ejecutar:
cp .env.example .env
bash docker/generate-ssl.sh
make up-dev
```

### Desarrollo diario
```bash
make up-dev                                    # levantar
make logs-service SERVICE=app-nestjs-dev       # ver logs
make down                                      # parar
```

### Añadir un paquete npm
```bash
npm install <paquete>       # en el host para actualizar package.json
make rebuild-dev            # reconstruir imagen del contenedor
```

### Entender un archivo de código
```
→ Leer ARCHITECTURE_USERS.md para entender en qué capa está cada archivo
  y qué responsabilidad tiene.
```

---

## 📊 Referencia rápida

| Necesidad | Documento | Tiempo |
|-----------|-----------|--------|
| Levantar el entorno | [QUICKSTART.md](./QUICKSTART.md) | 5 min |
| Hot-reload / flujo dev | [DEV_WORKFLOW.md](./DEV_WORKFLOW.md) | 10 min |
| Entender la arquitectura | [ARCHITECTURE_USERS.md](./ARCHITECTURE_USERS.md) | 20 min |
| Comandos `make` | [MAKEFILE_CHEATSHEET.md](./MAKEFILE_CHEATSHEET.md) | 5 min |
| Setup detallado Docker | [DOCKER_SETUP.md](./DOCKER_SETUP.md) | 15 min |
| Todo en uno | [GUIA_COMPLETA.md](./GUIA_COMPLETA.md) | — |

---

**Última actualización:** 2026-03-25

Recomendación: **Lee [GUIA_COMPLETA.md](./GUIA_COMPLETA.md)** 👈

