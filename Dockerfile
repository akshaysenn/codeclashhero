FROM node:18-alpine

# Install Python and G++ to support our code execution engine
RUN apk add --no-cache python3 g++ make

# Map python3 to python so the server.js `child_process.exec('python ...')` works
RUN ln -sf python3 /usr/bin/python

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port (Render sets PORT randomly, but exposes internally)
EXPOSE 3000

# Start server
CMD [ "npm", "start" ]
