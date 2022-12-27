# pull official base image
FROM node:19-alpine3.16

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

RUN npm install -g serve
CMD serve -s build
EXPOSE 3000

COPY package.json package.json
RUN npm install

# install app dependencies
COPY . ./


# start app
RUN npm run build --production