FROM node:10.15

RUN mkdir -p /opt/src/app && \
    mkdir -p /usr/src/app/build/data
COPY . /opt/src/app

RUN cd /opt/src/app && \
    npm install -g serve && \
    npm install

RUN chmod u+x /opt/src/app/run.sh

VOLUME ["/usr/src/app/build/data"]
EXPOSE 5000

CMD ["/opt/src/app/run.sh"]
