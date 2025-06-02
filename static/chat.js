const socket = io();
const chatBox = document.getElementById('chat-box');
const msgInput = document.getElementById('msg');

socket.on('message', (data) => {
    const p = document.createElement('p');
    const label = data.user === "N" ? "🟦 N" : "🟥 D";
    p.innerHTML = `<strong>${label}:</strong> ${data.text}`;
    chatBox.appendChild(p);
});
username = prompt("Enter your name (N or D):").toUpperCase();
if (username !== "N" && username !== "D") {
    alert("Not allowed. Only N or D");
    document.body.innerHTML = "Access Denied";
    throw new Error("Access blocked");
}


function sendMsg() {
    const msg = msgInput.value;
    if (msg.trim() === "") return;

    socket.emit('message', {
        user: username,
        text: msg
    });

    msgInput.value = '';
}
