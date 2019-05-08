# Ui Trainer backend  - Backend Trainer 


#Socket IO Calls 


##Projects 

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
    
    Arguments - None 

Listen On  

    Name space - /project
    
    Method - allProjects
    
    Response - 
    [{_id: {…}, project_id: 2, project_name: "Project 2", project_description: "Clone of Project 1"}
    {_id: {…}, project_id: "123456", project_name: "Test", project_description: "Test 123"}
    {_id: {…}, project_id: "7", project_name: "Test7", project_description: "Test7 Desc"}]

    Broadcast - Yes 
