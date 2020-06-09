
![GitHub release (latest by date)](https://img.shields.io/github/v/release/navigateconsulting/virtual-assistant)
[![GitHub license](https://img.shields.io/github/license/navigateconsulting/virtual-assistant)](https://github.com/navigateconsulting/virtual-assistant/blob/master/LICENSE)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/navigateconsulting/virtual-assistant/Docker)

<p align="center">
  <img src="/docs/assets/trainer.svg" width="200" height="200"/>
</p>
<div align="center" >
  <p><h2>Virtual Assistant</h2></p>
</div>

### Using Rasa  

We use Rasa 1.3 as a ML framework to train and deploy virtual assistant.
We would keep updating the code base to support latest versions of Rasa.

We intent to support all features provided by Rasa framework, in case you find any feature missing please report to us.


### Documentation

You can find detailed documentation [here](https://navigateconsulting.github.io/virtual-assistant/)

## Installation

#### Quick Install

Virtual Assistant uses docker containers to build all application components.

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

[Apache 2.0](LICENSE)
