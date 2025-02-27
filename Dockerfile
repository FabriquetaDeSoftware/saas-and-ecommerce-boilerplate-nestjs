FROM node:22.14-bullseye-slim
WORKDIR /home/api/nestjs/auth-boilerplate

COPY . .

RUN rm -rf node_modules
RUN npm install -g pnpm
RUN pnpm i
RUN npx prisma generate

EXPOSE ${PORT_API}