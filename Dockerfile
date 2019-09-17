FROM nginx:1.14.2-alpine
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
COPY dist2/AdiraAksesAdminPanel /usr/share/nginx/html
RUN echo "worker_processes auto;\
    worker_rlimit_nofile 100000;\
    pid        /var/run/nginx.pid;\
    error_log  /var/log/nginx/error.log error;\
    events {\
        worker_connections  4096;\
        use epoll;\
        multi_accept on;\
    }\
    http {\
        server_tokens off;\
        add_header X-Frame-Options SAMEORIGIN;\
        add_header X-Content-Type-Options nosniff;\
        add_header X-XSS-Protection '1;mode=block';\
        include       /etc/nginx/mime.types;\
        default_type  application/octet-stream;\
        access_log off;\
        client_body_buffer_size     16k;\
        client_header_buffer_size   1k;\
        client_max_body_size        0;\
        large_client_header_buffers 2 1k;\
        client_body_timeout     12;\
        client_header_timeout   12;\
        keepalive_timeout       15;\
        send_timeout            10;\
        gzip                    on;\
        gzip_comp_level         2;\
        gzip_min_length         1000;\
        gzip_proxied            expired no-cache no-store private auth;\
        gzip_types              text/plain text/css text/x-component\
                                text/xml application/xml application/xhtml+xml application/json\
                                image/x-icon image/bmp image/svg+xml application/atom+xml\
                                text/javascript application/javascript application/x-javascript\
                                application/pdf application/postscript\
                                application/rtf application/msword\
                                application/vnd.ms-powerpoint application/vnd.ms-excel\
                                application/vnd.ms-fontobject application/vnd.wap.wml\
                                application/x-font-ttf application/x-font-opentype;\
        include /etc/nginx/conf.d/*.conf;\
    }\
    " > /etc/nginx/nginx.conf
COPY nginx.conf etc/nginx/conf.d/
RUN sed -i '/access_log/c \    access_log \/dev\/null;server_tokens off;' /etc/nginx/nginx.conf
EXPOSE 80