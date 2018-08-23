#!/bin/bash

echo deploying bedrijvenatlas...

export METEOR_SETTINGS="$(cat ./settings-rh.json)"
export ROOT_URL=http://192.168.99.100
export VERSION=1.0.5
export GEMEENTE=gemeente-rijssen-holten

docker-compose \
	-p rh \
	up -d
