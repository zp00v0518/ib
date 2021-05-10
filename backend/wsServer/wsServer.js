const WS = require('ws');
const config = require('../../config');
const sendWSMessage = require('./sendWSMessage');
const handlers = require('./handlers');

class WsServer {
  init(port) {
    this.server = new WS.Server({ port }, () => {
      console.log(`WS-Сервер запущен по адресу http://loclahost:${port}`);
    });
  }
  on(event, callback) {
    this.server.on(event, callback);
  }
}

const wsServer = new WsServer();
wsServer.init(config.server.port.ws);

wsServer.on('connection', async (ws, req) => {
  ws.on('close', () => {
  });
  ws.on('message', async (message) => {
    let data;
    try {
      data = JSON.parse(message);
      const { type } = data;
      if (handlers[type]) {
        const message = await handlers[type](data);
        if (message) {
          sendWSMessage(ws, message);
        }
        return;
      }
      sendWSMessage(ws, data);
    } catch (err) {
      console.log(err);
    }
  });
});
