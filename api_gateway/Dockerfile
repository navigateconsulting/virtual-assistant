FROM python:3.7-slim

RUN apt-get update
RUN apt-get install -y --no-install-recommends build-essential gcc

RUN apt-get install -y tk-dev && rm -r /var/lib/apt/lists/*

# layer caching for faster builds
COPY requirements.txt /
RUN pip install -r /requirements.txt

#RUN mkdir -p /app/config/
#COPY ./rasa_custom/endpoints.yml /app/config/endpoints.yml

ADD . /api_gateway
WORKDIR /api_gateway

ENTRYPOINT ["python"]

CMD ["-u","app.py"]