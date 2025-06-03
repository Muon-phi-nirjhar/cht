// First: get username BEFORE connecting socket
let username = prompt("Enter your name :");
if (!username) username = "";
username = username.toUpperCase();

if (username !== "N" && username !== "D") {
    alert("Not allowed. Only N or D");
    document.body.innerHTML = "Access Denied";
    throw new Error("Access blocked");
}

const socket = io();
const chatBox = document.getElementById('chat-box');
const msgInput = document.getElementById('msg');

// Append a message
function appendMessage(data) {
    const p = document.createElement('p');
    const label = data.user === "N" ? "🟦 N" : "🟥 D";
    p.innerHTML = `<strong>${label}:</strong> ${data.text}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Load old messages
socket.on('load_messages', (messages) => {
    chatBox.innerHTML = "";
    messages.forEach(appendMessage);
});

// Handle new message
socket.on('message', appendMessage);

// Send message
function sendMsg() {
    const msg = msgInput.value;
    if (msg.trim() === "") return;

    socket.emit('message', {
        user: username,
        text: msg
    });

    msgInput.value = '';
}
