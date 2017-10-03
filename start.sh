#!/bin/bash

echo deploying bedrijvenatlas...

export METEOR_SETTINGS="$(cat ./settings.json)"
export ROOT_URL=http://yourapp.com
export VERSION=0.1.0

docker-compose \
	-p rh \
	up -d
