const { WebSocketServer, WebSocket } = require('/usr/local/lib/node_modules/openclaw/node_modules/ws');
const LISTEN_PORT = 18790;
const TARGET = 'ws://127.0.0.1:18789';

function patchParams(text) {
  try {
    const msg = JSON.parse(text);
    if (msg && msg.params && typeof msg.params === 'object' && 'paperclip' in msg.params) {
      delete msg.params.paperclip;
      console.log('[proxy] stripped paperclip from', msg.type, 'params');
      return JSON.stringify(msg);
    }
    if (msg && typeof msg === 'object') {
      console.log('[proxy] msg type:', msg.type, 'keys:', Object.keys(msg).join(','));
    }
  } catch (e) {
    console.log('[proxy] non-JSON msg len:', text.length);
  }
  return text;
}

const wss = new WebSocketServer({ port: LISTEN_PORT, host: '0.0.0.0' });

wss.on('connection', (client, req) => {
  console.log('[proxy] new connection from', req.socket.remoteAddress);
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (k !== 'host') headers[k] = v;
  }
  const target = new WebSocket(TARGET, { headers });
  target.on('open', () => {
    client.on('message', (data, isBinary) => {
      if (!isBinary) {
        const patched = patchParams(data.toString());
        target.send(patched);
      } else {
        target.send(data);
      }
    });
    client.on('close', () => target.close());
    client.on('error', () => target.close());
  });
  target.on('message', (data, isBinary) => {
    if (client.readyState === WebSocket.OPEN) client.send(data, { binary: isBinary });
  });
  target.on('close', () => client.close());
  target.on('error', (e) => { console.error('[proxy] target err:', e.message); client.close(); });
});

wss.on('listening', () => console.log('gateway-proxy listening on 0.0.0.0:' + LISTEN_PORT + ' -> ' + TARGET));
