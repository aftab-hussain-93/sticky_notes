from flask import current_app
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from api import db, bcrypt, ma

class Base(db.Model):
	__abstract__ = True

	id = db.Column(db.Integer, primary_key=True)
	date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
	date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class User(Base):
	name = db.Column(db.String, nullable=False)
	password = db.Column(db.String, nullable=False)
	email = db.Column(db.String, nullable=False, unique=True)
	notes = db.relationship('Notes', backref='user',lazy=True)

	def hash_password(self):
		self.password = bcrypt.generate_password_hash(self.password).decode('utf8')

	def check_password(self, password):
		return bcrypt.check_password_hash(self.password, password)

	def get_login_token(self, expires_sec=1800):
		s = Serializer(current_app.config['SECRET_KEY'], expires_sec)
		return s.dumps({'user_id':self.id}).decode('utf-8')

	@staticmethod
	def verify_token(token):
		s = Serializer(current_app.config['SECRET_KEY'])
		try:
			user_id = s.loads(token)['user_id']
		except:
			return None
		return User.query.get(user_id)
	
	def __repr__(self):
		return f"Username - {self.name}"

class Category(Base):
	category_name = db.Column(db.String, nullable=False, unique=True)
	category_color = db.Column(db.String, default="#ffcc00")
	notes = db.relationship('Notes', backref='category',lazy=True)

	def __repr__(self):
		return f"Category - {self.category_name}"

class Notes(Base):
	public_key = db.Column(db.String, nullable=False, unique=True)
	note_text = db.Column(db.String, nullable=False)
	due_date = db.Column(db.DateTime)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)

	def __repr__(self):
		return f"Note - {self.note_text}"

class Reminders(Base):
	note_id = db.Column(db.Integer, db.ForeignKey('notes.id'), nullable=False)
	note = db.relationship('Notes', backref='reminder')
	reminder_time = db.Column(db.DateTime)
	reminder_sent = db.Column(db.Boolean)

	def __repr__(self):
		return f"Reminder for note "
		
class UserSchema(ma.SQLAlchemySchema):
	class Meta:
		model = User
	id = ma.auto_field()
	name = ma.auto_field()
	email = ma.auto_field()

class CategorySchema(ma.SQLAlchemyAutoSchema):
	class Meta:
		model = Category

class NotesSchema(ma.SQLAlchemyAutoSchema):
	class Meta:
		model = Notes
	user = ma.Nested(UserSchema)
	category = ma.Nested(CategorySchema)
