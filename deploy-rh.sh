#!/bin/bash

echo deploying bedrijvenatlas Rijssen-Holten...

export METEOR_SETTINGS="$(cat ./settings-rh.json)"
export ROOT_URL=http://192.168.99.100
export IMAGE_GEMEENTE=rh
export VERSION=1.0.5
export GEMEENTE=gemeente-rijssen-holten

export FUNDA_SCRAPER_VERSION=1.1.2

docker-compose \
	-p rh \
	up -d
