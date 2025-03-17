#!/bin/bash

if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo ".env file not found in project root."
    exit 1
fi

ENV=${ENVIRONMENT:-development}

echo "Ambiente detectado: $ENV"

if [ "$ENV" = "development" ] || [ "$ENV" = "dev" ]; then
    echo "Running in development environment..."
    cd docker/composes
    docker-compose -f docker-compose.dev.yml --env-file ../../.env up -d
    cd ../..
    echo "Development containers launched successfully."
elif [ "$ENV" = "production" ] || [ "$ENV" = "prod" ]; then
    echo "Running in production environment..."
    cd docker/composes
    docker-compose -f docker-compose.prod.yml --env-file ../../.env up -d
    cd ../..
    echo "Production containers launched successfully."
else
    echo "Environment '$ENV' not recognized. Use 'development/dev' or 'production/prod'."
    exit 1
fi