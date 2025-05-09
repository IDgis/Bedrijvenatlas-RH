#!/bin/bash

cd /opt/src/app || exit

echo "===> Building ..."
npm run build --production

mkdir -p /tmp/funda-data
./copy-json-data.sh /usr/src/app/build/data /tmp/funda-data
cp -r /opt/src/app/build /usr/src/app
./copy-json-data.sh /tmp/funda-data /usr/src/app/build/data

rm -rf /opt/src/app/build
rm -rf /tmp/funda-data

cd /usr/src/app || exit
echo "===> Running ..."
exec serve -s build
