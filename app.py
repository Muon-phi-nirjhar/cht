from flask import Flask, render_template
from flask_socketio import SocketIO, send
import eventlet
eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'chatsecret!'
socketio = SocketIO(app, async_mode='eventlet')  # Use eventlet

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handleMessage(data):
    print(f"{data['user']}: {data['text']}")
    send(data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
