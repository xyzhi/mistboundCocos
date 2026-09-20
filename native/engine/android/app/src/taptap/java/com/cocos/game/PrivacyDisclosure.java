package com.cocos.game;

final class PrivacyDisclosure {
    static final String USER_AGREEMENT_SERVICE =
            "一、游戏服务\n"
            + "1. 本游戏当前提供单机游戏内容、设备本地存档，以及 TapTap 渠道登录、实名认证和防沉迷服务。当前版本不提供充值或游戏内购买功能。\n"
            + "2. 游戏内容、功能和规则可能随版本更新而调整，我们会通过游戏页面、TapTap 商店页面或其他合理方式进行说明。\n\n"
            + "二、账号、实名与防沉迷\n"
            + "1. TapTap 渠道版本使用 TapTap 账号登录。您应妥善保管自己的账号，不得冒用他人身份信息。\n"
            + "2. 根据网络游戏管理及未成年人保护要求，用户需要完成实名认证。未完成认证、认证失败或处于受限时段时，可能无法进入游戏。\n"
            + "3. TapTap 账号、实名认证和防沉迷能力由相应服务提供方提供，个人信息处理规则请查看《隐私政策》。";

    static final String CONSENT_SUMMARY =
            "欢迎使用《下一站，晚安》。为提供 TapTap 登录、实名认证和防沉迷服务，"
            + "在您同意后，我们会启动 TapSDK。该 SDK 可能读取 OAID、Android ID、"
            + "设备型号、系统版本、CPU/内存信息、网络及 Wi-Fi 状态，并处理 TapTap 账号标识和认证结果。\n\n"
            + "在您点击“同意并继续”前，我们不会启动游戏主进程或 TapTap SDK。";

    static final String USER_AGREEMENT_MINOR_SECTION =
            "未成年人应在监护人陪同下阅读本协议和《隐私政策》，并在取得监护人同意后使用游戏。"
            + "我们将依照实名认证结果执行相应的防沉迷限制。";

    static final String PRIVACY_PERMISSION_SECTION =
            "应用使用互联网、网络状态和Wi-Fi状态权限，用于 TapTap 登录、实名认证、防沉迷以及网络连接判断。"
            + "我们不会在您同意本政策前主动申请系统敏感权限。";

    static final String PRIVACY_STORAGE_SECTION =
            "本地存档保存在您的设备内。TapTap 账号和合规认证相关数据的保存期限与安全措施，"
            + "以相应服务提供方的政策及法律要求为准。";

    static final String PRIVACY_MINOR_SECTION =
            "我们通过 TapTap 实名认证和防沉迷能力落实未成年人游戏时段等限制。"
            + "未成年人应在监护人指导下阅读并使用本游戏。";

    static final String PRIVACY_SDK_SECTION =
            "2. 渠道登录与合规认证：在您同意后，为提供 TapTap 登录、实名认证和防沉迷服务，"
            + "TapSDK 可能读取 OAID、Android ID、设备型号、设备制造商、操作系统及版本、"
            + "CPU/内存信息、网络类型和 Wi-Fi 状态，并处理 TapTap 账号 OpenID、登录状态与实名认证结果。"
            + "处理方式包括由 SDK 在设备端读取并通过加密网络传输至服务提供方；使用频次以初始化、"
            + "登录、认证及故障排查所必需的最低频次为限。我们不通过本游戏获取或保存您的身份证号码原文。";

    static final String THIRD_PARTY_LIST =
            "《第三方信息共享清单》\n\n"
            + "更新及生效日期：2026年9月19日\n\n"
            + "SDK名称：TapSDK（TapTap 登录、合规认证）\n"
            + "服务提供方：易玩（上海）网络科技有限公司\n"
            + "使用目的：提供 TapTap 账号登录、实名认证、防沉迷时段限制、网络连接判断及故障排查。\n"
            + "可能处理的信息：OAID、Android ID、设备型号、设备制造商、操作系统及版本、CPU信息、"
            + "设备内存信息、网络类型、网络状态、Wi-Fi状态、TapTap账号OpenID、登录状态、实名认证结果。\n"
            + "处理方式：SDK在用户同意后初始化，在实现上述功能所必需时于设备端读取，并通过加密网络传输。\n"
            + "使用场景及频次：用户同意后初始化；用户登录或进行合规认证时调用；设备及网络信息按每次冷启动、"
            + "登录、认证或故障排查所必需的最低频次处理。\n"
            + "第三方隐私政策：https://developer.taptap.cn/docs/sdk/start/agreement/\n\n"
            + "除以上服务外，当前 TapTap 渠道版本未接入广告、推送、统计分析或支付 SDK。";

    private PrivacyDisclosure() {
    }
}
