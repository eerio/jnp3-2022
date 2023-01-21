# pull official base image
FROM node:19-alpine3.16

# set working directory
WORKDIR /app

# install app dependencies
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci

COPY . ./
# expose port
EXPOSE 8080

# start app
CMD ["node", "index.js"]
