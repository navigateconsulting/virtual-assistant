# Extend the official Rasa SDK image
FROM rasa/rasa:1.8.1-full

# Use subdirectory as working directory
WORKDIR /app/config

USER root


# Copy actions folder to working directory
COPY endpoints.yml /app/config

# By best practices, don't run the code with root user
USER 1001


