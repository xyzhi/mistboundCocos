package com.cocos.game;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

public final class PrivacyActivity extends Activity {
    private static final String PREFERENCES = "privacy_consent";
    private static final String ACCEPTED_VERSION = "accepted_version";
    private static final int POLICY_VERSION = 2;
    private static final int PAGE_PADDING_DP = 24;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        window.setStatusBarColor(Color.rgb(17, 22, 21));
        window.setNavigationBarColor(Color.rgb(17, 22, 21));
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);

        if (preferences().getInt(ACCEPTED_VERSION, 0) >= POLICY_VERSION) {
            enterGame();
            return;
        }
        setContentView(createConsentView());
    }

    private View createConsentView() {
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(17, 22, 21));
        root.setPadding(dp(20), dp(20), dp(20), dp(20));

        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(PAGE_PADDING_DP), dp(PAGE_PADDING_DP),
                dp(PAGE_PADDING_DP), dp(20));
        GradientDrawable background = new GradientDrawable();
        background.setColor(Color.WHITE);
        background.setCornerRadius(dp(18));
        card.setBackground(background);

        TextView title = new TextView(this);
        title.setText("用户协议与隐私政策");
        title.setTextColor(Color.rgb(24, 33, 31));
        title.setTextSize(22);
        title.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        title.setGravity(Gravity.CENTER);
        card.addView(title, matchWrap(dp(8)));

        TextView summary = new TextView(this);
        summary.setText(PrivacyDisclosure.CONSENT_SUMMARY);
        summary.setTextColor(Color.rgb(63, 72, 70));
        summary.setTextSize(15);
        summary.setLineSpacing(0, 1.25f);
        card.addView(summary, matchWrap(dp(18)));

        TextView documents = new TextView(this);
        documents.setText(createDocumentLinks());
        documents.setMovementMethod(LinkMovementMethod.getInstance());
        documents.setHighlightColor(Color.TRANSPARENT);
        documents.setGravity(Gravity.CENTER);
        documents.setTextSize(15);
        card.addView(documents, matchWrap(dp(22)));

        LinearLayout actions = new LinearLayout(this);
        actions.setOrientation(LinearLayout.HORIZONTAL);
        actions.setGravity(Gravity.CENTER);

        Button reject = new Button(this);
        reject.setText("不同意并退出");
        reject.setAllCaps(false);
        reject.setOnClickListener(view -> rejectAndExit());
        actions.addView(reject, weightedButton(dp(8)));

        Button accept = new Button(this);
        accept.setText("同意并继续");
        accept.setAllCaps(false);
        accept.setTextColor(Color.WHITE);
        GradientDrawable acceptBackground = new GradientDrawable();
        acceptBackground.setColor(Color.rgb(36, 139, 111));
        acceptBackground.setCornerRadius(dp(8));
        accept.setBackground(acceptBackground);
        accept.setOnClickListener(view -> acceptAndEnter());
        actions.addView(accept, weightedButton(0));
        card.addView(actions, new LinearLayout.LayoutParams(-1, dp(50)));

        FrameLayout.LayoutParams cardParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.CENTER);
        root.addView(card, cardParams);
        return root;
    }

    private SpannableString createDocumentLinks() {
        SpannableString text = new SpannableString("请分别阅读并同意《用户协议》和《隐私政策》");
        setLink(text, 8, 14, () -> showUserAgreement(this));
        setLink(text, 15, 21, () -> showPrivacyPolicy(this));
        return text;
    }

    private void setLink(SpannableString text, int start, int end, Runnable action) {
        text.setSpan(new ClickableSpan() {
            @Override public void onClick(View widget) {
                action.run();
            }
        }, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }

    private static String userAgreement() {
        return "《下一站，晚安》用户协议\n\n"
                + "更新及生效日期：2026年9月19日\n\n"
                + "欢迎使用《下一站，晚安》。本协议由您与游戏开发者小i工作室共同订立。请您在开始游戏前认真阅读并理解本协议；如您不同意本协议，请选择“不同意并退出”。\n\n"
                + PrivacyDisclosure.USER_AGREEMENT_SERVICE + "\n\n"
                + "三、用户行为规范\n"
                + "您不得利用本游戏实施违法行为，不得通过破解、篡改、作弊工具、非法复制或干扰服务等方式损害游戏、其他用户或第三方的合法权益。\n\n"
                + "四、知识产权\n"
                + "除依法属于第三方的内容外，本游戏的软件、文字、美术、音乐、角色及相关内容的知识产权由开发者或合法权利人享有。本协议仅授予您个人、非商业、可撤销的使用许可。\n\n"
                + "五、本地存档与服务变更\n"
                + "游戏进度和设置主要保存在您的设备本地。卸载游戏、清除应用数据、设备损坏或系统异常可能导致存档丢失，请您谨慎操作。因维护、升级、不可抗力或第三方服务异常，部分功能可能暂时中断。\n\n"
                + "六、未成年人保护\n"
                + PrivacyDisclosure.USER_AGREEMENT_MINOR_SECTION + "\n\n"
                + "七、协议更新与终止\n"
                + "如本协议发生重要变更，我们会以弹窗或其他显著方式提示。您可以随时停止使用并卸载游戏；如您严重违反本协议或法律法规，我们可以依法停止提供相关服务。\n\n"
                + "八、适用法律与争议解决\n"
                + "本协议适用中华人民共和国大陆地区法律。发生争议时，双方应先友好协商；协商不成的，可依法向有管辖权的人民法院提起诉讼。\n\n"
                + "九、联系我们\n"
                + "开发者：小i工作室\n联系邮箱：xxxyyyzzzhi@163.com";
    }

    private static String privacyPolicy() {
        return "《下一站，晚安》隐私政策\n\n"
                + "更新及生效日期：2026年9月19日\n\n"
                + "小i工作室（以下称“我们”）重视您的个人信息与隐私保护。请在使用《下一站，晚安》前阅读本政策。您可以选择不同意；在您同意前，我们不会启动游戏主进程及渠道SDK。\n\n"
                + "一、我们如何处理信息\n"
                + "1. 游戏存档：游戏进度、设置等数据保存在您的设备本地，用于继续游戏。当前版本不会由我们上传游戏存档。卸载应用或清除应用数据可能导致存档丢失。\n"
                + PrivacyDisclosure.PRIVACY_SDK_SECTION + "\n\n"
                + "二、权限与网络\n"
                + PrivacyDisclosure.PRIVACY_PERMISSION_SECTION + "\n\n"
                + "三、共享与委托处理\n"
                + "除本政策及下方《第三方信息共享清单》列明的服务外，我们不会主动向其他第三方提供您的个人信息。第三方服务会按照其隐私政策处理信息。\n\n"
                + PrivacyDisclosure.THIRD_PARTY_LIST + "\n\n"
                + "四、保存与保护\n"
                + PrivacyDisclosure.PRIVACY_STORAGE_SECTION + "\n\n"
                + "五、您的权利\n"
                + "您可以拒绝本政策并退出应用；可以通过清除应用数据删除本地存档；如需查询、更正或删除由第三方服务处理的信息，请按照对应第三方隐私政策提供的方式操作。\n\n"
                + "六、未成年人保护\n"
                + PrivacyDisclosure.PRIVACY_MINOR_SECTION + "\n\n"
                + "七、联系我们\n"
                + "开发者：小i工作室\n联系邮箱：xxxyyyzzzhi@163.com\n\n"
                + "八、政策更新\n"
                + "如处理目的、方式或范围发生重大变化，我们会更新本政策，并在必要时再次征求您的同意。";
    }

    static void showUserAgreement(Activity activity) {
        showDocument(activity, "用户协议", userAgreement());
    }

    static void showPrivacyPolicy(Activity activity) {
        showDocument(activity, "隐私政策", privacyPolicy());
    }

    private static void showDocument(Activity activity, String title, String body) {
        TextView content = new TextView(activity);
        content.setText(body);
        content.setTextColor(Color.rgb(34, 42, 40));
        content.setTextSize(14);
        content.setLineSpacing(0, 1.25f);
        content.setPadding(dp(activity, 22), dp(activity, 12),
                dp(activity, 22), dp(activity, 20));
        content.setTextIsSelectable(true);
        ScrollView scroll = new ScrollView(activity);
        scroll.addView(content, new ScrollView.LayoutParams(-1, -2));
        AlertDialog dialog = new AlertDialog.Builder(activity)
                .setTitle(title)
                .setView(scroll)
                .setNegativeButton("关闭", null)
                .create();
        dialog.setOnShowListener(ignored -> {
            Window window = dialog.getWindow();
            if (window != null) window.setLayout(-1,
                    (int) (activity.getResources().getDisplayMetrics().heightPixels * 0.82f));
        });
        dialog.show();
    }

    private void acceptAndEnter() {
        if (!preferences().edit().putInt(ACCEPTED_VERSION, POLICY_VERSION).commit()) {
            new AlertDialog.Builder(this).setMessage("无法保存隐私授权状态，请重试。")
                    .setPositiveButton("知道了", null).show();
            return;
        }
        enterGame();
    }

    private void enterGame() {
        startActivity(new Intent(this, AppActivity.class));
        finish();
    }

    private void rejectAndExit() {
        preferences().edit().remove(ACCEPTED_VERSION).commit();
        finishAndRemoveTask();
    }

    private SharedPreferences preferences() {
        return getSharedPreferences(PREFERENCES, MODE_PRIVATE);
    }

    private LinearLayout.LayoutParams matchWrap(int bottomMargin) {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-1, -2);
        params.bottomMargin = bottomMargin;
        return params;
    }

    private LinearLayout.LayoutParams weightedButton(int rightMargin) {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, -1, 1);
        params.rightMargin = rightMargin;
        return params;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private static int dp(Activity activity, int value) {
        return Math.round(value * activity.getResources().getDisplayMetrics().density);
    }
}
