#!/bin/bash

echo deploying bedrijvenatlas...

export METEOR_SETTINGS="$(cat ./settings.json)"
export ROOT_URL=http://192.168.99.100
export VERSION=1.0.2

docker-compose \
	-p rh \
	up -d
