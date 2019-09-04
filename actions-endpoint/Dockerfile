FROM rasa/rasa-sdk:latest

COPY requirements.txt /
# To install system dependencies
RUN apt-get update -qq && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    mkdir -p /opt/data/api

# Oracle Stupidity begins here ..

# installing zip for unzipping oracle instant client drivers

RUN apt-get update -qq && \
    apt-get install -y zip && \
    apt-get install libaio1

# Copy instant client zip to container

ADD ./oracle-instantclient/ /opt/data
#ADD ./install-instantclient.sh /opt/data

#WORKDIR /opt/data

# set environment varibales for Oracle home

ENV ORACLE_HOME=/opt/oracle/instantclient
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ORACLE_HOME

ENV OCI_HOME=/opt/oracle/instantclient
ENV OCI_LIB_DIR=/opt/oracle/instantclient
ENV OCI_INCLUDE_DIR=/opt/oracle/instantclient/sdk/include

# INSTALL INSTANTCLIENT AND DEPENDENCIES
RUN /opt/data/install-instantclient.sh

# To install packages from PyPI
RUN pip install --no-cache-dir -r /requirements.txt