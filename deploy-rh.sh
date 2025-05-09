#!/bin/bash

echo deploying bedrijvenatlas Rijssen-Holten...

export BA_VERSION=1.4.1
export FUNDA_SCRAPER_VERSION=1.4.7

export REACT_APP_SETTINGS="$(cat ./settings-rh.json)"
export GEMEENTE=gemeente-rijssen-holten
export BEDRIJVENTERREINEN_FEATURE_BOUNDS="https://rijssen-holten-pub.geopublisher.nl/geoserver/Bedrijvenatlas/wfs?SERVICE=WFS&version=1.1.0&request=GetFeature&typeName=Bedrijvenatlas:Bedrijventerreinen_Rijssen-Holten&outputFormat=application/json&bbox=220846,474494,237209,484108"

export COMPOSE_TLS_VERSION=TLSv1_2

docker compose -p dev up -d
