# 🚀 Referencia Rápida - Logs de Compilación

## Los 3 Comandos Que Necesitas

```bash
# 1. Ver últimos logs (lo más rápido)
make logs-build

# 2. Ver logs en tiempo real (mientras compilas)
make logs-app

# 3. Ver todo los servicios
make logs
```

---

## Ejemplo de Uso Real

```bash
# Terminal 1: Ve logs en vivo
$ make logs-app

# Terminal 2: Compila
$ make build

# En Terminal 1 verás:
# ✨ Compilation successful
# [Nest] 12345  - 26/03/2026, 15:30:45 LOG [NestFactory] Starting...
```

---

## Atajos útiles

```bash
# Ver solo errores
docker compose logs app | grep ERROR

# Ver últimas 50 líneas
docker compose logs app | tail -50

# Buscar palabra específica
docker compose logs app | grep "mi palabra"
```

¡Eso es todo! 🎉

