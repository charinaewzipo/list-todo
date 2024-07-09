# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json (if available)
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

# Install and cache app dependencies
RUN npm ci
RUN npm install react-scripts -g

# Copy the rest of the application code
COPY . /usr/src/app

# Start the app
CMD ["npm", "start"]
