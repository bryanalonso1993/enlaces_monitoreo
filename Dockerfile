# image
FROM node:16.4.2-buster

# create empty directory
WORKDIR /usr/src/app

# copy dependencies
ADD package*.json ./

# Install dependencies
RUN npm install

# copy project
ADD . .

EXPOSE 7070

CMD ["npm", "start"]
