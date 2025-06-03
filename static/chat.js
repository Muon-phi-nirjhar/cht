const socket = io();
const chatBox = document.getElementById('chat-box');
const msgInput = document.getElementById('msg');

// Ask for username
let username = prompt("Enter your username:").toUpperCase();
if (username !== "N" && username !== "D") {
    alert("Not allowed. Only N or D");
    document.body.innerHTML = "Access Denied";
    throw new Error("Access blocked");
}

socket.on('message', (data) => {
    const p = document.createElement('p');
    const label = data.user === "N" ? "🟦 N" : "🟥 D";
    p.innerHTML = `<strong>${label}:</strong> ${data.text}`;
    chatBox.appendChild(p);

    // Notify server the message was seen (if from other user)
    if (data.user !== username) {
        socket.emit('seen', { from: data.user, by: username });
    }
});

socket.on('seen-notify', (data) => {
    const p = document.createElement('p');
    p.style.fontStyle = "italic";
    p.style.color = "gray";
    p.textContent = `✔ Seen by ${data.by}`;
    chatBox.appendChild(p);
});

function sendMsg() {
    const msg = msgInput.value;
    if (msg.trim() === "") return;

    socket.emit('message', {
        user: username,
        text: msg
    });

    msgInput.value = '';
}
