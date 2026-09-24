# 下一站，晚安 · Android 工程

这是 Cocos Creator 3.8.8 的 Android 工程，也是《下一站，晚安》的唯一源码仓库。H5/React 游戏主体已经合并到本仓库的 `game/` 目录，打包脚本会从 `game/` 重新构建网页并放入 APK；Android 的 `AppActivity` 通过 WebView 加载包内资源。编辑器里的 `assets/scenes/Main.scene` 则用于 Cocos 预览。

## 单仓库目录

- `game/`：实际游戏逻辑、React UI、战斗系统和测试。
- `assets/`：Cocos 资源，同时保存 H5 与 Cocos 共用的运行时美术/音乐。
- `native/`：Android 原生工程。
- `tools/`：Web、Android、商店素材等统一构建脚本。

不再依赖同级目录 `../mistbound`。首次拉取仓库后，直接双击根目录的 `初始化游戏依赖.bat` 即可安装游戏需要的 Node 依赖；等价命令为：

```bat
cd game
npm ci
```

## 两个渠道包

| 双击入口 | 输出 | 启动行为 |
| --- | --- | --- |
| `TapTap版打包.bat` | `dist/next-stop-goodnight-taptap-时间戳.apk` | 加载 TapTap 登录、实名认证和防沉迷；认证通过后进入游戏；关闭作弊面板 |
| `通用版打包.bat` | `dist/next-stop-goodnight-generic-时间戳.apk` | 直接进入游戏；不包含 TapTap SDK 和 Client ID/Token；保留作弊面板 |

两个包默认使用相同的包名 `com.xyzhi.nextstopgoodnight` 和同一发布证书，不能在一台手机上并存。当前版本为 `1.0.1`（versionCode `2`）。通用版只解决渠道代码隔离，**不自带其他平台要求的登录或防沉迷能力**；在要求相关能力的平台发布前，必须另外接入并测试。

渠道边界在 `native/engine/android/app/src/taptap/java/com/cocos/game/ChannelGate.java` 与 `src/generic/java/com/cocos/game/ChannelGate.java`。通用 `AppActivity.java` 不引用 TapTap；Gradle 的 `taptapImplementation` 只在 TapTap 版打入 SDK。以后新增平台，可按同一方式添加 flavor 和渠道入口，游戏 WebView 代码继续共用。

## 首次准备

1. 首次使用、刚拉取仓库、删除过 `game/node_modules`，或 `game/package-lock.json` 有较大依赖变化时，双击一次 `初始化游戏依赖.bat`。随后用 Cocos Creator 3.8.8 打开本目录，至少构建一次 Android 工程，确保 `build/android-debug/proj` 存在。本机已导出该工程；BAT 复用它进行 Gradle 编译，不会每次重新启动 Creator。若移动了工程目录，需在 Creator 中重新导出，使 `NATIVE_DIR` 指向新位置。
2. 保管 `signing/next-stop-goodnight.jks` 与 `signing/credentials.json`。两者都被 `.gitignore` 排除，丢失后不能用相同包名正常覆盖已发布的 APK。脚本不会擅自生成新证书。
3. TapTap 版需要 Client ID 与 Client Token。可在当前命令行设置 `TAPTAP_CLIENT_ID`、`TAPTAP_CLIENT_TOKEN` 环境变量；双击 BAT 时，可在被忽略的 `signing/taptap-client.json` 中填写 `{"clientId":"...","clientToken":"..."}`。当前本机旧构建的 BuildConfig 也可作为兼容读取来源；清理 `build` 后应改用前两种方式。不要把真实凭证提交到仓库。通用版不需要这两项。

BAT 每次运行 `tools/build-original-web.mjs` 从仓库内 `game/` 更新 H5 资源，运行 `tools/build-android-icons.mjs` 更新图标，再调用对应的 Gradle Release 任务，以时间戳新建 APK 并输出 SHA-256、包名与签名摘要。脚本需要本机已有的 JDK、Android SDK/NDK、Gradle、Ninja，以及 `game/node_modules` 中的 Node 依赖；具体路径集中在 `tools/build-channel-apk.ps1`。

如果改动的是 Cocos 场景或原生工程模板，而不是 H5 内容/图标/渠道代码，请先在 Cocos Creator 的「项目 → 构建发布」重新构建 Android 工程，再双击对应的中文打包 BAT。当前自动化并不替代从零导出 Cocos 工程的验证。

根目录的 `一键提交并推送Git.bat` 用于把当前修改自动暂存、提交并推送到已配置的 `origin`。运行日志会写入 `log/git/`。

## WiFi 真机实时预览

如果需要像正式 APK 一样在安卓手机上全屏竖屏测试，但又不想每次修改都重新打包：

1. 第一次使用时双击 `生成WiFi预览版APK.bat`，把 `dist/wifi-preview.apk` 安装到手机。这个预览 App 的包名是 `com.xyzhi.nextstopgoodnight.preview`，可以和正式版同时安装。
2. 电脑和手机连接同一个 WiFi，然后双击 `WiFi真机预览.bat`。窗口会显示电脑的局域网 IPv4。
3. 第一次打开手机上的“下一站，晚安·WiFi预览”，把电脑窗口显示的 IPv4 填进去并点击“连接电脑预览”。地址会保存在手机本地，之后通常不需要再填。
4. 保持电脑上的预览窗口开启。修改 `game/src` 代码并保存后，手机会通过 Vite 自动刷新或热更新，不需要重新生成 APK。
5. 手机预览 App 内按安卓返回键可以回到 IP 设置。如果电脑的局域网 IP 发生变化，在这里重新填写即可。

WiFi 实时预览使用端口 `7460`，与桌面浏览器预览的 `7458` 分开。若手机无法连接，请确认 Windows 防火墙允许 Node.js 访问“专用网络”，并确认路由器没有开启设备隔离。

## 发布与验证

TapTap 后台应登记与 TapTap APK 一致的包名和 MD5 签名，并开启 TapTap 登录、合规认证。不要上传通用包到 TapTap。审核包上传前，先在 Android 真机上测试启动、登录、实名认证、重启、取消、断网、未成年人限制和正常进入游戏。仅有 Gradle 构建成功，不等于这些运行时流程已通过。

2026-09-18 两个渠道的 Release 构建、包名与签名检查已通过；还未做真机验证。通用 APK 的 DEX 中未检出 TapTap SDK 类或 Client ID。旧的 `tools/build-taptap-apk.ps1` 与 `tools/build-apk.ps1` 保留为兼容入口，分别转到新的 TapTap/通用构建脚本。
