# Virtual Assistant Trainer 

Virtual Assistant trainer is an open source application to train, deploy and maintain chat bots. VA is built using 
rasa open source machine learning framework and utilizes rasa nlu and core for developing and deploying chat bots.

VA provides following open source components for developing chat bot applications.

- Angular Ui - To build, train and deploy a chat bot project
- Python API gateway - connecting to rasa for deploying the chat bot and persisting training data
- Mongodb - for storing training data and editing training data

### Using Rasa

We use rasa 1.0 (combined repo for nlu + core) as a ML framework to train and deploy chat bots. 
We would keep updating the code base to support latest versions of rasa.  

We intent to support all features provided by rasa framework, in case you find any feature missing please report to us.


## Installation

#### Quick Install

VA uses docker containers to build all application components. 

##### Requirements 
   - Docker version 18.09 onwards. (not tested on previous versions)
   - Docker Compose version 1.24 onwards (not tested on previous versions)
   - Linux Distributions (Windows not supported as of now, tested on ubuntu)

##### Installation

Clone the repo on local machine and build the docker containers as shown below.

    git clone https://github.com/evadigital/eva-platform
    cd eva-platform
    docker-compose build
    docker-compose up  
 
#### Detailed Installation 

   For detailed installation instructions please follow [this link](docs/installation/Readme.md)

## Usage
   Usage instructions : [click here](docs/usage/Readme.md)
   
## Further reading 

TODO 
link blog posts
