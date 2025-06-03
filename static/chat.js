const socket = io();
const chatBox = document.getElementById('chat-box');
const msgInput = document.getElementById('msg');

function appendMessage(data) {
    const p = document.createElement('p');
    const label = data.user === "N" ? "🟦 N" : "🟥 D";
    p.innerHTML = `<strong>${label}:</strong> ${data.text}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

socket.on('load_messages', (msgs) => {
    chatBox.innerHTML = '';
    msgs.forEach(appendMessage);
});

socket.on('message', appendMessage);

function sendMsg() {
    const msg = msgInput.value.trim();
    if (!msg) return;

    socket.emit('message', { user: username, text: msg });
    msgInput.value = '';
}
