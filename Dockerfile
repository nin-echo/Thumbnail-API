FROM node:20
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json .
RUN npm install
RUN npm install --cpu=x64 --os=darwin sharp
RUN npm install --cpu=arm64 --os=darwin sharp
COPY . .
EXPOSE 3000
CMD [ "npm", "start"]