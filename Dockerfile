FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

RUN npm run build

ENV PORT=4000

EXPOSE 4000

CMD [ "npm", "start" ]