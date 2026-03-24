#!/bin/bash
# Docker Helper Script
# Proporciona funciones útiles para gestionar los contenedores
set -e
# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
# Directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"
show_help() {
    cat << 'HELP'
Docker Helper Script - Gestor de contenedores
Uso: ./docker/docker-helper.sh [comando] [opciones]
Comandos:
    up              Inicia todos los servicios
    down            Detiene todos los servicios
    restart         Reinicia todos los servicios
    logs [servicio] Ver logs en vivo (opcional: mysql, app, nginx, phpmyadmin)
    status          Ver estado de los servicios
    clean           Detiene y elimina todo (incluyendo volúmenes)
    build           Reconstruye la imagen de la app
    ps              Lista contenedores activos
    mysql [cmd]     Ejecuta comando en MySQL
    app [cmd]       Ejecuta comando en la app
    ssl             Genera certificados SSL autofirmados
    help            Muestra esta ayuda
Ejemplos:
    ./docker/docker-helper.sh up
    ./docker/docker-helper.sh logs app
    ./docker/docker-helper.sh mysql mysql -u root -p
    ./docker/docker-helper.sh app npm run build
HELP
}
case "${1:-help}" in
    up)
        echo -e "${GREEN}▶ Iniciando servicios...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✅ Servicios iniciados${NC}"
        docker-compose ps
        ;;
    down)
        echo -e "${YELLOW}⏹ Deteniendo servicios...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Servicios detenidos${NC}"
        ;;
    restart)
        echo -e "${YELLOW}🔄 Reiniciando servicios...${NC}"
        docker-compose restart
        echo -e "${GREEN}✅ Servicios reiniciados${NC}"
        ;;
    logs)
        SERVICE="${2:-}"
        if [ -z "$SERVICE" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f "$SERVICE"
        fi
        ;;
    status)
        echo -e "${BLUE}📊 Estado de servicios:${NC}"
        docker-compose ps
        ;;
    clean)
        echo -e "${RED}⚠️  Esto eliminará todos los contenedores, redes y volúmenes${NC}"
        read -p "¿Estás seguro? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Limpiando...${NC}"
            docker-compose down -v
            echo -e "${GREEN}✅ Limpieza completada${NC}"
        else
            echo "Cancelado"
        fi
        ;;
    build)
        echo -e "${BLUE}🔨 Reconstruyendo imagen de app...${NC}"
        docker-compose up -d --build app
        echo -e "${GREEN}✅ App reconstruida${NC}"
        ;;
    ps)
        docker-compose ps
        ;;
    mysql)
        shift
        docker-compose exec mysql mysql "$@"
        ;;
    app)
        shift
        docker-compose exec app "$@"
        ;;
    ssl)
        echo -e "${BLUE}🔐 Generando certificados SSL...${NC}"
        bash "$SCRIPT_DIR/generate-ssl.sh"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}❌ Comando desconocido: $1${NC}"
        show_help
        exit 1
        ;;
esac
