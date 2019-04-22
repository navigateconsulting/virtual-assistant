FROM python:3.6-slim

ADD run.py /

RUN pip install flask flask-restful flask-jwt-extended Flask-PyMongo passlib

CMD [ "python", "./run.py" ]