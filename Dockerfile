FROM node:18.7.0

RUN apt-get -y update && apt-get -y install git

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --include=dev

COPY . .

RUN npm run prisma

CMD npm run initdb && npm run serve
