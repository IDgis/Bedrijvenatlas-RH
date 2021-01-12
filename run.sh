#!/usr/bin/env bash

cd /opt/src/app || exit

echo "===> Building ..."
npm run build --production

cp -r /opt/src/app/build /usr/src/app
rm -rf /opt/src/app/build
cd /usr/src/app || exit

echo "===> Running ..."
exec serve -s build
