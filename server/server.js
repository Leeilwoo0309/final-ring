const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000 });
const fs = require("fs");

const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    clients.forEach((e, i) => {
        // console.log(i);
    });


    console.log('Client connected.');

    ws.on('message', (message) => {
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected.');
    });
});

console.log('WebSocket server is running on port 8080');