# Use the official Node.js 14 image for the ARM64 platform
FROM --platform=linux/arm64 node:14-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY start.sh .

# Install dependencies
RUN yarn install

# Copy the rest of your app's source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

ARG PROFILE
ENV profile_env=${PROFILE}


# Add bash for the start script
RUN apk add --no-cache --upgrade bash

# Start the app
CMD ["./start.sh"]
