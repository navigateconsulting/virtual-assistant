FROM python:3.6-slim

ADD skype_master_v4.py /
ADD config.ini /

RUN pip install adal
RUN pip install requests 
RUN pip install configparser
RUN pip install lxml
RUN pip install uuid 
RUN pip install confluent_kafka

CMD [ "python", "./skype_master_v4.py" ]

