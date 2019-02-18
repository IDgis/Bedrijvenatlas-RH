#!/bin/bash

echo deploying Bedrijvenatlas ...

export BA_VERSION=1.2.0
export FUNDA_SCRAPER_VERSION=1.1.3

export REACT_APP_SETTINGS="$(cat ./settings-berkelland.json)"
export GEMEENTE=gemeente-berkelland
export BEDRIJVENTERREINEN_FEATURE_BOUNDS="https://geoserver.prvgld.nl/geoserver/IBIS/wfs?SERVICE=WFS&version=1.1.0&request=GetFeature&typeName=bedrijventerrein&outputFormat=application/json&bbox=220754,445975,251434,467576"

export COMPOSE_TLS_VERSION=TLSv1_2

docker-compose \
	-p bkl \
	up -d
