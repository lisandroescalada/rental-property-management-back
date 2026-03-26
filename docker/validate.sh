#!/bin/bash
# Script de validación de la configuración Docker
echo ""
echo "🔍 Validando configuración Docker..."
echo ""
ERRORS=0
WARNINGS=0
# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'
echo -e "${BLUE}📋 Validando archivos principales:${NC}"
echo ""
# Verificar archivo raíz
if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✅${NC} docker-compose.yml existe"
else
    echo -e "${RED}❌${NC} docker-compose.yml NO encontrado"
    ((ERRORS++))
fi
if [ -f ".env" ]; then
    echo -e "${GREEN}✅${NC} .env existe"
else
    echo -e "${YELLOW}⚠️${NC}  .env NO encontrado (usa .env.example)"
    ((WARNINGS++))
fi
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✅${NC} .env.example existe"
else
    echo -e "${RED}❌${NC} .env.example NO encontrado"
    ((ERRORS++))
fi
if [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✅${NC} Dockerfile existe"
else
    echo -e "${RED}❌${NC} Dockerfile NO encontrado"
    ((ERRORS++))
fi
echo ""
echo -e "${BLUE}📁 Validando carpeta docker/:${NC}"
echo ""
# Verificar archivos en docker/
if [ -f "docker/nginx.conf" ]; then
    echo -e "${GREEN}✅${NC} docker/nginx.conf existe"
else
    echo -e "${RED}❌${NC} docker/nginx.conf NO encontrado"
    ((ERRORS++))
fi
if [ -f "docker/generate-ssl.sh" ]; then
    echo -e "${GREEN}✅${NC} docker/generate-ssl.sh existe"
    if [ -x "docker/generate-ssl.sh" ]; then
        echo -e "${GREEN}✅${NC}   └─ Tiene permisos de ejecución"
    else
        echo -e "${YELLOW}⚠️${NC}   └─ Sin permisos de ejecución (chmod +x)"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}❌${NC} docker/generate-ssl.sh NO encontrado"
    ((ERRORS++))
fi
if [ -f "docker/docker-helper.sh" ]; then
    echo -e "${GREEN}✅${NC} docker/docker-helper.sh existe"
    if [ -x "docker/docker-helper.sh" ]; then
        echo -e "${GREEN}✅${NC}   └─ Tiene permisos de ejecución"
    else
        echo -e "${YELLOW}⚠️${NC}   └─ Sin permisos de ejecución (chmod +x)"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}❌${NC} docker/docker-helper.sh NO encontrado"
    ((ERRORS++))
fi
if [ -f "docker/sql/init.sql" ]; then
    echo -e "${GREEN}✅${NC} docker/sql/init.sql existe"
else
    echo -e "${RED}❌${NC} docker/sql/init.sql NO encontrado"
    ((ERRORS++))
fi
echo ""
echo -e "${BLUE}📚 Validando documentación:${NC}"
echo ""
if [ -f "docs/DOCKER_SETUP.md" ]; then
    echo -e "${GREEN}✅${NC} docs/DOCKER_SETUP.md existe"
else
    echo -e "${RED}❌${NC} docs/DOCKER_SETUP.md NO encontrado"
    ((ERRORS++))
fi
if [ -f "docker/README.md" ]; then
    echo -e "${GREEN}✅${NC} docker/README.md existe"
else
    echo -e "${RED}❌${NC} docker/README.md NO encontrado"
    ((ERRORS++))
fi
echo ""
echo -e "${BLUE}🔐 Validando certificados SSL:${NC}"
echo ""
if [ -d "docker/ssl" ]; then
    echo -e "${GREEN}✅${NC} Directorio docker/ssl existe"
    if [ -f "docker/ssl/certs/certificate.crt" ] && [ -f "docker/ssl/private/certificate.key" ]; then
        echo -e "${GREEN}✅${NC}   └─ Certificados SSL generados"
    else
        echo -e "${YELLOW}⚠️${NC}   └─ Certificados SSL NO generados (ejecuta: bash docker/generate-ssl.sh)"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠️${NC}  Directorio docker/ssl NO existe (será creado al generar certificados)"
    ((WARNINGS++))
fi
echo ""
echo -e "${BLUE}🔧 Validando configuración:${NC}"
echo ""
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅${NC} docker-compose está instalado"
    # Validar sintaxis de docker-compose.yml
    if docker-compose config > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}   └─ docker-compose.yml es válido"
    else
        echo -e "${RED}❌${NC}   └─ docker-compose.yml tiene errores"
        docker-compose config 2>&1 | head -20
        ((ERRORS++))
    fi
else
    echo -e "${RED}❌${NC} docker-compose NO está instalado"
    ((ERRORS++))
fi
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅${NC} Docker está instalado"
else
    echo -e "${RED}❌${NC} Docker NO está instalado"
    ((ERRORS++))
fi
if command -v openssl &> /dev/null; then
    echo -e "${GREEN}✅${NC} OpenSSL está instalado (necesario para SSL)"
else
    echo -e "${YELLOW}⚠️${NC}  OpenSSL NO está instalado (necesario para generar certificados SSL)"
    ((WARNINGS++))
fi
echo ""
echo "═════════════════════════════════════════════════════════════════"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✨ ¡VALIDACIÓN EXITOSA! ✨${NC}"
    echo ""
    echo "La configuración Docker está lista. Próximos pasos:"
    echo "  1. bash docker/generate-ssl.sh     (generar certificados)"
    echo "  2. docker-compose up -d            (iniciar servicios)"
    echo "  3. docker-compose ps               (verificar estado)"
    echo ""
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  VALIDACIÓN CON ADVERTENCIAS${NC}"
    echo ""
    echo "Se encontraron $WARNINGS advertencia(s) pero la configuración es funcional."
    echo ""
else
    echo -e "${RED}❌ VALIDACIÓN FALLIDA${NC}"
    echo ""
    echo "Se encontraron $ERRORS error(es) y $WARNINGS advertencia(s)."
    echo "Por favor, revisa los errores arriba."
    echo ""
    exit 1
fi
