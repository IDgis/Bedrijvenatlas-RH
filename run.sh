#!/usr/bin/env bash

cd /opt/src/app

echo "===> Building ..."
npm run build --production

if [[ ! -z "$(ls -A /usr/src/app/build/data)" ]]; then
    rm -rf /opt/src/app/build/data
fi

cp -r /opt/src/app/build /usr/src/app
rm -rf /opt/src
cd /usr/src/app

echo "===> Running ..."
exec serve -s build
