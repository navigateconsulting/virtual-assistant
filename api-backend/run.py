# To Execute the App use - FLASK_RUN_PORT=8000 FLASK_APP=run.py FLASK_DEBUG=1 flask run
from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo

app = Flask(__name__)
api = Api(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/eva_platform"
mongo = PyMongo(app)


app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(app)

app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return models.RevokedTokensModel.is_jti_blacklisted(jti)

import views, models, resources

# Authentication End points

api.add_resource(resources.UserRegistration, '/registration')
api.add_resource(resources.UserLogin, '/login')
api.add_resource(resources.UserLogoutAccess, '/logout/access')
api.add_resource(resources.UserLogoutRefresh, '/logout/refresh')
api.add_resource(resources.TokenRefresh, '/token/refresh')
api.add_resource(resources.SecretResource, '/secret')
api.add_resource(resources.RefreshData, '/refreshdb')

# Load Rasa platform data end points

api.add_resource(resources.GetProjects, '/getprojects')
api.add_resource(resources.UpdateProjects, '/updateprojects')
api.add_resource(resources.DeleteProject, '/deleteproject')
api.add_resource(resources.CreateProject, '/createproject')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)