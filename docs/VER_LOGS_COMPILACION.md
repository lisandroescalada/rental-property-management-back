# 📝 Ver Logs de Compilación de NestJS

## 🎯 Comandos Rápidos

### Opción 1️⃣ - Ver últimos logs de compilación (más rápido)
```bash
make logs-build
```
Muestra las últimas 100 líneas de logs de compilación.

### Opción 2️⃣ - Ver logs en tiempo real (recomendado)
```bash
make logs-app
```
Muestra los logs en vivo mientras se compila (sigue actualizándose).

### Opción 3️⃣ - Ver logs de app específicamente
```bash
make logs-service SERVICE=app
```
Igual que `make logs-app`, es el alias completo.

### Opción 4️⃣ - Ver logs de todos los servicios
```bash
make logs
```
Muestra logs de MySQL, NestJS, nginx, etc.

---

## 🔄 Flujo Completo de Compilación con Logs

### Escenario: Quiero compilar y ver qué pasa

**Terminal 1 - Levanta servicios (si no están corriendo):**
```bash
make up
```
Espera 30-40 segundos a que se inicialicen.

**Terminal 2 - Ve logs en vivo (opcional pero recomendado):**
```bash
make logs-app
```

**Terminal 3 - Compila:**
```bash
make build
```

Verás en la Terminal 2 la salida de compilación en tiempo real:
```
app  | [Nest] PID  - 26/03/2026, 15:30:45     LOG [NestFactory] Starting Nest application...
app  | [Nest] PID  - 26/03/2026, 15:30:45     LOG [InstanceLoader] AppModule dependencies initialized
app  | ✨  Compilation successful
app  | [Nest] PID  - 26/03/2026, 15:30:46     LOG [NestApplication] Nest application successfully started
```

---

## 🐛 Debugging: Compilación Fallida

Si la compilación falla:

**Opción A - Ver últimos errores:**
```bash
make logs-build
```

**Opción B - Ver logs completos en tiempo real:**
```bash
make logs-app
```

**Opción C - Buscar error específico:**
```bash
docker compose logs app | grep -i error
```

---

## 📊 Comparación de Comandos

| Comando | Utilidad | Output | Uso |
|---|---|---|---|
| `make logs-build` | Ver compilación anterior | Últimas 100 líneas | Rápido, sin esperar |
| `make logs-app` | Ver en tiempo real | Continuo, actualizado | Mientras compilas |
| `make logs` | Ver todo | Todos los servicios | Debugging general |
| `make logs-service SERVICE=app` | Específico | Logs de app | Mismo que logs-app |
| `docker compose logs app \| tail -50` | Último 50 | Líneas personalizables | Custom |

---

## 🎬 Ejemplo Práctico

### Quiero ver qué pasó cuando compilé hace 5 minutos:
```bash
make logs-build
```

### Quiero compilar y ver todos los pasos:
```bash
# Terminal 1
make logs-app

# Terminal 2 (después de unos segundos)
make build
```

### Hay un error de TypeScript, quiero verlo:
```bash
make logs-app
# Y luego
make build
```

---

## 💾 Guardar Logs a un Archivo

Si necesitas guardar los logs para revisarlos después:

```bash
# Guardar logs de app a un archivo
docker compose logs app > app-logs.txt

# Guardar y abrir
docker compose logs app > app-logs.txt && cat app-logs.txt
```

---

## ⏱️ Limpiar Logs Antiguos

Si los logs se vuelven muy grandes:

```bash
# Limpiar todos los logs
docker compose logs --no-log-prefix | wc -l

# O simplemente recrear los contenedores (borra logs)
make rebuild
```

---

## ✅ Resumen

| Tarea | Comando |
|---|---|
| Ver compilación anterior | `make logs-build` |
| Ver en tiempo real | `make logs-app` |
| Ver todos los servicios | `make logs` |
| Buscar error específico | `docker compose logs app \| grep error` |
| Limpiar logs | `make rebuild` |

¡Listo! Ahora puedes monitorear la compilación de NestJS fácilmente. 🎉

