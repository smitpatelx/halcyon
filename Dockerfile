FROM node:14

WORKDIR /user/src/app

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9009
CMD ["npm","start"]