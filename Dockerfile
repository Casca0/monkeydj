# Use a Node.js base image with a specific version
FROM node:20.12.1

# Set the working directory inside the container
WORKDIR /

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Update package list and install ffmpeg
RUN apt update && apt install -y ffmpeg

# Install dependencies
RUN npm install

RUN npx tsc

# Copy the rest of the application code
COPY . .

# Define the command to start the Node.js application
CMD [ "node", "dist/index.js" ]
