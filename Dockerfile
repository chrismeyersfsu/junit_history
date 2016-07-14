FROM node:argon
WORKDIR /junit_history
RUN npm install -g nodemon

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.0.1/dumb-init_1.0.1_amd64.deb
RUN dpkg -i dumb-init_*.deb
RUN rm -rf /dumb-init_*.deb
ENTRYPOINT ["/usr/bin/dumb-init"]
EXPOSE 8080
CMD ["/usr/bin/dumb-init"]
