#!/bin/bash

if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Arquivo .env não encontrado na raiz do projeto."
    exit 1
fi

ENV=${ENVIRONMENT:-development}

echo "Ambiente detectado: $ENV"

if [ "$ENV" = "development" ] || [ "$ENV" = "dev" ]; then
    echo "Executando em ambiente de desenvolvimento..."
    cd docker/composes
    docker-compose -f docker-compose.dev.yml --env-file ../../.env up -d
    cd ../..
    echo "Containers de desenvolvimento iniciados com sucesso."
elif [ "$ENV" = "production" ] || [ "$ENV" = "prod" ]; then
    echo "Executando em ambiente de producao..."
    cd docker/composes
    docker-compose -f docker-compose.prod.yml --env-file ../../.env up -d
    cd ../..
    echo "Containers de desenvolvimento iniciados com sucesso."
else
    echo "Ambiente '$ENV' não reconhecido. Use 'development/dev' ou 'production/prod'."
    exit 1
fi