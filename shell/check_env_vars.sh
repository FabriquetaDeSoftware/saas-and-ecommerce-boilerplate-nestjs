#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env"

if [ -f "$ENV_FILE" ]; then
    echo "Loading variables from the file .env"
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    echo ".env file not found in $ENV_FILE"
    exit 1
fi

REQUIRED_VARS=("POSTGRES_USER" "POSTGRES_PASSWORD" "POSTGRES_DB" "DATABASE_URL" "SECRET_ACCESS_TOKEN_KEY" "SECRET_REFRESH_TOKEN_KEY" "SECRET_RECOVERY_PASSWORD_TOKEN_KEY" "PORT_API" "MAPPED_PORT_NGINX" "ENCRYPT_PASSWORD" "ENCRYPT_SALT" "EMAIL_FROM" "EMAIL_HOST" "EMAIL_PORT" "EMAIL_USER" "EMAIL_PASSWORD" "STRIPE_SECRET_KEY" "STRIPE_WEBHOOK_SECRET" "ENVIRONMENT" "MAPPED_PORT_JAEGER_UI")

echo "Checking required environment variables..."
MISSING_VARS=()

for VAR in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        MISSING_VARS+=("$VAR")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "Error: The following required environment variables are missing:"
    for VAR in "${MISSING_VARS[@]}"; do
        echo "- $VAR"
    done
    echo "Please set these variables in the .env file and try again.."
    exit 1
fi

echo "All required environment variables are present."
echo "Continuing with the execution..."
