FROM node:latest

RUN mkdir -p /srv/app/sloganpicker
WORKDIR /srv/app/sloganpicker

COPY src/ /srv/app/sloganpicker

RUN yarn install

CMD ["npm", "start"]
