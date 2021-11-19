FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

RUN npm run build

ENV PORT=4010

EXPOSE 4010

CMD [ "npm", "start" ]