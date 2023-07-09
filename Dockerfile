FROM node:15.5-alpine as base
WORKDIR /app

#####################################
#        BACKEND ENVIRONMENT        #
#####################################

FROM base AS backend-base
COPY ./package.json ./yarn.lock ./

FROM backend-base AS dev
RUN yarn global add nodemon
RUN yarn install && yarn cache clean
CMD ["npm", "run", "dev"]

FROM backend-base AS prod
RUN yarn install --production && yarn cache clean
CMD ["node", "/app/src/index.js"]