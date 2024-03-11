FROM --platform=linux/amd64 nginx:alpine

# Remove the default nginx config file
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the custom nginx config file and start script
WORKDIR /Vafan
COPY ./proxy/ /etc/proxy/
