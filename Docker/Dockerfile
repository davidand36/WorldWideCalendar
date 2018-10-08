FROM debian:stable-slim
RUN apt-get update && apt-get install -y apache2 libfcgi libapache2-mod-fcgid
EXPOSE 80
ADD conf/sites-available/  /etc/apache2/sites-available/
ADD htdocs/  /var/www/html/
ADD cgi-bin/ /var/www/fcgi-bin/
ADD bin/  /usr/local/bin/
CMD [ "/usr/local/bin/apache2-foreground" ]
