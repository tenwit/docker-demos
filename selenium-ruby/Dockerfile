FROM ruby
COPY ["ruby-ui-example/", "."]
RUN ["bundle", "update"]
ENTRYPOINT ["rake"]
CMD ["spec"]
