docker-compose -f docker-compose-dev.yml build --no-cache && docker-compose -f docker-compose-dev.yml up
docker-compose -f docker-compose-dev.yml build --no-cache && docker-compose -f docker-compose-dev.yml up -d
docker-compose -f docker-compose-dev.yml up -d
docker-compose -f docker-compose-dev.yml down
docker-compose up -d