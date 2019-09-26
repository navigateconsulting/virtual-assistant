<div align="center" >
  <img src="https://www.navigateconsulting.se/wp-content/uploads/2018/08/logo.png">
  <p><h2>Navigate's Virtual Assistant</h2></p>
</div>

Virtual Assistant trainer is an open source application to train, deploy and maintain chat bots. VA is built using 
rasa open source machine learning framework and utilizes rasa nlu and core for developing and deploying chat bots.

VA provides following open source components for developing chat bot applications.

- Angular Ui - To build, train and deploy a chat bot project
- Python API gateway - connecting to rasa for deploying the chat bot and persisting training data
- Mongodb - for storing training data and editing training data

### Using Rasa

We use rasa 1.3 as a ML framework to train and deploy chat bots. 
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

    git clone https://github.com/navigateconsulting/virtual-assistant
    cd virtual-assistant
    docker-compose build
    docker-compose up  

The Trainer application would now be avaliable on port 8080 

#### Detailed Installation 

   For detailed installation instructions please follow [this link](docs/installation/Readme.md)

## Usage
   Usage instructions : [click here](docs/usage/Readme.md)
   
## License 

