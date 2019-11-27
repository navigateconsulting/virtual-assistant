<p align="center">
  <img src="/docs/assets/trainer.svg" width="200" height="200"/>
</p>

<div align="center" >
  <p><h2>Virtual Assistant</h2></p>
</div>
<div style="text-align: justify; text-justify: inter-word;">
Billion users around the world are on instant messaging and chat apps at any moment in time. People want and expect the instant engagement that only messaging apps can provide, and they’re rushing to these platforms in droves, at an adoption rate far greater than even social networks saw at their peak. Organisations need a platform to enable them to harness the power of instant messaging and engage intelligently and contextually with customers and employees.
</div>
<br />
<div style="text-align: justify; text-justify: inter-word;">
A Virtual Assistant, like a chatbot, is a computer program designed to simulate a conversation with human users, especially over the Internet. End users can easily discover and connect to assistants through many of the popular messaging apps, without the need to individually download and install them from an app store. Virtual Assistants have a distinct advantage over conventional device-resident Mobile Apps in many circumstances. With a Virtual Assistant, your service can be instantly available through the messaging app your user already has installed on their mobile device.
</div>
<br />
<div style="text-align: justify; text-justify: inter-word;">
Unlike a simple chatbot, a Virtual Assistant can be equipped with multiple skills covering a broad set of domains and topics all from one conversational interface. There’s no need to search for the appropriate chatbot that supports a specific service. Your Virtual Assistant becomes the single help desk for all the conversational experiences you wish to provide to your employees and customers.
</div>
<br />
<div style="text-align: justify; text-justify: inter-word;">
Virtual Assistant skills, powered by Artificial Intelligence (AI), dramatically improve the conversational experience, providing a very natural conversation between the assistant and the end user. Instead of the end user having to learn a fixed set of keywords that the assistant would respond to, a Virtual Assistant is able to understand the user’s intentions, however they are expressed and respond accordingly. A Virtual Assistant will ensure your users stay engaged and keep coming back to your service.
</div>
<br />
<div style="text-align: justify; text-justify: inter-word;">
The application makes it simple and easy to build and train your Virtual Assistant without the need for specialist AI skills. Your assistant can then be exposed through many Chat and Voice channels, a custom mobile app or even your web site.
</div>
<br />
<div style="text-align: justify; text-justify: inter-word;">
Natural Language Processing backed by Rasa nlu and core.
</div>
<br />
<div style="text-align: justify; text-justify: inter-word;">
Virtual Assistant is build using following open source components.

- Angular Ui - To build, train and deploy a chat bot project
- Python API gateway - connecting to rasa for deploying and persisting training data
- Mongodb - for storing training data and editing training data
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
