from flask_mail import Message
from flask import current_app
from api import mail
from threading import Thread


def send_test_email():
	msg = Message("Hello", recipients=["pistaftab1@gmail.com"])
	msg.body = "testing00:25"	
	Thread(target=send_async_email, args=(msg,current_app._get_current_object())).start()

def send_async_email(msg, app):
	with app.app_context():
		mail.send(msg)

def send_password_reset_email(user):
	pass

def send_email(subject, sender, recipients, text_body, html_body):
	msg = Message(subject, sender=sender, recipients=recipients)
	msg.body = text_body
	msg.html = html_body
