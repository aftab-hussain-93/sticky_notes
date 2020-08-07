from flask import Flask
from api.config import Config
from flask_sqlalchemy import SQLAlchemy 
from flask_bcrypt import Bcrypt 
from flask_marshmallow import Marshmallow 
from flask_caching import Cache
from flask_mail import Mail

db = SQLAlchemy()
bcrypt = Bcrypt()
ma = Marshmallow()
cache = Cache()
mail = Mail()

def create_app(config_class=Config):
	app = Flask(__name__, static_folder='../react-frontend/build', static_url_path='/')
	app.config.from_object(Config)
	db.init_app(app)
	bcrypt.init_app(app)
	ma.init_app(app)
	cache.init_app(app)
	mail.init_app(app)
	from api.blueprints.auth.routes import auth
	from api.blueprints.data.routes import data
	app.register_blueprint(auth)
	app.register_blueprint(data)
	with app.app_context():
		db.create_all()
	@app.route('/')
	def index():
		return app.send_static_file('index.html')
	return app
