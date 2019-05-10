# Ui Trainer backend  - Backend Trainer 


#Socket IO Calls 


##Projects 


## Rooms 

### Join Rooms 

Emit on 

    Name space - /
    
    Method - join_room
    
    Argument - 
    namespace_name , room_name



### Get projects 


Emit on 

    Name space - /project
    
    Method - getProjects
    
    Arguments - None 

Listen On  

    Name space - /project
    
    Method - allProjects
    
    Response - 
    [{_id: {…}, project_id: 2, project_name: "Project 2", project_description: "Clone of Project 1"}
    {_id: {…}, project_id: "123456", project_name: "Test", project_description: "Test 123"}
    {_id: {…}, project_id: "7", project_name: "Test7", project_description: "Test7 Desc"}]

    Broadcast - Yes 

### Create Project 

Emit on 

    Name Space - /project
    
    Method - createProject
    
    Argument - 
        {  "project_id": "〈project id〉",
           "project_name" : "〈project name〉",
           "project_description":"〈project description〉"
        }

Listen On 

Record update status 

    Name space - /project
    
    Method - projectResponse
    
    Response 
        {message: "Project created with ID 5cd29631464026722d63ec30 "}
        
    Broadcast - No  (Sent to the emitter only)

New projects status

    Name space - /project
    
    Method - allProjects
    
    Response - 
    [{_id: {…}, project_id: 2, project_name: "Project 2", project_description: "Clone of Project 1"}
    {_id: {…}, project_id: "123456", project_name: "Test", project_description: "Test 123"}
    {_id: {…}, project_id: "7", project_name: "Test7", project_description: "Test7 Desc"}]

    Broadcast - Yes 


### Delete Project

Emit On 

    Name Space - /project
    
    Method - deleteProject
    
    Argument - 
        object_id


Listen On 

Record update status 

    Name space - /project
    
    Method - projectResponse
    
    Response 
        {message: "Project Deleted with ID 5cd29631464026722d63ec30 "}
        
    Broadcast - No  (Sent to the emitter only)

New projects status

    Name space - /project
    
    Method - allProjects
    
    Response - 
    [{_id: {…}, project_id: 2, project_name: "Project 2", project_description: "Clone of Project 1"}
    {_id: {…}, project_id: "123456", project_name: "Test", project_description: "Test 123"}
    {_id: {…}, project_id: "7", project_name: "Test7", project_description: "Test7 Desc"}]

    Broadcast - Yes 
    
### Update Project

Emit On 

    Name Space - /project
    
    Method - updateProject
    
    Argument - 
        {"object_id": "123", "project_id": "123", "project_name": "project_name", "project_description" : "project description"}


Listen On 

Record update status 

    Name space - /project
    
    Method - projectResponse
    
    Response 
        {"message": "Updated project with row 1"}
        
    Broadcast - No  (Sent to the emitter only)

New projects status

    Name space - /project
    
    Method - allProjects
    
    Response - 
    [{_id: {…}, project_id: 2, project_name: "Project 2", project_description: "Clone of Project 1"}
    {_id: {…}, project_id: "123456", project_name: "Test", project_description: "Test 123"}
    {_id: {…}, project_id: "7", project_name: "Test7", project_description: "Test7 Desc"}]

    Broadcast - Yes 


## Domains

### Get Domains

Emit on 

    Name space - /domain
    
    Method - getDomains
    
    Arguments - String (project_id) , room_name

Listen On  

    Name space - /domain
    
    Method - allDomains
    
    Response - {}
    
    Broadcast - Yes  
    
    Room - room_name
    

### Create Domain

Emit on 

    Name space - /domain
    
    Method - createDomain
    
    Arguments - 
    {"project_id": "1", "domain_id":"1", "domain_name":"New domain", "domain_description":"Test domain"}, room_name

Record update status  

    Name space - /domain
    
    Method - domainResponse
    
    Response - {'message': 'Domain created with ID inserted_id'} 
    
    Broadcast - No  
    
    Room - Session ID 

Domains Update status 

    Name space - /domain
    
    Method - allDomains
    
    Response - {}
    
    Broadcast - Yes  
    
    Room - room_name

### Delete Domain 

Emit on 

    Name space - /domain
    
    Method - deleteDomain
    
    Arguments - 
    {"project_id": "123", "object_id": "abbsdskdlkscnksnc"}, room_name

Record update status  

    Name space - /domain
    
    Method - domainResponse
    
    Response - {'message': 'Domain deleted with ID {}'.format(delete_result)} 
    
    Broadcast - No  
    
    Room - Session ID 

Domains Update status 

    Name space - /domain
    
    Method - allDomains
    
    Response - {}
    
    Broadcast - Yes  
    
    Room - room_name
    
    
### Update Domain 

Emit on 

    Name space - /domain
    
    Method - updateDomain
    
    Arguments - 
    {"project_id": "123", "object_id": "1233", "domain_id": "1", "domain_name":"name ", "domain_description": "Domain Description"}, room_name

Record update status  

    Name space - /domain
    
    Method - domainResponse
    
    Response - {'message': 'Domain updated with ID {}'.format(update_result)} 
    
    Broadcast - No  
    
    Room - Session ID 

Domains Update status 

    Name space - /domain
    
    Method - allDomains
    
    Response - {}
    
    Broadcast - Yes  
    
    Room - room_name