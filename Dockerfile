FROM node:10.15.0

# Create app directory
RUN mkdir -p /opt/src/app \
    && mkdir -p /usr/src/app/build/data

# Copy source code to image
COPY . /opt/src/app

# Install and configure 'serve' and install dependencies
RUN cd /opt/src/app \
    && npm install -g serve \
    && npm install

# Give user permission to run script
RUN chmod u+x /opt/src/app/run.sh

# Configure volumes for data persistence
VOLUME ["/usr/src/app/build/data"]

# Expose port for service
EXPOSE 5000

# Build app and start server from script
CMD ["/opt/src/app/run.sh"]
