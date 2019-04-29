FROM python:3.6-slim

ADD . /api-backend
WORKDIR /api-backend

RUN pip install flask flask-restful flask-jwt-extended Flask-PyMongo passlib

ENTRYPOINT ["python"]

CMD ["run.py"]