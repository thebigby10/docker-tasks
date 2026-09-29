FROM node:20-alpine

ARG PORT

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD npm run start
