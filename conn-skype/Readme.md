# Skpe for Buisness Online Connector 


### Discover URL 
    discover_url=http://lyncdiscover.navigateconsulting.in
    
Replace the domain name as per deployment 

### Connection Settings 
    username=user@domain.in
    password=password
These are the connection settings for the EVA chatbot user. 

### Azure AD Application settings    
 
    client_id=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    tenant_id=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Once the Azure AD Application has been created and granted access , client_id and tenant_id 
for the application needs to be specified here

### Rasa Endpoint 

    rasa_url=http://rasa:5005/webhooks/rest/webhook
Rasa Endpoint configuration 