from flask import Blueprint, jsonify, request
from api.models import User, Category, Notes, CategorySchema, NotesSchema, Reminders
from api import bcrypt, db, cache
from flask_cors import CORS
import uuid, datetime

data = Blueprint('data',__name__)
CORS(data)

@data.route('/notes/create', methods=['POST'])
def notes_create():
    # Check if notes name already exists. Normalize the name.
    note = request.get_json()
    if note:
        note_text = note.get('text')
        user_id = note.get('id')
        category_id = note.get('category_id')
        due_date = note.get('due_date',None)
        public_key = uuid.uuid4().hex
        if due_date:    
            due_date = datetime.datetime.strptime(due_date,"%Y-%m-%d %H:%M:%S")      
            new_note = Notes(note_text=note_text, 
                user_id=user_id, 
                public_key= public_key, 
                category_id=category_id,
                due_date=due_date)
            db.session.add(new_note)
            db.session.commit()    
            reminder = Reminders(note=new_note, reminder_time=due_date,reminder_sent=False)     
            db.session.add(new_note)
            db.session.commit()
        else:
            new_note = Notes(note_text=note_text, 
                user_id=user_id, 
                public_key= public_key, 
                category_id=category_id)
            db.session.add(new_note)
            db.session.commit()
        cache.clear()
        return {"success":"Note added"}
    else:
        return {"error":"invalidinput"}

@data.route('/notes/update', methods=['PUT'])
def notes_update():
    # Check if notes name already exists. Normalize the name.
    note = request.get_json()
    if note:
        note_text = note.get('text')
        note_id = note.get('note_id')
        theNote = Notes.query.filter_by(id=note_id).first()
        theNote.note_text = note_text
        cache.clear()
        db.session.commit()
        return {"success":"Note Updated"}
    else:
        return {"error":"Invalid input"}

@data.route('/notes/delete', methods=['POST'])
def notes_delete():
    # Check if notes name already exists. Normalize the name.
    note = request.get_json()
    print(note)
    if note:
        note_id = note.get('note_id')
        theNote = Notes.query.filter_by(id=note_id).first()
        cache.clear()
        db.session.delete(theNote)
        db.session.commit()
        return {"success":"Note Deleted"}
    else:
        return {"error":"Invalid input"}

@data.route('/categories')
@cache.cached()
def categories():
    category = Category.query.all()
    category_schema = CategorySchema(many=True)
    output = category_schema.dump(category)
    return jsonify({"categories":output})

@data.route('/category/create', methods=['POST'])
def category_create():
    # Check if Category name already exists. Normalize the name.
    category = request.get_json()
    if category:
        category_name = category.get('name')
        category_color = category.get('color')
        new_category = Category(category_name=category_name, category_color=category_color if category_color else None)
        db.session.add(new_category)
        db.session.commit()
        cache.clear()
        return {"success":"Category added"}
    else:
        return {"error":"invalid input"}

@data.route('/category/delete', methods=['POST'])
def category_delete():
	# Check if notes name already exists. Normalize the name.
	category = request.get_json()
	try:
		category_id = category.get('category_id')
		the_category = Category.query.filter_by(id=category_id).first()
		db.session.delete(the_category)
		db.session.commit()
		cache.clear()
		return {"success":"Category Deleted"}
	except:
		return {"error":"Invalid input"}

@data.route('/notes/<name>', methods=['POST'])
@cache.cached()
def user_notes(name):
	token = request.args.get('token')
	current_user = User.verify_token(token)
	try:
		if current_user.name != name:
			raise AttributeError
		notes = Notes.query.filter_by(user_id = current_user.id).all()
		notes_schema = NotesSchema(many=True)
		output = notes_schema.dump(notes)
		return jsonify({"notes":output})
	except AttributeError: 
		return {"error":"Invalid credentials"}



