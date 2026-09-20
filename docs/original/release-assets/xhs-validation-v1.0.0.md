# 小红书小工具校验摘要

- 项目：下一站，晚安
- 首次发布版本：1.0.0
- 校验规范：小红书 `minitool-zip-builder` 1.4.1
- 发布包：`next-stop-goodnight-xhs-v1.0.0.zip`
- 包体：4.18 MB（低于 10 MB 上限）
- SHA-256：`0CCEFBEDD4CA35CA5F572FD364B17B4ABADE59CA28B29241AD597094F4CB139B`

## 校验结果

- `index.html` 位于 ZIP 根目录，未多套外层文件夹。
- 仅包含 HTML、JS 与 WebP，共 19 个文件，无源码、依赖、Source Map 或构建配置。
- 所有资源均为包内相对路径，无外部网络资源。
- 入口脚本为带 `defer` 的经典外链脚本，无 `type="module"`、`import`、`export` 或 `import.meta`。
- 无内联脚本、行内事件、`eval`、`new Function`、WebAssembly 与禁用联网 API。
- viewport、安全区变量和触摸交互符合模拟器与真机适配要求。
- 当前版本仅使用 `localStorage` 保存进度，不申请相册、摄像头或麦克风权限。
- 自动化测试 33/33 通过；最终静态产物已在浏览器独立加载，控制台无错误。
