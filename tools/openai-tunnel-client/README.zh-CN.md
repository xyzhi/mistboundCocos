# OpenAI Secure MCP Tunnel

已安装并校验 OpenAI 官方 `tunnel-client` 0.0.14。

1. 在 <https://platform.openai.com/settings/organization/tunnels> 创建 Tunnel，复制 `tunnel_id`。
2. 在 <https://platform.openai.com/settings/organization/api-keys> 创建 Runtime API Key。创建者需要 `Tunnels Read + Use` 权限。
3. 双击 `configure.cmd`，依次输入 Tunnel ID 和 Runtime API Key。密钥输入不会显示，密钥只保存在本机 `private` 目录，并限制为当前 Windows 用户访问。
4. 在 ChatGPT 插件页面新增连接，连接方式选择 `Tunnel`，选择该 Tunnel 或填写 `tunnel_id`。

当前固定 Tunnel ID：`tunnel_6ab0a417b19081919f6904e740ac8560`。Windows 计划任务 `OpenAI Secure MCP - mistbound-cocos` 会在登录后等待 SSRDOG 代理端口，然后自动恢复连接。

不要把 Runtime API Key 发送到聊天或提交到版本库。
