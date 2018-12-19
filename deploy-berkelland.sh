#!/bin/bash

echo deploying bedrijvenatlas Berkelland...

export METEOR_SETTINGS="$(cat ./settings-berkelland.json)"
export ROOT_URL=http://192.168.99.100
export IMAGE_GEMEENTE=berkelland
export VERSION=1.0.5
export GEMEENTE=gemeente-berkelland

export FUNDA_SCRAPER_VERSION=1.1.2

docker-compose \
	-p bkl \
	up -d
