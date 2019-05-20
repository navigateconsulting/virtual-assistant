# Ui Trainer backend  - Backend Trainer 

<<<<<<< HEAD

#Socket IO Calls 


=======
#Socket IO Calls 

>>>>>>> 78b303980a5ddee6b11762fb8359a23827a939ea
##Projects 


## Rooms 

### Join Rooms 

Emit on 

    Name space - /
    
    Method - join_room
    
    Argument - 
    namespace_name , room_name



### Get projects 

<<<<<<< HEAD
=======
Get list of all projects 

>>>>>>> 78b303980a5ddee6b11762fb8359a23827a939ea

Emit on 

    Name space - /project
    
    Method - getProjects
    
    Arguments - None 

Listen On  

    Name space - /project
    
    Method - allProjects
    
    Response - 
    [{'_id': {'$oid': '5cd920645290f01deb51d87a'}, 
        'project_name': 'Base Project', 
        'project_description': 'Base project', 
        'status': 0, 
        'created_by': 'trainer', 
        'source': '-'}, 
     {'_id': {'$oid': '5cd920645290f01deb51d87b'}, 
        'project_name': 'Project 2', 
        'project_description': 'Clone of Project 1', 
        'status': 0, 
        'created_by': 'trainer', 
        'source': '-'}
     ]

    Broadcast - Yes 

### Create Project 

<<<<<<< HEAD
=======
Create a new project 

Validation - Check if project name already exists 

>>>>>>> 78b303980a5ddee6b11762fb8359a23827a939ea
Emit on 

    Name Space - /project
    
    Method - createProject
    
    Argument - 
        {  "project_name" : "〈project name〉",
           "project_description":"〈project description〉",
           "status":0,
           "created_by":"username",
           "source":"Copied from Project 1"
        }

Listen On 

Record update status 

    Name space - /project
    
    Method - projectResponse
    
    Response 
        {"status":"Success", message: "Project created with ID 5cd29631464026722d63ec30 "}
        
    Broadcast - No  (Sent to the emitter only)

New projects status

    Name space - /project
    
    Method - allProjects
    
    Response - 
    [{'_id': {'$oid': '5cd920645290f01deb51d87a'}, 
        'project_name': 'Base Project', 
        'project_description': 'Base project', 
        'status': 0, 
        'created_by': 'trainer', 
        'source': '-'}, 
     {'_id': {'$oid': '5cd920645290f01deb51d87b'}, 
        'project_name': 'Project 2', 
        'project_description': 'Clone of Project 1', 
        'status': 0, 
        'created_by': 'trainer', 
        'source': '-'}
     ]

    Broadcast - Yes 


### Delete Project

<<<<<<< HEAD
=======
Delete an existing project

>>>>>>> 78b303980a5ddee6b11762fb8359a23827a939ea
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
        {"status":"Success", message: "Project Deleted with ID 5cd29631464026722d63ec30 "}
        
    Broadcast - No  (Sent to the emitter only)

New projects status

    Name space - /project
    
    Method - allProjects
    
    Response - 
    [{'_id': {'$oid': '5cd920645290f01deb51d87a'}, 
        'project_name': 'Base Project', 
        'project_description': 'Base project', 
        'status': 0, 
        'created_by': 'trainer', 
        'source': '-'}, 
     {'_id': {'$oid': '5cd920645290f01deb51d87b'}, 
        'project_name': 'Project 2', 
        'project_description': 'Clone of Project 1', 
        'status': 0, 
        'created_by': 'trainer', 
        'source': '-'}
     ]

    Broadcast - Yes 
    
### Update Project

<<<<<<< HEAD
=======
Update Project name and description of an existing project 

Validation - Check if the project name already exists 

>>>>>>> 78b303980a5ddee6b11762fb8359a23827a939ea
Emit On 

    Name Space - /project
    
    Method - updateProject
    
    Argument - 
        {"object_id": "123", "project_name": "project_name", "project_description" : "project description"}


Listen On 

Record update status 

    Name space - /project
    
    Method - projectResponse
    
    Response 
        {"status":"Success", "message": "Updated project with row 1"}
        
    Broadcast - No  (Sent to the emitter only)

New projects status

    Name space - /project
    
    Method - allProjects
    
    Response - 
    [{'_id': {'$oid': '5cd920645290f01deb51d87a'}, 
        'project_name': 'Base Project', 
        'project_description': 'Base project', 
        'status': 0, 
        'created_by': 'trainer', 
        'source': '-'}, 
     {'_id': {'$oid': '5cd920645290f01deb51d87b'}, 
        'project_name': 'Project 2', 
        'project_description': 'Clone of Project 1', 
        'status': 0, 
        'created_by': 'trainer', 
        'source': '-'}
     ]

    Broadcast - Yes 

<<<<<<< HEAD
=======
### Copy project 

Copies current project into a new project , with all project dependents , eg copy domains , intents entities etc 

>>>>>>> 78b303980a5ddee6b11762fb8359a23827a939ea

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
    {"project_id": "1", "domain_name":"New domain", "domain_description":"Test domain"}, room_name

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
    {"project_id": "123", "object_id": "1233", "domain_name":"name ", "domain_description": "Domain Description"}, room_name

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


## Intents


### Get Intents 

### Create Intents 

### Delete intents 

### Update Intents 

## Response

### Get Responses

### Create Response 

### Delete Response

### Update Response


## Stories

### Get Stories

### Create Story

### Delete Story

### Update Story
