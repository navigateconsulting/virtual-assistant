# Extend the official Rasa SDK image
FROM rasa/rasa:1.10.11-full

# Use subdirectory as working directory
#WORKDIR /app/config

#USER root

# Copy actions folder to working directory
#RUN mkdir -p /app/config
COPY endpoints.yml /app/config/endpoints.yml
COPY credentials.yml /app/config/credentials.yml

# Make sure the default group has the same permissions as the owner
#RUN chgrp -R 0 . && chmod -R g=u .

# Don't run as root
#USER 1001

