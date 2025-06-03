from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import json
import os
import eventlet

eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'chatsecret!'
socketio = SocketIO(app, async_mode='eventlet')

MESSAGES_FILE = 'messages.json'

# Load messages from file
def load_messages():
    if os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, 'r') as f:
            return json.load(f)
    return []

# Save messages to file
def save_messages(messages):
    with open(MESSAGES_FILE, 'w') as f:
        json.dump(messages, f)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def on_connect():
    print("A user connected.")
    previous_messages = load_messages()
    emit('load_messages', previous_messages)

@socketio.on('message')
def handleMessage(data):
    print(f"{data['user']}: {data['text']}")
    
    # Load, append, save
    messages = load_messages()
    messages.append(data)
    save_messages(messages)

    send(data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
