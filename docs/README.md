# 《下一站，晚安》文档导航

这里保存了原 H5 项目 `E:\work\RedBook\Test\mistbound` 的游戏文档。主文档按原目录结构复制，小红书工具参考集中在 `xhs-tooling/`；所有副本内容保持原样，方便与原项目对照。当前 Cocos 工程的打开、预览、APK 构建和 TapTap 风险说明以[工程 README](../README.md)为准。

原项目将游戏定位为**移动端优先的房车旅店肉鸽卡牌 RPG**：三名角色、随机路线、卡组构筑、随机装备、六章故事与长期成长。这个定位及规则的详细出处如下。

| 文档 | 内容 | 在当前工程中的用途 |
| --- | --- | --- |
| [原项目 README](original/README.md) | 游戏循环、原 H5 开发与验证方式 | 了解完整玩法；其中的 `npm` 命令只在原项目运行 |
| [开发交接规则](original/HANDOFF.md) | 产品定位、已确认规则、视觉交互和原项目代码结构 | 游戏设计参考；其中的小红书发布及 Git 约束属于原项目 |
| [主线与支线剧情](original/STORY_AND_SIDE_QUESTS.md) | 六章叙事、支线方案及部分实装参数 | 剧情设计与内容核对；区分建议和“当前实装”章节 |
| [卡牌统一价值表](original/CARD_BALANCE.md) | 卡牌成长、掉落、敌人和装备平衡 | 数值参考；实际效果以原项目代码为准 |
| [卡牌系统重构说明](original/CARD_SYSTEM_REFACTOR.md) | 阶段性重构目标、历史现状和验收场景 | 追溯设计决策，不把待办项当作已完成功能 |
| [小红书发布信息](original/release-assets/xhs-release-info.md)、[历史校验摘要](original/release-assets/xhs-validation-v1.0.0.md) | 小红书小工具 v1.0.0 的发布记录 | 历史资料，不是 TapTap APK 的发布文案或校验结果 |
| [小红书打包参考](original/xhs-tooling/SKILL.md) | 原项目 `.codex` 的 ZIP 构建说明及其 references | 仅用于查看旧平台约束，不用于本工程构建 |

## 路径和版本的对应关系

- 移植文档中的 `src/game.mjs`、`src/main.jsx`、`src/styles.css`、`scripts/`、`tests/`、`package.json` 和 `dist/`，除非上下文明确写明 Cocos，否则均指**原 H5 项目**。本工程只存放 Cocos 场景、原生 WebView 容器和重新构建的网页产物；游戏逻辑的可编辑源码仍在原项目。
- 修改原游戏玩法或界面，应在原 H5 项目改源码，再通过本工程的 `tools/build-original-web.mjs` 与相关构建脚本更新包内资源。只编辑这里的文档不会改变 APK。
- 原项目 `package.json` 的版本为 `1.0.1`，历史小红书记录为 `1.0.0`，当前 TapTap APK 候选包的 Android `versionName` 为 `1.0`。这些版本分别属于不同产物，不能互相代替。
- 原项目的 `.codex/SKILL.md` 与 `.codex/minitool-zip-builder/SKILL.md` 及七份参考文件逐字节相同，因此这里只保留一套副本。工具依赖与缓存中的 README 未纳入游戏文档。
