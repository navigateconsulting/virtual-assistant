# EVA API Backend

## Installation 

Use the Dockerfile in api-backend directory. Depends on Mongodb docker container.

## Usage 

This backend used jwt token authentication with flask framework. user model is currently maintained in Monfgodb 
in future it would be replaced with custom authentication schemes eg Microsoft Azure AD

## API Signature

- Refresh Database 

Endpoint - http://localhost:8081/refreshdb
Method POST

This endpoint will refresh the seed data in the Mongo DB. It will remove existing collections in eva_platform database 
and create the collections again with new seed data. All existing data in the DB would be wiped off.

- Register 

Endpoint - http://localhost:8081/registration
Method - POST 
Body 

    username  - Mandatory
    email - Mandatory
    password  Mandatory
    
This endpoint will create a new user

- Login 

Endpoint - http://localhost:8081/login
Method - POST 
Body 

    username  - Mandatory
    email - Mandatory
    password  Mandatory
    
Sample response 

    {
        "message": "Logged in as sai",
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTU5MTUxMTgsIm5iZiI6MTU1NTkxNTExOCwianRpIjoiZTAwODU4MmUtYTY1My00MWI2LWE3YTAtMzI1OWRiZGZlYWExIiwiZXhwIjoxNTU1OTE2MDE4LCJpZGVudGl0eSI6InNhaSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.N2gmkAtK2GxE_MKGYgePC5JGHHOVr7vh5XYsBrwBIKg",
        "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTU5MTUxMTgsIm5iZiI6MTU1NTkxNTExOCwianRpIjoiYzczZmI3OTgtYTI1ZS00ZTYxLWFhZWItYTRlOGNiYzdmNTI2IiwiZXhwIjoxNTU4NTA3MTE4LCJpZGVudGl0eSI6InNhaSIsInR5cGUiOiJyZWZyZXNoIn0.uX23RHu77HnMImcoD7poqSYa55LfYuM6GQF5tdogGPc"
    }

This response body contains access_token and refresh token, Both of these tokens are required while invoking any endpoint 
from here on. access_token has an expiry of 15 mins. after which refresh_token would need to be used to get a fresh access_token. Endpoint for it is described below 

- Test Endpoint with Access token 
End point - http://localhost:8081/secret
Method - Get
Headers 
Authorization "Bearer <access_token>"

This is an test endpoint which will help you check if the token is valid. Use this endpoint with the access_token generated previously


- Logout 

    /logout/access 
    
    Endpoint - http://localhost:8081/logout/access
    Method - Post
    Headers - Authorization "Bearer <access_token>"
    
    Revokes the Access token issued during the login process 
    
    
   /logout/refresh
   Endpoint - http://localhost:8081/logout/refresh
   Method - POST
   Headers Authorization "Bearer <refresh_token>"
   
   Revokes the refresh token issued during the login process 
   
   ** Always invoke both the endpoints to complete the logout process