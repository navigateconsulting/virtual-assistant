FROM python:3.6-slim

ADD skype_message_processor.py /

RUN pip install requests 
RUN pip install configparser
RUN pip install uuid 
RUN pip install confluent_kafka

CMD [ "python", "./skype_message_processor.py" ]

