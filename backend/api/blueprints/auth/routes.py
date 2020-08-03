from flask import Blueprint, jsonify, request
from api.models import User, Category, Notes, CategorySchema, UserSchema, NotesSchema
from api import bcrypt, db
from flask_cors import CORS
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

@auth.route('/category_create', methods=['POST'])
def category_create():
    # Check if Category name already exists. Normalize the name.
    category = request.get_json()
    if category:
        category_name = category.get('name')
        category_color = category.get('color')
        new_category = Category(category_name=category_name, category_color=category_color if category_color else None)
        db.session.add(new_category)
        db.session.commit()
        return {"success":"Category added"}
    else:
        return {"error":"invalid input"}

@auth.route('/notes/create', methods=['POST'])
def notes_create():
    # Check if notes name already exists. Normalize the name.
    note = request.get_json()
    if note:
        note_text = note.get('text')
        user_id = note.get('id')
        category_id = note.get('category_id')
        new_note = Notes(note_text=note_text, user_id=user_id, public_key=uuid.uuid4().hex, category_id=category_id)
        db.session.add(new_note)
        db.session.commit()
        return {"success":"Note added"}
    else:
        return {"error":"invalid input"}

@auth.route('/notes/update', methods=['PUT'])
def notes_update():
    # Check if notes name already exists. Normalize the name.
    note = request.get_json()
    if note:
        note_text = note.get('text')
        note_id = note.get('note_id')
        theNote = Notes.query.filter_by(id=note_id).first()
        theNote.note_text = note_text
        db.session.commit()
        return {"success":"Note Updated"}
    else:
        return {"error":"Invalid input"}

@auth.route('/notes/delete', methods=['POST'])
def notes_delete():
    # Check if notes name already exists. Normalize the name.
    note = request.get_json()
    print(note)
    if note:
        note_id = note.get('note_id')
        theNote = Notes.query.filter_by(id=note_id).first()
        db.session.delete(theNote)
        db.session.commit()
        return {"success":"Note Deleted"}
    else:
        return {"error":"Invalid input"}

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

@auth.route('/categories')
def categories():
    category = Category.query.all()
    category_schema = CategorySchema(many=True)
    output = category_schema.dump(category)
    return jsonify({"categories":output})





