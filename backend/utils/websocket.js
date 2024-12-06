const WebSocket = require('ws');

let wss;

const setupWebSocket = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('[WebSocket] Client connected');
        ws.on('close', () => {
            console.log('[WebSocket] Client disconnected');
        });
    });
};

const broadcast = (data) => {
    // console.log('[WebSocket]: Broadcasting: ', data.type);
    if (wss) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
};

module.exports = { setupWebSocket, broadcast };