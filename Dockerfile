FROM nginx:1.14.2-alpine
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
COPY dist2/AdiraAksesAdminPanel /usr/share/nginx/html
COPY nginx.conf etc/nginx/conf.d/
RUN sed -i '/access_log/c \    access_log \/dev\/null;server_tokens off;' /etc/nginx/nginx.conf
# EXPOSE 80