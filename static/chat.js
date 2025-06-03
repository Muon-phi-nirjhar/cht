const socket = io();
const chatBox = document.getElementById('chat-box');
const msgInput = document.getElementById('msg');

// Get and validate username
let username = prompt("Enter your name (N or D):").toUpperCase();
if (username !== "N" && username !== "D") {
    alert("Not allowed. Only N or D");
    document.body.innerHTML = "Access Denied";
    throw new Error("Access blocked");
}

// Helper to append messages with labels
function appendMessage(data) {
    const p = document.createElement('p');
    const label = data.user === "N" ? "🟦 N" : "🟥 D";
    p.innerHTML = `<strong>${label}:</strong> ${data.text}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Load previous messages on connect
socket.on('load_messages', (messages) => {
    chatBox.innerHTML = ""; // Clear chatbox
    messages.forEach(msg => appendMessage(msg));
});

// Listen for new incoming messages
socket.on('message', (data) => {
    appendMessage(data);
});

// Send a message
function sendMsg() {
    const msg = msgInput.value;
    if (msg.trim() === "") return;

    socket.emit('message', {
        user: username,
        text: msg
    });

    msgInput.value = '';
}
