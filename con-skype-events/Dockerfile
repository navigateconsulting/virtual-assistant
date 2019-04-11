FROM python:3.6-slim

ADD skype_events_processor_v1.py /

RUN pip install adal
RUN pip install requests 
RUN pip install configparser
RUN pip install lxml
RUN pip install uuid 
RUN pip install confluent_kafka

CMD [ "python", "./skype_events_processor.py" ]

