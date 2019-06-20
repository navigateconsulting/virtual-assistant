# API gateway for eva-platform 

## Config File options 


### Configure Port 

    PORT=8089

Port on which the api gateway would be deployed
    
### Configure MongoDB
    MONGODB_URL=mongodb://mongodb:27017
    MONGODB_NAME=eva_platform
MongoDB Server connection settings and the defualt database name 

### Socketio Logging
    
    LOGGING=TRUE
Enable / Disable socketio logging using this config option

### Volume Settings 
    
    SEED_DATA_PATH=/vol_chatbot_data/seed_data/
    SESSION_MODEL_PATH=/vol_chatbot_data/temp/trainer-sessions/
    DEPLOY_MODEL_PATH=/vol_chatbot_data/rasa/server/models/

Paths on the Docker volume for application
    
### Rasa Endpoint 

    RASA_URL=http://rasa:5005/model
Rasa Endpoint URL 