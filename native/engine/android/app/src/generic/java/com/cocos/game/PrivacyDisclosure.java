package com.cocos.game;

final class PrivacyDisclosure {
    static final String USER_AGREEMENT_SERVICE =
            "一、游戏服务\n"
            + "1. 本游戏当前提供单机游戏内容和设备本地存档。当前通用渠道版本不提供充值、游戏内购买、第三方账号登录或防沉迷认证功能。\n"
            + "2. 游戏内容、功能和规则可能随版本更新而调整，我们会通过游戏页面或相应分发平台以合理方式进行说明。\n\n"
            + "二、账号与存档\n"
            + "1. 当前通用渠道版本不要求注册或登录第三方账号。\n"
            + "2. 游戏进度与设置保存在您的设备本地，卸载应用或清除应用数据可能导致存档丢失。";

    static final String CONSENT_SUMMARY =
            "欢迎使用《下一站，晚安》。游戏进度与设置保存在您的设备本地。"
            + "当前通用渠道版本不包含 TapTap SDK，也不会读取 OAID。\n\n"
            + "请分别阅读下方《用户协议》和《隐私政策》；点击“同意并继续”后进入游戏。";

    static final String USER_AGREEMENT_MINOR_SECTION =
            "未成年人应在监护人陪同下阅读本协议和《隐私政策》，并在取得监护人同意后使用游戏。";

    static final String PRIVACY_PERMISSION_SECTION =
            "当前通用渠道版本不主动申请相机、相册、位置、通讯录等系统敏感权限。"
            + "如后续功能确有必要，我们会先更新说明并按系统要求单独征求授权。";

    static final String PRIVACY_STORAGE_SECTION =
            "游戏进度和设置保存在您的设备本地，当前版本不会由我们上传。"
            + "卸载应用、清除应用数据或设备损坏可能导致存档丢失。";

    static final String PRIVACY_MINOR_SECTION =
            "未成年人应在监护人指导下阅读本政策并使用本游戏。";

    static final String PRIVACY_SDK_SECTION =
            "2. 当前通用渠道版本未集成第三方登录、广告、推送、统计分析、支付或 TapTap SDK，"
            + "不会由本游戏读取 OAID。后续如为其他平台增加必要的渠道服务，我们会先更新本政策与共享清单，"
            + "并在必要时重新征求您的同意。";

    static final String THIRD_PARTY_LIST =
            "《第三方信息共享清单》\n\n"
            + "更新及生效日期：2026年9月19日\n\n"
            + "当前通用渠道版本未集成第三方登录、广告、推送、统计分析、支付或 TapTap SDK，"
            + "没有需要列明的第三方个人信息共享项目。";

    private PrivacyDisclosure() {
    }
}
