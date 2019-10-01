# Detailed Install Instructions 

## Applications details 

![Virtual Assistant](../assets/Virtual%20Assistant%20Arch.jpg)

Virtual Assistant Trainer.

### UI Component
UI Component is developed using Angular 7, and would be supported on all browsers compatible with Angular 7.
List of supported browsers at this [link](https://angular.io/guide/browser-support)
 
 Note : As of now IE is not supported although its listed as supported for Angular 7.
 
### api gateway
 API gateway is a python 3.7 backend, which communicates with UI and database to serve the application. 
 it uses socketio for realtime data exchange between backend and UI.
 
 Application does not provide any authentication methods or role based access control.
 
### MongoDB 
 Application would create a new database called 'eva_platform' and create collections in that database to store training data.
 This database can be accessed at port 27017 to view the database and its collections. 
 
 Note : We do not recommend updating collections directly as this might case data inconsistency
 
### rasa 
 This is a rasa container, as published by rasa in docker hub. We pull rasa with latest tag 
 from docker hub this would ensure the platform gets latest version of rasa. Volumes are also bind-mounted to this container
 so that training data and model can be persisted on the volume.
 
### rasa-sdk 
this is the rasa actions server. Any connector written for rasa actions server can be 
deployed in actions server and can be used as documented in rasa. 
Custom actions needs to be placed in "vol_chatbot_data/rasa/server/actions" folder. If any new 
code is deployed for that to take effect rasa actions server container would need to be restarted.         
    

## Requirements

VA has been built using docker containerization hence docker and docker-compose would be required to launch the application

### Software requirements 

   - Docker version 18.09 onwards. (not tested on previous versions)
   - Docker Compose version 1.24 onwards (not tested on previous versions)
   - Linux like distributions (Tested on ubuntu)
   

## Docker installation 

Follow steps to install docker CE or enterprise as per your needs following below [link](https://docs.docker.com/install/)
and after that complete docker-compose installation by following [link](https://docs.docker.com/compose/install/)

## Clone github repo 

use below commands to clone the github repo to local machine or server.
    
    git clone https://github.com/evadigital/eva-platform
    cd eva-platform
    docker-compose build
    docker-compose up
    
Docker containers would be using ports 5055, 5005, 27017, 8080 for VA components. Ensure these ports are free.

## Docker-compose files 

The repo contains two docker-compose files. docker-compose.yml and docker-compose.devel.yml. 

docker-compose.yml would start all platform components, including rasa server , rasa actions server and connectors
this should be used to build the docker containers for server.

    docker-compose build
    docker-compose up -d

docker-compose.devel.yml would start only the ui application, api gateway and database. 
Serving infrastructure and connectors would not be started by this compose file. This file can be used to 
create a development environment for any contributions.      

    docker-compose -f docker-compose.devel.yml build
    docker-compose -f docker-compose.devel.yml up -d
    
To check logs of any container use below command 

    docker-compose logs -f <container name>
    
## External Volumes

All the training data generated by the application is stored on the local machine / server itself. For this we use 
bind-mount volumes which contains default config files, demo samples and database files. 

vol_chatbot_data folder in the install base is a bind-mount volume and is mounted to the docker containers 
the location for this can be changed but ensure to modify docker-compose files to reflect the modified location.

vol_chatbot_data/database/db folder contains the mongodb database files. This folder can be backed up to restore 
application data in case of any issues.

Note : We do not recommend to change bind-mount volumes attached to docker containers as this might break the functionality.
In future releases we would bring in flexibility to define data store locations etc. 

