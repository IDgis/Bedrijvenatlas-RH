#!/usr/bin/env bash

cd /opt/src/app

echo "===> Building ..."
npm run build --production

cp -r /opt/src/app/build /usr/src/app
rm -rf /opt/src
cd /usr/src/app

echo "===> Running ..."
exec serve -s build
