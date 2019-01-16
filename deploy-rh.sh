#!/bin/bash

echo deploying bedrijvenatlas Rijssen-Holten...

export METEOR_SETTINGS="$(cat ./settings-rh.json)"
export ROOT_URL=http://192.168.99.100
export IMAGE_GEMEENTE=rh
export BA_VERSION=1.1.3
export GEMEENTE=gemeente-rijssen-holten
export BEDRIJVENTERREINEN_FEATURE_BOUNDS="https://rijssen-holten-pub.geopublisher.nl/geoserver/Bedrijvenatlas/wfs?SERVICE=WFS&version=1.1.0&request=GetFeature&typeName=Bedrijvenatlas:Bedrijventerreinen_Rijssen-Holten&outputFormat=application/json&bbox=220846,474494,237209,484108"

export FUNDA_SCRAPER_VERSION=1.1.3

docker-compose \
	-p rh \
	up -d
