# Use the same base image as your development environment
FROM node:current

# Create app directory
WORKDIR /usr/src/app

# Clear npm cache and install node-gyp globally
RUN npm cache clean --force && \
    npm install -g node-gyp

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install 

# Bundle app source
COPY . .

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 8080

CMD ["node", "app.js"]

