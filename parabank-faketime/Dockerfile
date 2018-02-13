FROM alpine/git AS FakeTime

WORKDIR /
RUN git clone https://github.com/wolfcw/libfaketime.git

WORKDIR /libfaketime/src
RUN apk add --update alpine-sdk
RUN make install

FROM iqa/parabank:latest
RUN mkdir /usr/local/lib/faketime
COPY --from=FakeTime /usr/local/lib/faketime/libfaketime.so.1 /usr/local/lib/faketime
COPY --from=FakeTime /usr/local/lib/faketime/libfaketimeMT.so.1 /usr/local/lib/faketime
COPY --from=FakeTime /usr/local/bin/faketime /usr/local/bin

ENV LD_PRELOAD=/usr/local/lib/faketime/libfaketime.so.1
ENV FAKETIME_NO_CACHE=1
ENV DONT_FAKE_MONOTONIC=1