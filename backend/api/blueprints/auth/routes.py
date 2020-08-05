from flask import Blueprint, jsonify, request, current_app
from api.models import User, Category, Notes, CategorySchema, UserSchema, NotesSchema
from api import bcrypt, db, mail
from flask_cors import CORS
from flask_mail import Message
from api.utils import send_password_reset_email, send_test_email
import uuid

auth = Blueprint('auth',__name__)
CORS(auth)

@auth.route('/signin', methods = ['POST'])
def signin():
    user_schema = UserSchema()
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email:
        return jsonify({'error':'no credentials provided'}), 400
    user = User.query.filter_by(email=email).first()
    isAuthenticated = user.check_password(password) if user else False
    if isAuthenticated:
       # Send the marshmallow serialized object back
       output = user_schema.dump(user)
       output['token'] = user.get_login_token()
       return jsonify({"user":output})
    else:
       return jsonify({"error":"not a user"})

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    password = data.get('password')
    email = data.get('email')
    if not name or not password or not email:
        return jsonify({'error':'no name provided'}), 400

    user = User.query.filter_by(name=name).first()
    if user:
        return jsonify({'error':'Invalid name. Already exists.'}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'error':'Invalid email address. Already exists.'}), 400

    new_user = User(name=name, email=email, password=password)
    new_user.hash_password()
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'user' :f'{email}' }), 201

# Admin Routes
@auth.route('/users')
def users():
    users = User.query.all()
    user_schema = UserSchema(many=True)
    output = user_schema.dump(users)
    return jsonify({"users":output})

@auth.route('/notes')
def notes():
    notes = Notes.query.all()
    notes_schema = NotesSchema(many=True)
    output = notes_schema.dump(notes)
    return jsonify({"notes":output})

@auth.route('/send/email')
def send_reminder():
    send_test_email()
    return {"message":"Email sent"}





