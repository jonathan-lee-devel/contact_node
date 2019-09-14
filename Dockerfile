FROM node:10

WORKDIR /usr/src/contact_node

COPY package*.json ./

RUN npm install
RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]

