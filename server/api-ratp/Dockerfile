FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app

RUN apk update && apk add bash && apk add --no-cache coreutils
COPY ./wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD ["wait-for-it", "db-ratp:3306", "--", "node", "index.js"]
