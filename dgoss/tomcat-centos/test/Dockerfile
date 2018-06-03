FROM centos_tomcat
COPY sample.war /usr/share/tomcat/webapps/ROOT.war
EXPOSE 8080
ENTRYPOINT [ "/usr/libexec/tomcat/server" ]
CMD [ "start" ]