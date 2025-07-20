FROM node:16-alpine
WORKDIR /admin
COPY . .
RUN yarn install --production
CMD ["yarn", "build"]
EXPOSE 4001