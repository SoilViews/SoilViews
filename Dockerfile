FROM node:22-alpine

WORKDIR /usr/src/app

# install dependencies first so they are cached between builds
COPY package*.json ./
RUN npm install

COPY . .

# Vite dev server on port 3000 (see vite.config.js)
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
