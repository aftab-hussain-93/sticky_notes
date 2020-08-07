import os

class Config:
	DEBUG = False
	TESTING = False
	SECRET_KEY = 'secret key'
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	SQLALCHEMY_DATABASE_URI = r"sqlite:///test.db"
	# SQLALCHEMY_DATABASE_URI = r"postgresql://postgres:manager@localhost/postitnotes"
	CACHE_TYPE = "simple"
	CACHE_DEFAULT_TIMEOUT = 300
	MAIL_SERVER = 'smtp.gmail.com'
	MAIL_PORT = 587
	MAIL_USE_TLS = True
	MAIL_USERNAME = os.environ.get('EMAIL_USER')
	MAIL_PASSWORD = os.environ.get('EMAIL_PASS')
	MAIL_DEFAULT_SENDER = os.environ.get('EMAIL_USER')