#!/usr/bin/env bash

docker-compose down
# docker container prune -f
# docker image prune -f
# docker network prune -f
# docker volume prune -f
docker system prune -f
docker-compose up -d --build

# docker exec -it ollama  ollama pull qwen:0.5b-chat
# docker exec -it ollama  ollama pull tinyllama:chat
# docker exec -it ollama  ollama pull gemma:2b
# docker exec -it ollama  ollama pull llama2:7b
# docker exec -it ollama  ollama pull mistral
