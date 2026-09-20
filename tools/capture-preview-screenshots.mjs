import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const output = resolve(import.meta.dirname, '..', 'release-assets', 'taptap-screenshots');
const profile = resolve(import.meta.dirname, '..', 'build', 'screenshot-chrome-profile');
await mkdir(output, { recursive: true });
await mkdir(profile, { recursive: true });

const chrome = spawn(chromePath, [
  '--headless=new', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });

let endpoint;
const ready = new Promise((resolveReady, rejectReady) => {
  let stderr = '';
  chrome.stderr.on('data', chunk => {
    stderr += chunk.toString();
    const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
    if (match) { endpoint = match[1]; resolveReady(); }
  });
  chrome.once('exit', code => rejectReady(new Error(`Chrome exited before DevTools started: ${code}\n${stderr}`)));
  setTimeout(() => rejectReady(new Error(`Chrome start timed out: ${stderr}`)), 15000).unref();
});

try {
  await ready;
  const { port } = new URL(endpoint);
  const targets = await fetch(`http://127.0.0.1:${port}/json`).then(response => response.json());
  const target = targets.find(item => item.type === 'page');
  if (!target) throw new Error('No Chrome page target');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => { ws.onopen = resolveOpen; ws.onerror = rejectOpen; });
  let nextId = 1;
  const pending = new Map();
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const promise = pending.get(message.id);
    if (!promise) return;
    pending.delete(message.id);
    if (message.error) promise.reject(new Error(JSON.stringify(message.error)));
    else promise.resolve(message.result);
  };
  const call = (method, params = {}) => new Promise((resolveCall, rejectCall) => {
    const id = nextId++;
    pending.set(id, { resolve: resolveCall, reject: rejectCall });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const pause = ms => new Promise(resolvePause => setTimeout(resolvePause, ms));
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride', {
    width: 360, height: 640, deviceScaleFactor: 3, mobile: true,
    screenWidth: 360, screenHeight: 640,
  });
  await call('Page.navigate', { url: 'http://127.0.0.1:7458/' });
  for (let attempt = 0; attempt < 20; attempt++) {
    await pause(500);
    const readyText = await evaluate(`(() => {
      const root = document.querySelector('iframe')?.contentDocument || document;
      return root.body?.innerText || '';
    })()`);
    if (readyText.includes('开始游戏')) break;
    if (attempt === 19) throw new Error('Game preview did not become interactive');
  }

  const actions = JSON.parse(process.env.CAPTURE_ACTIONS || '[]');
  for (const [index, action] of actions.entries()) {
    if (action.type === 'click') {
      const clicked = await evaluate(`(() => {
        const root = document.querySelector('iframe')?.contentDocument || document;
        const elements = [...root.querySelectorAll('button, a, [role="button"]')];
        const target = elements.find(el => el.textContent.trim().includes(${JSON.stringify(action.text)}));
        if (!target) return false;
        target.click(); return true;
      })()`);
      if (!clicked) throw new Error(`Could not click text: ${action.text}`);
    } else if (action.type === 'wait') {
      await pause(action.ms);
    }
    await pause(1000);
    const name = action.name || `step-${index + 1}`;
    const { data } = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(join(output, `${name}.png`), Buffer.from(data, 'base64'));
  }
  const info = await evaluate(`(() => {
    const root = document.querySelector('iframe')?.contentDocument || document;
    return {
      text: root.body?.innerText?.slice(0, 2500),
      controls: [...root.querySelectorAll('button, a, [role="button"]')].map(el => el.textContent.trim()).filter(Boolean).slice(0, 60),
    };
  })()`);
  const { data } = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(join(output, 'current.png'), Buffer.from(data, 'base64'));
  process.stdout.write(JSON.stringify(info, null, 2) + '\n');
  ws.close();
} finally {
  chrome.kill();
}
