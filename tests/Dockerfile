FROM ubuntu:trusty

RUN apt-get update && apt-get install -yq curl && apt-get clean

WORKDIR /app

ADD tests.sh /app/tests.sh

CMD ["bash", "tests.sh"]
