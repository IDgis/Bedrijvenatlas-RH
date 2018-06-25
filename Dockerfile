FROM idgis/meteor:1.7
MAINTAINER IDgis bv

RUN mkdir /home/meteorapp
WORKDIR /home/meteorapp

ADD . ./app

RUN cd /home/meteorapp/app \
    && meteor npm install --production \
    && meteor build ../build --directory --allow-superuser \
    # ----------------------------------------------
    && cd /home/meteorapp/build/bundle/programs/server \
    && npm install \
    # ----------------------------------------------
    # Get rid of Meteor. We're done with it.
    && rm /usr/local/bin/meteor \
    && rm -rf ~./meteor \
    # ----------------------------------------------
    # Clean up installed dependencies we no longer need.
    && /cleanup.sh

RUN npm install -g forever

USER meteor
CMD ["forever", "--minUpTime", "1000", "--spinSleepTime", "1000", "build/bundle/main.js"]
