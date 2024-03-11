# == 1: BUILD STAGE ==
FROM node:18 as builder
WORKDIR /vafan
COPY ./frontend ./
RUN npm install
RUN npm run build

# == 2: RUN STAGE == 
FROM --platform=linux/amd64 nginx:alpine
WORKDIR /vafan
COPY --from=builder /vafan/build .
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY /frontend/deployment/ /etc/nginx/
EXPOSE 80