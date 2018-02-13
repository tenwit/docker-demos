FROM debian:jessie AS FakeTime

WORKDIR /
RUN apt update && apt install -y git build-essential
RUN git clone https://github.com/wolfcw/libfaketime.git

WORKDIR /libfaketime/src
RUN make install

FROM microsoft/mssql-server-linux
RUN mkdir /usr/local/lib/faketime
COPY --from=FakeTime /usr/local/lib/faketime/libfaketime.so.1 /usr/local/lib/faketime
COPY --from=FakeTime /usr/local/lib/faketime/libfaketimeMT.so.1 /usr/local/lib/faketime
COPY --from=FakeTime /usr/local/bin/faketime /usr/local/bin

ENV LD_PRELOAD=/usr/local/lib/faketime/libfaketime.so.1
ENV FAKETIME_NO_CACHE=1
ENV DONT_FAKE_MONOTONIC=1
ENV FAKETIME=+30d

ENV MYSQL_ALLOW_EMPTY_PASSWORD=1
ENV ACCEPT_EULA=1
