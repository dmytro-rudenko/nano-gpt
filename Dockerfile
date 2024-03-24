# Use Node.js version 20
FROM node:20-alpine

# install curl, git, nano
RUN apk add --no-cache curl git nano

# Install Python and other dependencies
RUN apk add --no-cache python3 py3-pip make g++

# Create app directory
WORKDIR /src

COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps
# RUN docker exec -it ollama  ollama pull qwen:0.5b-chat

COPY . .

# ENV OLLAMA_HOST 0.0.0.0
ENV TELEGRAM_BOT_TOKEN 6059954498:AAHKo5u9S7jgBxaMHIHbIPVJlnVljXfK4I8

# Start the app
CMD [ "npm", "start" ]