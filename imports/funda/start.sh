#!/bin/bash

if [ ! -d /root/Desktop/Funda ]; then
    mkdir /root/Desktop/Funda
fi
if [ ! -d /root/Desktop/Funda/Koop ]; then
    mkdir /root/Desktop/Funda/Koop
fi
if [ ! -d /root/Desktop/Funda/Huur ]; then
    mkdir /root/Desktop/Funda/Huur
fi

for i in {1..5}
do
    echo "Download Funda Rijssen te koop page $i"
    if [ -e /root/Desktop/Funda/Koop/Rijssen$i.html ]; then
        rm /root/Desktop/Funda/Koop/Rijssen$i.html
    fi
    /root/Desktop/savePages.sh "https://fundainbusiness.nl/alle-bedrijfsaanbod/rijssen/koop/p$i/" -b "firefox" -d "/root/Desktop/Funda/Koop/Rijssen$i.html"
    sleep 5s

    echo "Download Funda Rijssen te huur page $i"
    if [ -e /root/Desktop/Funda/Huur/Rijssen$i.html ]; then
        rm /root/Desktop/Funda/Huur/Rijssen$i.html
    fi
    /root/Desktop/savePages.sh "https://fundainbusiness.nl/alle-bedrijfsaanbod/rijssen/huur/p$i/" -b "firefox" -d "/root/Desktop/Funda/Huur/Rijssen$i.html"
    sleep 5s

    echo "Download Funda Holten te koop page $i"
    if [ -e /root/Desktop/Funda/Koop/Holten$i.html ]; then
        rm /root/Desktop/Funda/Koop/Holten$i.html
    fi
    /root/Desktop/savePages.sh "https://fundainbusiness.nl/alle-bedrijfsaanbod/holten/koop/p$i/" -b "firefox" -d "/root/Desktop/Funda/Koop/Holten$i.html"
    sleep 5s

    echo "Download Funda Holten te huur page $i"
    if [ -e /root/Desktop/Funda/Huur/Holten$i.html ]; then
        rm /root/Desktop/Funda/Huur.Holten$i.html
    fi
    /root/Desktop/savePages.sh "https://fundainbusiness.nl/alle-bedrijfsaanbod/holten/huur/p$i/" -b "firefox" -d "/root/Desktop/Funda/Huur/Holten$i.html"
    sleep 5s
done

echo "Finished downloading pages..."

echo "-----------------------------"

echo "Parsing downloaded pages..."
nodejs /root/Desktop/parser.js
sleep 10s
echo "Parsing finished..."

echo "-----------------------------"

echo "Geocoding json files..."
nodejs /root/Desktop/geocode.js
sleep 5s
echo "Geocoding finished..."

echo "-----------------------------"

if [ -d /root/Desktop/Funda ]; then
    rm -rf /root/Desktop/Funda
fi

echo "FINISHED"