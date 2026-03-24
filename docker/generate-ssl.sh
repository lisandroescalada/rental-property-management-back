#!/bin/bash
# Script para generar certificados SSL autofirmados para desarrollo local

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SSL_DIR="$SCRIPT_DIR/ssl"

# Crear directorio si no existe
mkdir -p "$SSL_DIR/certs"
mkdir -p "$SSL_DIR/private"

# Verificar si los certificados ya existen
if [ -f "$SSL_DIR/certs/certificate.crt" ] && [ -f "$SSL_DIR/private/certificate.key" ]; then
    echo "✅ Los certificados SSL ya existen en: $SSL_DIR"
    exit 0
fi

echo "🔐 Generando certificados SSL autofirmados..."

# Generar clave privada y certificado autofirmado
openssl req -x509 -newkey rsa:4096 -keyout "$SSL_DIR/private/certificate.key" \
    -out "$SSL_DIR/certs/certificate.crt" -days 365 -nodes \
    -subj "/C=ES/ST=State/L=City/O=Organization/CN=localhost"

echo "✅ Certificados generados exitosamente en: $SSL_DIR"
echo "   - Clave privada: $SSL_DIR/private/certificate.key"
echo "   - Certificado: $SSL_DIR/certs/certificate.crt"
echo ""
echo "⚠️  NOTA: Estos certificados son autofirmados y solo para desarrollo local."
echo "   En producción, usa certificados válidos emitidos por una autoridad certificadora."

