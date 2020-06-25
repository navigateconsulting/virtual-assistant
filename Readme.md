
![GitHub release (latest by date)](https://img.shields.io/github/v/release/navigateconsulting/virtual-assistant)
[![GitHub license](https://img.shields.io/github/license/navigateconsulting/virtual-assistant)](https://github.com/navigateconsulting/virtual-assistant/blob/master/LICENSE)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/navigateconsulting/virtual-assistant/Docker)
![Docker](https://github.com/navigateconsulting/virtual-assistant/workflows/Docker/badge.svg?branch=master)
<p align="center">
  <img src="/docs/assets/trainer.svg" width="200" height="200"/>
</p>
<div align="center">
  <p><h2>Enterprise Virtual Assistant (EVA)</h2></p>
</div>

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
 
## About The Project

### Built With

We used below projects to build the application stack.

[Rasa Open Source](https://github.com/RasaHQ/rasa) 


The Application stack is built with below technologies 

Angular - For front end development.
 
Python Flask - For API backend.

mongodb - As a Database for storing Rasa projects.

redis - As a caching layer between UI and Backend.

## Getting Stated 

We use [Docker hub](https://hub.docker.com/u/navigateconsulting) to publish docker container images.

### Prerequisites

   - Docker version 18.09 onwards. (not tested on previous versions)
   - Docker Compose version 1.24 onwards (not tested on previous versions)
   - Linux Distributions (Windows not supported as of now, tested on ubuntu)

### Installation 

If the project is to be deployed for production, please follow instructions for production deployment in below section

#### Quick Installation

Download the docker-compose.yml file with below command

    wget https://raw.githubusercontent.com/navigateconsulting/virtual-assistant/master/docker-compose.yml
    
And start the application with a simple docker compose up command.

    docker-compose up -d

This will start the application user interface on port 8080. 

#### Production Mode

For production deployment, all the user interface containers are recommended to be on TLS. Refer docker-compose.tls_example.yml file 
for how to configure and secure the deployment. Example contains a Letscert container which handles certificates and reissue on expiry.

Ensure below environment variables are set for containers which are to be secured. 

      - VIRTUAL_HOST=subdomain.domain.com
      - VIRTUAL_PORT=port_no
      - LETSENCRYPT_HOST=subdomain.domain.com
      - LETSENCRYPT_EMAIL=user@domain.com
 
For example , to secure the Ui-Trainer application , modify the docker compose file and add above mentioned environment 
variables as shown below


      va_api_gateway:
        init: true
        build: './va_api_gateway'
        environment:
          - PORT_APP=3000
          - WORKERS=1
          - THREADS=50
          - REDIS_URL=redis
          - REDIS_PORT=6379
          - MONGODB_HOST=mongodb
          - MONGODB_PORT=27017
          - RASA_SERVER=http://rasa:5005/model
          - VIRTUAL_HOST=subdomain.domain.com
          - VIRTUAL_PORT=port_no
          - LETSENCRYPT_HOST=subdomain.domain.com
          - LETSENCRYPT_EMAIL=user@domain.com
        ports:
          - "3000:3000"
        volumes:
          - rasa_projects:/rasa_projects
        depends_on:
          - redis

After modifying the docker compose file. First start the tls containers by running below command 

    docker-compose -f docker-compose.tls_example.yml up -d 
    
and once the containers are up, start the application stack. 

    docker-compose up -d

#### For Development 

If you intent to extend the stack and make changes to the code base , follow below instructions to clone the repo and build containers from source

    git clone https://github.com/navigateconsulting/virtual-assistant
    cd virtual-assistant
    docker-compose -f docker-compose.build_from_source.yml build
    docker-compose -f docker-compose.build_from_source.yml up  

**Note:  docker-compose.yml file uses docker hub to pull docker containers and does not build from source.

### Documentation

You can find detailed documentation [here](https://navigateconsulting.github.io/virtual-assistant/)

## Usage
   Usage instructions : [click here](docs/usage/Readme.md)

## License

[Apache 2.0](LICENSE)
