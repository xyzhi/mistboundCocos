package com.cocos.game;

// Other stores can replace this gate without shipping TapTap classes or credentials.
final class ChannelGate {
    private final AppActivity activity;

    ChannelGate(AppActivity activity) {
        this.activity = activity;
    }

    void start() {
        activity.showOriginalGame();
    }

    boolean handleBackPressed() {
        return false;
    }

    void destroy() {
    }
}
