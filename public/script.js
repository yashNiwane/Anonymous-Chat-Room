let passcode;
let chatContainer = document.getElementById('chatContainer');
let chat = document.getElementById('chat');
let socket;

function connect() {
    const passcodeInput = document.getElementById('passcode');

    passcode = passcodeInput.value;

    if (passcode.length !== 4 || isNaN(passcode)) {
        alert('Invalid passcode. Please enter a 4-digit number.');
    } else {
        // Connect to the server using WebSocket
        socket = io();

        // Notify the server about the passcode
        socket.emit('join', passcode);

        // Show the chat container
        chatContainer.style.display = 'block';
        passcodeInput.disabled = true;

        // Listen for incoming messages from the server
        socket.on('message', (message) => {
            displayMessage(message);
        });
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    // Send the message to the server
    socket.emit('message', message);

    // Display the message locally
    displayMessage(`You: ${message}`);

    // Clear the input field
    messageInput.value = '';
}

function displayMessage(message) {
    // Append the message to the chat div
    chat.innerHTML += `<p>${message}</p>`;
}
