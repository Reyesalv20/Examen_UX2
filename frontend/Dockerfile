FROM node:20-alpine
WORKDIR /app

EXPOSE 3000

COPY package*.json ./
RUN npm install
RUN npm install react-scripts

COPY . ./
CMD ["npm", "run", "start"]
