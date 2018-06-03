FROM tomcat:7-jre8-alpine
RUN rm -rf /usr/local/tomcat/webapps/ROOT
COPY sample.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080
VOLUME [ "/usr/local/tomcat" ]
ENTRYPOINT [ "catalina.sh" ]
CMD [ "run" ]