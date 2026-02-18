FROM node:20-alpine
WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn@4.11.0 --activate
RUN yarn install --immutable

COPY . .
EXPOSE 5000
CMD ["yarn", "start"]
