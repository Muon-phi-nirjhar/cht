from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import eventlet
import json
import os

eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'chatsecret!'
socketio = SocketIO(app, async_mode='eventlet')

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handleMessage(data):
    send(data, broadcast=True)

@socketio.on('seen')
def handleSeen(data):
    print(f"Seen event: Message from {data['from']} seen by {data['by']}")
    emit('seen-notify', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
