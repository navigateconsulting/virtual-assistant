from flask_restful import Resource, reqparse
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from models import UserModel, RevokedTokensModel, RefreshSeedData, RasaModel
from bson.json_util import dumps
import json

parser = reqparse.RequestParser()
parser.add_argument('username', help = 'This field cannot be blank', required = True)
parser.add_argument('email', help = 'This field cannot be blank', required = True)
parser.add_argument('password', help = 'This field cannot be blank', required = True)


class RefreshData(Resource):
    def post(self):

        result=RefreshSeedData.load_seed_data()

        return result


class UserRegistration(Resource):
    def post(self):

        data = parser.parse_args()

        user_details={"id": 1 , "username": data['username'] , "email": data['email'] , "passwordhash": UserModel.generate_hash(data['password'])}
        new_user = UserModel()
        user_exists_check = new_user.find_by_user(data['username'])

        if user_exists_check == None:
            res = new_user.create_user(user_details)
            result = {"message": "User created with ID {}".format(res)}
        else:
            result = {"message": "User already exists "}

        return result


class UserLogin(Resource):
    def post(self):
        data = parser.parse_args()

        user_exists = UserModel.find_by_user(self,data['username'])

        if not user_exists:
            return {"message": "User {} does not exist".format(data['username'])}

        if UserModel.verify_hash(data['password'],user_exists['passwordhash']):
            access_token = create_access_token(identity=data['username'])
            refresh_token = create_refresh_token(identity=data['username'])
            return {'message': 'Logged in as {}'.format(data['username']),
                    'access_token': access_token,
                    'refresh_token': refresh_token}
        else:
            return {'message': 'Invalid username or password '}


class UserLogoutAccess(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            RevokedTokensModel.add_revoked_token(jti)
            return {'message': 'Access Token Revoked'}
        except:
            return {"message":"Something Went wrong "},500


class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']

        try:
            RevokedTokensModel.add_revoked_token(jti)
            return {'message': 'Access Token Revoked'}
        except:
            return {"message":"Something Went wrong "},500


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return {'access_token': access_token}


class SecretResource(Resource):
    @jwt_required
    def get(self):
        return {
            'answer': 42
        }


class GetProjects(Resource):
    @jwt_required
    def get(self):
        result = RasaModel.getProjects()
        return json.loads(dumps(result))
