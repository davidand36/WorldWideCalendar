FROM httpd:2
RUN apt-get update && apt-get install -y libfcgi
ADD conf/  /usr/local/apache2/conf/
ADD htdocs/  /usr/local/apache2/htdocs/
ADD cgi-bin/ /usr/local/apache2/cgi-bin/
