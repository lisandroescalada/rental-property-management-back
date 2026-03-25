# 📚 Documentación — Rental Property Management Backend

Bienvenido. Esta carpeta contiene toda la documentación del proyecto integrada.

## 🚀 Empieza Aquí

**👉 [GUIA_COMPLETA.md](./GUIA_COMPLETA.md)** — Guía unificada de Docker + NestJS (TODO en un archivo)

Contiene:
- ⚡ Inicio rápido (5 minutos)
- 🐳 Configuración de Docker
- 🎯 Backend NestJS
- 📡 Servicios disponibles
- 🛠️ Comandos útiles
- 🆘 Troubleshooting
- 🔐 Checklist de producción

---

## 📑 Documentación Específica (Legacy)

Si prefieres archivos separados por tema:

| Archivo | Contenido |
|---------|----------|
| [QUICKSTART.md](./QUICKSTART.md) | Arranque rápido de Docker |
| [DOCKER_SETUP.md](./DOCKER_SETUP.md) | Setup detallado de Docker |
| [QUICK_START.md](./QUICK_START.md) | Setup de NestJS |
| [SETUP_NESTJS_COMPLETE.md](./SETUP_NESTJS_COMPLETE.md) | Detalles técnicos NestJS |
| [INSTALLATION_SUMMARY.md](./INSTALLATION_SUMMARY.md) | Resumen de instalación |
| [API_URLS.md](./API_URLS.md) | URLs de la API |

---

## ⚡ Comando Rápido (copiar y pegar)

```bash
# Setup completo en 5 minutos
bash docker/generate-ssl.sh
docker-compose up -d
npm install --legacy-peer-deps
npm run build
npm run dev
```

Luego abre: **http://localhost:3000/api/docs**

---

## ✅ Checklist Rápido

- [ ] Docker instalado
- [ ] Node.js 20+ instalado
- [ ] Archivo `.env` configurado
- [ ] SSL generado: `bash docker/generate-ssl.sh`
- [ ] Docker iniciado: `docker-compose up -d`
- [ ] Dependencias: `npm install --legacy-peer-deps`
- [ ] Backend corriendo: `npm run dev`
- [ ] Swagger accesible: http://localhost:3000/api/docs

---

## 🎯 Próximos Pasos

1. Lee [GUIA_COMPLETA.md](./GUIA_COMPLETA.md)
2. Ejecuta el comando rápido arriba
3. Abre Swagger en tu navegador
4. Comienza a crear módulos con `nest generate`

---

**Última actualización:** 2026-03-25
