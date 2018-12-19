#!/bin/bash

if [ ! -z $1 ]; then
    if [ $1 == berkelland ]; then
        echo "Image berkelland aan het bouwen ..."
        docker build --pull --no-cache -f Dockerfile-berkelland -t idgis/bedrijvenatlas-berkelland .
    elif [ $1 == rijssenholten ]; then
        echo "Image rijssenholten aan het bouwen ..."
        docker build --pull --no-cache -f Dockerfile-rh -t idgis/bedrijvenatlas-rh .
    else
        echo "Onbekende omgeving opgegeven. Kies 'berkelland' of 'rijssenholten'."
        exit 0
    fi
else
    echo "Geen omgeving opgegeven. Kies 'berkelland' of 'rijssenholten'."
    exit 0
fi
