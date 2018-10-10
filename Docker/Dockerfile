FROM debian:stable-slim
RUN apt-get update && apt-get install -y \
    apache2 \
    libfcgi \
    libapache2-mod-fcgid
EXPOSE 80
COPY bin/  /usr/local/bin/
COPY conf/sites-available/  /etc/apache2/sites-available/
COPY cgi-bin/  /var/www/fcgi-bin/
COPY htdocs/  /var/www/html/
CMD [ "/usr/local/bin/apache2-foreground" ]
