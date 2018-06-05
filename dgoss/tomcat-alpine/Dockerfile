FROM tomcat:7-jre8-alpine
RUN rm -rf /usr/local/tomcat/webapps/ROOT
EXPOSE 8080
VOLUME [ "/usr/local/tomcat/webapps" ]
ENTRYPOINT [ "catalina.sh" ]
CMD [ "run" ]