FROM python:3.6-slim

ADD . /backend-trainer
WORKDIR /backend-trainer

RUN pip install -r requirements.txt

ENTRYPOINT ["python"]

CMD ["app.py"]