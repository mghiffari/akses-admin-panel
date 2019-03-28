FROM nginx:1.14.2-alpine
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
COPY dist2/AdiraAksesAdminPanel /usr/share/nginx/html
COPY nginx.conf etc/nginx/conf.d/
EXPOSE 80