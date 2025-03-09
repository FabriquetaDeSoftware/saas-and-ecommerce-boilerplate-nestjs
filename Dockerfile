FROM node:22.14-bullseye-slim
WORKDIR /home/api/nestjs/saas-and-ecommerce-boilerplate-nestjs

COPY . .

RUN rm -rf node_modules
RUN npm install -g pnpm
RUN pnpm i
RUN pnpm add @prisma/client@latest
RUN npx prisma generate

EXPOSE ${PORT_API}