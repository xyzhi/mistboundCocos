package com.xyzhi.nextstopgoodnight.preview;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

public final class PreviewActivity extends Activity {
    private static final String PREFS = "wifi_preview";
    private static final String HOST_KEY = "host";
    private static final int PORT = 7460;

    private FrameLayout root;
    private WebView webView;
    private LinearLayout settingsPanel;
    private EditText hostInput;
    private TextView message;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        configureFullscreen();
        createRoot();
        String host = preferences().getString(HOST_KEY, "").trim();
        if (isValidIpv4(host)) connect(host);
        else showSettings("第一次使用，请填写电脑的局域网 IPv4 地址。");
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
        applyImmersiveMode();
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) applyImmersiveMode();
    }

    @Override
    public void onBackPressed() {
        if (settingsPanel != null && settingsPanel.getVisibility() == View.VISIBLE) {
            finish();
            return;
        }
        if (webView != null) webView.setVisibility(View.GONE);
        showSettings("IP 没变时直接点“连接电脑预览”；也可以修改成新的电脑 IP。");
    }

    private void configureFullscreen() {
        Window window = getWindow();
        window.setStatusBarColor(Color.BLACK);
        window.setNavigationBarColor(Color.BLACK);
        window.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        applyImmersiveMode();
    }

    private void applyImmersiveMode() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }

    private void createRoot() {
        root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(10, 16, 15));
        setContentView(root);
    }

    private void ensureWebView() {
        if (webView != null) return;
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setDefaultTextEncodingName("UTF-8");
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        webView.setBackgroundColor(Color.rgb(17, 22, 21));
        WebView.setWebContentsDebuggingEnabled(true);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }
        });
        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));
    }

    private void connect(String host) {
        if (!isValidIpv4(host)) {
            showSettings("IP 格式不正确，请填写类似 192.168.1.23 的 IPv4 地址。");
            return;
        }
        preferences().edit().putString(HOST_KEY, host).apply();
        hideKeyboard();
        if (settingsPanel != null) settingsPanel.setVisibility(View.GONE);
        ensureWebView();
        webView.setVisibility(View.VISIBLE);
        webView.loadUrl(urlFor(host) + "?preview=" + System.currentTimeMillis());
        webView.bringToFront();
        applyImmersiveMode();
    }

    private void showSettings(String text) {
        if (settingsPanel == null) createSettingsPanel();
        message.setText(text);
        String saved = preferences().getString(HOST_KEY, "").trim();
        if (!saved.isEmpty()) hostInput.setText(saved);
        settingsPanel.setVisibility(View.VISIBLE);
        settingsPanel.bringToFront();
        applyImmersiveMode();
    }

    private void createSettingsPanel() {
        settingsPanel = new LinearLayout(this);
        settingsPanel.setOrientation(LinearLayout.VERTICAL);
        settingsPanel.setGravity(Gravity.CENTER);
        settingsPanel.setPadding(dp(22), dp(28), dp(22), dp(28));
        settingsPanel.setBackgroundColor(Color.rgb(10, 16, 15));

        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(22), dp(24), dp(22), dp(22));
        GradientDrawable cardBackground = new GradientDrawable();
        cardBackground.setColor(Color.rgb(20, 29, 26));
        cardBackground.setCornerRadius(dp(16));
        cardBackground.setStroke(dp(1), Color.rgb(104, 91, 61));
        card.setBackground(cardBackground);

        TextView eyebrow = new TextView(this);
        eyebrow.setText("WIFI · LIVE PREVIEW");
        eyebrow.setTextColor(Color.rgb(211, 171, 93));
        eyebrow.setTextSize(12);
        eyebrow.setLetterSpacing(.08f);
        eyebrow.setGravity(Gravity.CENTER);
        card.addView(eyebrow, matchWrap(dp(8)));

        TextView title = new TextView(this);
        title.setText("下一站，晚安 · 真机预览");
        title.setTextColor(Color.rgb(245, 240, 225));
        title.setTextSize(23);
        title.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        title.setGravity(Gravity.CENTER);
        card.addView(title, matchWrap(dp(14)));

        message = new TextView(this);
        message.setTextColor(Color.rgb(190, 201, 194));
        message.setTextSize(14);
        message.setLineSpacing(0, 1.2f);
        message.setGravity(Gravity.CENTER);
        card.addView(message, matchWrap(dp(16)));

        TextView hint = new TextView(this);
        hint.setText("电脑先双击“WiFi真机预览.bat”。\n"
                + "把电脑窗口显示的局域网 IPv4 填到下面。\n"
                + "手机和电脑需要连接同一个 Wi‑Fi。");
        hint.setTextColor(Color.rgb(150, 162, 155));
        hint.setTextSize(12);
        hint.setLineSpacing(0, 1.15f);
        hint.setGravity(Gravity.CENTER);
        card.addView(hint, matchWrap(dp(16)));

        hostInput = new EditText(this);
        hostInput.setSingleLine(true);
        hostInput.setHint("例如：192.168.1.23");
        hostInput.setTextColor(Color.rgb(236, 239, 232));
        hostInput.setHintTextColor(Color.rgb(112, 126, 119));
        hostInput.setInputType(InputType.TYPE_CLASS_PHONE);
        hostInput.setTextSize(17);
        hostInput.setPadding(dp(14), 0, dp(14), 0);
        GradientDrawable inputBackground = new GradientDrawable();
        inputBackground.setColor(Color.rgb(12, 19, 17));
        inputBackground.setCornerRadius(dp(8));
        inputBackground.setStroke(dp(1), Color.rgb(78, 98, 88));
        hostInput.setBackground(inputBackground);
        card.addView(hostInput, new LinearLayout.LayoutParams(-1, dp(52)));

        Button connect = new Button(this);
        connect.setText("连接电脑预览");
        connect.setAllCaps(false);
        connect.setTextColor(Color.rgb(12, 25, 18));
        connect.setTextSize(16);
        connect.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        GradientDrawable buttonBackground = new GradientDrawable();
        buttonBackground.setColor(Color.rgb(174, 205, 148));
        buttonBackground.setCornerRadius(dp(9));
        connect.setBackground(buttonBackground);
        connect.setOnClickListener(view -> connect(hostInput.getText().toString().trim()));
        LinearLayout.LayoutParams buttonParams = new LinearLayout.LayoutParams(-1, dp(52));
        buttonParams.topMargin = dp(14);
        card.addView(connect, buttonParams);

        TextView footer = new TextView(this);
        footer.setText("连接后为沉浸式全屏竖屏。按安卓返回键可回到 IP 设置。");
        footer.setTextColor(Color.rgb(118, 132, 125));
        footer.setTextSize(11);
        footer.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams footerParams = matchWrap(0);
        footerParams.topMargin = dp(12);
        card.addView(footer, footerParams);

        settingsPanel.addView(card, new LinearLayout.LayoutParams(-1, -2));
        root.addView(settingsPanel, new FrameLayout.LayoutParams(-1, -1));
    }

    private void hideKeyboard() {
        if (hostInput == null) return;
        InputMethodManager keyboard = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        if (keyboard != null) keyboard.hideSoftInputFromWindow(hostInput.getWindowToken(), 0);
    }

    private SharedPreferences preferences() {
        return getSharedPreferences(PREFS, MODE_PRIVATE);
    }

    private static String urlFor(String host) {
        return "http://" + host + ":" + PORT + "/";
    }

    private static boolean isValidIpv4(String value) {
        String[] parts = value.split("\\.");
        if (parts.length != 4) return false;
        for (String part : parts) {
            if (part.isEmpty() || part.length() > 3) return false;
            for (int i = 0; i < part.length(); i++) {
                if (!Character.isDigit(part.charAt(i))) return false;
            }
            try {
                int number = Integer.parseInt(part);
                if (number < 0 || number > 255) return false;
            } catch (NumberFormatException exception) {
                return false;
            }
        }
        return true;
    }

    private LinearLayout.LayoutParams matchWrap(int bottomMargin) {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-1, -2);
        params.bottomMargin = bottomMargin;
        return params;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
