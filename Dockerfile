FROM node:18-bullseye-slim

# Install build tools needed by better-sqlite3 (native C++ addon)
# and execution engine tools (python3, g++, make, gcc for C compilation)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    g++ \
    gcc \
    make \
    build-essential \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf python3 /usr/bin/python

WORKDIR /usr/src/app

# Install dependencies (better-sqlite3 will compile from source)
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
