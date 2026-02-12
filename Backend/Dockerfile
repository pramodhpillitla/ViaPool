FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose backend port (change if your app uses another)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]