FROM node:18-alpine

WORKDIR /

COPY package*.json ./

RUN rm -rf node_modules && \
    rm -f package-lock.json && \
    npm cache clean --force && \
    npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"] 