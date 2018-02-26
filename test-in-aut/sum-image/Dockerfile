FROM node

RUN npm install seneca
EXPOSE 10101

COPY sum.js .

CMD [ "sum.js" ]
ENTRYPOINT ["node"]