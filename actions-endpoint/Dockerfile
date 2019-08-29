FROM rasa/rasa-sdk:latest

COPY requirements.txt /
# To install system dependencies
RUN apt-get update -qq && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# To install packages from PyPI
RUN pip install --no-cache-dir -r /requirements.txt