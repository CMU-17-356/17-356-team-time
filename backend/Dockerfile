FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json files first to leverage Docker cache
COPY package.json .

# Install dependencies
RUN npm install -g tsx
RUN npm install

# Now copy the rest of the application
COPY . .

# Expose the port your backend listens on (adjust as needed)
EXPOSE 5001

# Start the application using ts-node
CMD ["tsx", "./index.ts"]

