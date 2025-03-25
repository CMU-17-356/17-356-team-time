# Use an official Node runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g ts-node typescript
RUN npm install --save-dev @types/cors @types/express @types/node @types/uuid
RUN npm install aws-sdk uuid

# Now copy the rest of the application
COPY . .

# Expose the port your backend listens on (adjust as needed)
EXPOSE 5001

# Start the application using ts-node
CMD ["npx", "ts-node", "./index.ts"]

