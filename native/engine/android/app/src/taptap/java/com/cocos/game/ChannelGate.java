package com.cocos.game;

import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.xyzhi.nextstopgoodnight.BuildConfig;
import com.taptap.sdk.core.TapTapRegion;
import com.taptap.sdk.core.TapTapSdk;
import com.taptap.sdk.core.TapTapSdkOptions;
import com.taptap.sdk.initializer.api.TapInitCallback;
import com.taptap.sdk.compliance.TapTapCompliance;
import com.taptap.sdk.compliance.TapTapComplianceCallback;
import com.taptap.sdk.compliance.option.TapTapComplianceOptions;
import com.taptap.sdk.compliance.constants.ComplianceMessage;
import com.taptap.sdk.login.TapTapAccount;
import com.taptap.sdk.login.TapTapLogin;
import com.taptap.sdk.kit.internal.callback.TapTapCallback;
import com.taptap.sdk.kit.internal.exception.TapTapException;

import java.util.Map;

final class ChannelGate {
    private final AppActivity activity;
    private LinearLayout accessPanel;
    private TextView accessMessage;
    private Button accessButton;
    private TapInitCallback initCallback;
    private boolean sdkReady;
    private boolean authenticating;
    private boolean destroyed;

    ChannelGate(AppActivity activity) {
        this.activity = activity;
    }

    void start() {
        showAccessPanel();
        initializeTapTap();
    }

    boolean handleBackPressed() {
        if (accessPanel == null || accessPanel.getVisibility() != View.VISIBLE) return false;
        activity.finish();
        return true;
    }

    void destroy() {
        destroyed = true;
        if (initCallback != null) TapTapSdk.removeInitCallback(initCallback);
    }

    private void showAccessPanel() {
        accessPanel = new LinearLayout(activity);
        accessPanel.setOrientation(LinearLayout.VERTICAL);
        accessPanel.setGravity(Gravity.CENTER);
        accessPanel.setPadding(dp(22), dp(30), dp(22), dp(30));
        accessPanel.setBackgroundColor(Color.rgb(10, 16, 15));

        LinearLayout card = new LinearLayout(activity);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setGravity(Gravity.CENTER_HORIZONTAL);
        card.setPadding(dp(24), dp(28), dp(24), dp(24));
        GradientDrawable cardBackground = new GradientDrawable();
        cardBackground.setColor(Color.rgb(20, 29, 26));
        cardBackground.setCornerRadius(dp(16));
        cardBackground.setStroke(dp(1), Color.rgb(92, 82, 57));
        card.setBackground(cardBackground);

        TextView eyebrow = new TextView(activity);
        eyebrow.setText("TAPTAP · NIGHT JOURNEY");
        eyebrow.setTextColor(Color.rgb(211, 171, 93));
        eyebrow.setTextSize(12);
        eyebrow.setLetterSpacing(0.08f);
        eyebrow.setGravity(Gravity.CENTER);
        card.addView(eyebrow, matchWrap(dp(10)));

        TextView title = new TextView(activity);
        title.setText("登录后，继续旅程");
        title.setTextColor(Color.rgb(245, 240, 225));
        title.setTextSize(25);
        title.setTypeface(Typeface.SERIF, Typeface.BOLD);
        title.setGravity(Gravity.CENTER);
        card.addView(title, matchWrap(dp(14)));

        accessMessage = new TextView(activity);
        accessMessage.setTextColor(Color.rgb(196, 205, 199));
        accessMessage.setTextSize(15);
        accessMessage.setLineSpacing(0, 1.2f);
        accessMessage.setGravity(Gravity.CENTER);
        accessMessage.setText("正在准备 TapTap 实名认证…");
        card.addView(accessMessage, matchWrap(dp(22)));

        accessButton = new Button(activity);
        accessButton.setText("使用 TapTap 登录");
        accessButton.setTextColor(Color.rgb(12, 25, 18));
        accessButton.setTextSize(17);
        accessButton.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        accessButton.setAllCaps(false);
        accessButton.setPadding(dp(18), 0, dp(18), 0);
        GradientDrawable buttonBackground = new GradientDrawable();
        buttonBackground.setColor(Color.rgb(174, 205, 148));
        buttonBackground.setCornerRadius(dp(10));
        buttonBackground.setStroke(dp(1), Color.rgb(207, 226, 184));
        accessButton.setBackground(buttonBackground);
        accessButton.setVisibility(View.GONE);
        accessButton.setOnClickListener(view -> login());
        card.addView(accessButton, new LinearLayout.LayoutParams(-1, dp(54)));

        TextView hint = new TextView(activity);
        hint.setText("登录完成后，将进行实名认证与防沉迷核验");
        hint.setTextColor(Color.rgb(133, 145, 139));
        hint.setTextSize(12);
        hint.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams hintParams = matchWrap(0);
        hintParams.topMargin = dp(14);
        card.addView(hint, hintParams);

        accessPanel.addView(card, new LinearLayout.LayoutParams(-1, -2));

        ((FrameLayout) activity.findViewById(android.R.id.content)).addView(accessPanel,
                new FrameLayout.LayoutParams(-1, -1));
    }

    private void initializeTapTap() {
        initCallback = new TapInitCallback() {
            @Override public void onInitSuccess() {
                activity.runOnUiThread(() -> {
                    if (destroyed) return;
                    sdkReady = true;
                    TapTapCompliance.registerComplianceCallback(new TapTapComplianceCallback() {
                        @Override public void onComplianceResult(int code, Map<String, ?> extra) {
                            activity.runOnUiThread(() -> {
                                if (!destroyed) handleCompliance(code);
                            });
                        }
                    });
                    TapTapAccount account = TapTapLogin.getCurrentTapAccount();
                    if (account == null) requireLogin("请先登录 TapTap，再完成实名认证。");
                    else startCompliance(account);
                });
            }

            @Override public void onInitFail(int errorCode, String errorMsg) {
                activity.runOnUiThread(() -> {
                    if (!destroyed) requireLogin("TapTap 初始化失败（" + errorCode + "），请检查网络及应用配置。");
                });
            }
        };
        TapTapSdk.addInitCallback(initCallback);
        TapTapSdkOptions options = new TapTapSdkOptions(
                BuildConfig.TAPTAP_CLIENT_ID, BuildConfig.TAPTAP_CLIENT_TOKEN, TapTapRegion.CN);
        options.setScreenOrientation(0);
        options.setEnableLog(BuildConfig.DEBUG);
        TapTapSdk.init(activity, options, new TapTapComplianceOptions(false, false));
    }

    private void login() {
        if (!sdkReady || authenticating) return;
        authenticating = true;
        accessButton.setEnabled(false);
        accessButton.setAlpha(0.55f);
        accessMessage.setText("正在登录 TapTap…");
        TapTapLogin.loginWithScopes(activity, new String[]{"basic_info"},
                new TapTapCallback<TapTapAccount>() {
                    @Override public void onSuccess(TapTapAccount account) {
                        activity.runOnUiThread(() -> {
                            if (destroyed) return;
                            authenticating = false;
                            startCompliance(account);
                        });
                    }
                    @Override public void onFail(TapTapException error) {
                        activity.runOnUiThread(() -> {
                            if (destroyed) return;
                            authenticating = false;
                            requireLogin("TapTap 登录失败，请检查网络后重试。");
                        });
                    }
                    @Override public void onCancel() {
                        activity.runOnUiThread(() -> {
                            if (destroyed) return;
                            authenticating = false;
                            requireLogin("需要登录并完成实名认证后才能进入游戏。");
                        });
                    }
                });
    }

    private void startCompliance(TapTapAccount account) {
        String openId = account == null ? null : account.getOpenId();
        if (openId == null || openId.isEmpty()) {
            requireLogin("无法获取 TapTap 账号标识，请重新登录。");
            return;
        }
        blockGame("正在核验实名认证和游戏时段…", false);
        TapTapCompliance.startup(activity, openId);
    }

    private void handleCompliance(int code) {
        if (code == ComplianceMessage.LOGIN_SUCCESS) {
            accessPanel.setVisibility(View.GONE);
            activity.showOriginalGame();
        } else if (code == ComplianceMessage.SWITCH_ACCOUNT) {
            blockGame("请切换 TapTap 账号后重新认证。", true);
            TapTapLogin.logout();
        } else if (code == ComplianceMessage.PERIOD_RESTRICT
                || code == ComplianceMessage.DURATION_LIMIT
                || code == ComplianceMessage.AGE_LIMIT) {
            blockGame("当前账号暂不能继续游戏，请稍后再试。", false);
            accessButton.setText("重新核验");
            accessButton.setVisibility(View.VISIBLE);
            accessButton.setOnClickListener(view -> startCompliance(TapTapLogin.getCurrentTapAccount()));
        } else if (code == ComplianceMessage.EXITED || code == ComplianceMessage.REAL_NAME_STOP) {
            blockGame("实名认证未完成，无法进入游戏。", false);
            accessButton.setText("重新认证");
            accessButton.setVisibility(View.VISIBLE);
            accessButton.setOnClickListener(view -> startCompliance(TapTapLogin.getCurrentTapAccount()));
        } else if (code == ComplianceMessage.INVALID_CLIENT_OR_NETWORK_ERROR) {
            blockGame("认证失败，请检查网络或 TapTap 应用配置后重试。", false);
            accessButton.setText("重试认证");
            accessButton.setVisibility(View.VISIBLE);
            accessButton.setOnClickListener(view -> startCompliance(TapTapLogin.getCurrentTapAccount()));
        } else {
            blockGame("认证状态异常（" + code + "），请重试。", false);
        }
    }

    private void requireLogin(String message) {
        blockGame(message, sdkReady);
        accessButton.setText("使用 TapTap 登录");
        accessButton.setOnClickListener(view -> login());
    }

    private void blockGame(String message, boolean showButton) {
        activity.hideOriginalGame();
        accessPanel.setVisibility(View.VISIBLE);
        accessPanel.bringToFront();
        accessMessage.setText(message);
        accessButton.setVisibility(showButton ? View.VISIBLE : View.GONE);
        accessButton.setEnabled(true);
        accessButton.setAlpha(1f);
    }

    private LinearLayout.LayoutParams matchWrap(int bottomMargin) {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-1, -2);
        params.bottomMargin = bottomMargin;
        return params;
    }

    private int dp(int value) {
        return Math.round(value * activity.getResources().getDisplayMetrics().density);
    }
}
