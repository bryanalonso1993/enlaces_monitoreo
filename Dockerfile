# image
FROM node:16.4.2-buster

# install dependecies
RUN apt install -y systemd

# set date
RUN timedatectl set-timezone "America/Lima"

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
