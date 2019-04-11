# Eva platform app 

## Installation 

### Install docker 

navigate to below link to get docker installed.
https://docs.docker.com/install/linux/docker-ce/

### Launch the platform 

To launch the platform use below command (it might take time for the first time)

`docker-compose up`

### Launch UI Trainer 
use below command to launch ui-trainer container instead of the full platform 

`docker-compose -f docker-compose.ui_example.yml up`

this will start only specific ui container 