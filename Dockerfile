FROM node:argon

# Install dumb-init
RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.0.1/dumb-init_1.0.1_amd64.deb
RUN dpkg -i dumb-init_*.deb
RUN rm -rf /dumb-init_*.deb

# Copy code to docker container
RUN mkdir /junit_history
RUN mkdir /junit_history/server
RUN mkdir /junit_history/client
ADD server /junit_history/server
ADD client /junit_history/client

# Install deps
WORKDIR /junit_history/server
RUN npm install

ENTRYPOINT ["/usr/bin/dumb-init"]
EXPOSE 8080
WORKDIR /junit_history/server
CMD [ "npm", "start" ]
