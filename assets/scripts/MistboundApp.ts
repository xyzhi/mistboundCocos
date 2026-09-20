import { _decorator, Component, resources, sys, TextAsset } from 'cc';

const { ccclass } = _decorator;

@ccclass('MistboundApp')
export class MistboundApp extends Component {
  private preview: HTMLIFrameElement | null = null;
  private message: HTMLDivElement | null = null;

  start() {
    // Android's AppActivity displays the same original game from APK assets.
    if (sys.isNative) return;

    const host = document.getElementById('Cocos3dGameContainer')
      || document.getElementById('GameDiv')
      || document.body;
    host.style.position = 'relative';

    const message = document.createElement('div');
    message.textContent = '正在载入《下一站，晚安》…';
    Object.assign(message.style, {
      position: 'absolute', inset: '0', zIndex: '99', display: 'grid', placeItems: 'center',
      background: '#111615', color: '#e9e5d9', fontSize: '18px', fontFamily: 'sans-serif',
    });
    host.appendChild(message);
    this.message = message;

    resources.load('original/index', TextAsset, (error, asset) => {
      if (!this.node.isValid) return;
      if (error || !asset) {
        message.textContent = `原版游戏加载失败：${error?.message || '资源不存在'}`;
        console.error(error);
        return;
      }

      const frame = document.createElement('iframe');
      frame.title = '下一站，晚安';
      frame.setAttribute('allow', 'autoplay');
      Object.assign(frame.style, {
        position: 'absolute', inset: '0', width: '100%', height: '100%',
        border: '0', zIndex: '100', background: '#111615',
      });
      frame.addEventListener('load', () => message.remove(), { once: true });
      host.appendChild(frame);
      this.preview = frame;
      frame.srcdoc = asset.text;
    });
  }

  onDestroy() {
    this.preview?.remove();
    this.message?.remove();
  }
}
