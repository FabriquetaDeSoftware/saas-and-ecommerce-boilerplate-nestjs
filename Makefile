run_production_docker:
	chmod +x shell/check_env_vars.sh
	./shell/check_env_vars.sh 
	docker-compose -f ./docker/composes/docker-compose.prod.yml --env-file ./.env up -d

run_development_docker:
	chmod +x shell/check_env_vars.sh
	./shell/check_env_vars.sh 
	docker-compose -f ./docker/composes/docker-compose.dev.yml --env-file ./.env up -d

run_test_docker:
	chmod +x shell/check_env_vars.sh
	./shell/check_env_vars.sh 
	docker-compose -f ./docker/composes/docker-compose.dev.yml --env-file ./.env down -v
	docker-compose -f ./docker/composes/docker-compose.dev.yml --env-file ./.env up -d
