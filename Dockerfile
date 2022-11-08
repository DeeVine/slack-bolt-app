# syntax=docker/dockerfile:1
FROM node:12-alpine
# RUN apk add --no-cache python2 g++ make
# WORKDIR /app
COPY . .
RUN yarn install --production
ENV PORT 8080
CMD ["node", "app.js"]