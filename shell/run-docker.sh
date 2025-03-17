#!/bin/bash

# Carrega as variáveis do arquivo .env na raiz do projeto
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Arquivo .env não encontrado na raiz do projeto."
    exit 1
fi

# Verifica o ambiente usando a variável ENVIRONMENT
ENV=${ENVIRONMENT:-development}

echo "Ambiente detectado: $ENV"

if [ "$ENV" = "development" ] || [ "$ENV" = "dev" ]; then
    echo "Executando em ambiente de desenvolvimento..."
    cd docker/composes
    docker-compose -f docker-compose.dev.yml --env-file ../../.env up -d
    cd ../..
    echo "Containers de desenvolvimento iniciados com sucesso."
elif [ "$ENV" = "production" ] || [ "$ENV" = "prod" ]; then
    echo "Ambiente de produção detectado."
    echo "Para implementar a configuração de produção, crie docker-compose.prod.yml"
    # Exemplo: docker-compose -f docker/composes/docker-compose.prod.yml --env-file .env up -d
    echo "Por enquanto, a configuração para ambiente de produção não está sendo executada."
else
    echo "Ambiente '$ENV' não reconhecido. Use 'development/dev' ou 'production/prod'."
    exit 1
fi