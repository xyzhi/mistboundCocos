import { networkInterfaces } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const project = resolve(import.meta.dirname, '..');
const game = join(project, 'game');
const port = 7460;

await import(pathToFileURL(join(game, 'scripts', 'embed-audio.mjs')).href);
const viteModule = pathToFileURL(join(game, 'node_modules', 'vite', 'dist', 'node', 'index.js')).href;
const { createServer } = await import(viteModule);

const addresses = [];
for (const entries of Object.values(networkInterfaces())) {
  for (const entry of entries || []) {
    if (entry.family === 'IPv4' && !entry.internal) addresses.push(entry.address);
  }
}

console.log('');
console.log('============================================================');
console.log('《下一站，晚安》WiFi 真机实时预览');
console.log(`端口：${port}`);
if (addresses.length) {
  console.log('请在手机预览版中填写下面任意可用的局域网 IPv4：');
  for (const address of addresses) console.log(`  ${address}   ->   http://${address}:${port}/`);
} else {
  console.log('没有检测到局域网 IPv4，请检查电脑是否已连接 WiFi/局域网。');
}
console.log('');
console.log('服务器保持开启时，修改 game/src 后手机会自动刷新/热更新。');
console.log('关闭本窗口即可停止预览服务器。');
console.log('手机连接失败时，请允许 Node.js 通过 Windows“专用网络”防火墙。');
console.log('============================================================');
console.log('');

const server = await createServer({
  root: game,
  configFile: join(game, 'vite.config.mjs'),
  define: { __MISTBOUND_CHEATS_ENABLED__: 'true' },
  server: {
    host: '0.0.0.0',
    port,
    strictPort: true,
  },
});

await server.listen();
