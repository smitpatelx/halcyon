docker-compose -f docker-compose-dev.yaml build --no-cache && docker-compose -f docker-compose-dev.yaml up
docker-compose -f docker-compose-dev.yaml build --no-cache && docker-compose -f docker-compose-dev.yaml up -d
docker-compose -f docker-compose-dev.yaml up -d
docker-compose -f docker-compose-dev.yaml down
docker-compose up -d