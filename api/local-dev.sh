#!/bin/zsh
docker volume create graintrack-postgres-data 2> /dev/null
docker run -d --name postgres --env-file ../.env -p 5432:5432 -v graintrack-postgres-data:/var/lib/postgresql/data postgres:18-alpine 2> /dev/null
docker start postgres 2> /dev/null
npm run dev