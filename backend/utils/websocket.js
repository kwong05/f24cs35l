const WebSocket = require('ws');

let wss;

const setupWebSocket = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
};

const broadcast = (data) => {
    //console.log('Broadcasting:', data);
    if (wss) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
};

module.exports = { setupWebSocket, broadcast };