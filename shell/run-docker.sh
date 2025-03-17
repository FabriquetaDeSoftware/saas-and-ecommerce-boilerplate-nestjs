#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CHECK_ENV_SCRIPT="$SCRIPT_DIR/check_env_vars.sh"
if [ -f "$CHECK_ENV_SCRIPT" ]; then
    bash "$CHECK_ENV_SCRIPT"

    if [ $? -ne 0 ]; then
        echo "Environment check failed. Aborting."
        exit 1
    fi
else
    echo "check_env_vars.sh not found in $SCRIPT_DIR. Proceeding without environment check."
fi

ENV_FILE="$SCRIPT_DIR/../.env"

if [ -f "$ENV_FILE" ]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    echo ".env file not found in project root."
    exit 1
fi

ENV=$ENVIRONMENT
echo "Environment detected: $ENV"

if [ "$ENV" = "development" ] || [ "$ENV" = "dev" ]; then
    echo "Dockerfile detected: Dockerfile.dev"
    echo "Docker Compose detected: docker-compose.dev.yml"

    cd docker/composes
    docker-compose -f docker-compose.dev.yml --env-file ../../.env up -d
    cd ../..

    echo "Development containers launched successfully."
elif [ "$ENV" = "production" ] || [ "$ENV" = "prod" ]; then
    echo "Dockerfile detected: Dockerfile.dev"
    echo "Docker Compose detected: docker-compose.dev.yml"

    cd docker/composes
    docker-compose -f docker-compose.prod.yml --env-file ../../.env up -d
    cd ../..

    echo "Production containers launched successfully."
else
    echo "Environment '$ENV' not recognized. Use 'development/dev' or 'production/prod'."
    exit 1
fi
