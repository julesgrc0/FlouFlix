package com.fouflix.julesg10;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.annotation.Nullable;
import androidx.core.content.pm.ShortcutInfoCompat;
import androidx.core.content.pm.ShortcutManagerCompat;
import androidx.core.graphics.drawable.IconCompat;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;
import com.google.android.gms.cast.framework.CastContext;

import org.json.JSONException;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {

    private ArrayList<ShortcutInfoCompat> shortcuts = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        this.registerPlugin(FlouFlixPlugin.class);
        super.onCreate(savedInstanceState);

        int darkBg = Color.rgb(20,20,20);
        this.getBridge().getWebView().setBackgroundColor(Color.TRANSPARENT);


        Window window = this.getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(darkBg);

        WindowCompat.setDecorFitsSystemWindows(window, false);
        window.setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setNavigationBarContrastEnforced(false);
        }
        window.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);

        CastContext.getSharedInstance(this);


        Intent intent = getIntent();
        if(intent == null)
        {
            return;
        }

        try{
             if(intent.getAction().equals(Intent.ACTION_MAIN))
            {
                this.updateShortcuts();
            }
        }catch (Exception e) {}
    }

    private void updateShortcuts()
    {
        this.shortcuts.clear();
        this.createShortcutWatch("id1", "id2");
        this.createShortcutAdd("id3");
        ShortcutManagerCompat.setDynamicShortcuts(this.getApplicationContext(), this.shortcuts);
    }

    @Override
    public void onPause() {
        super.onPause();
        this.updateShortcuts();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.updateShortcuts();
    }

    @Override
    protected void onPostCreate(@Nullable Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        getBridge().getWebView().setBackgroundColor(Color.parseColor("#141414"));

    }

    private Intent createIntent()
    {
        Intent intent = new Intent(this.getApplicationContext(), MainActivity.class);
        intent.setAction(Intent.ACTION_VIEW);

        return intent;
    }

    private void createShortcutWatch(String id, String id2)
    {
        FlouFlixData data = new FlouFlixData(this.getApplicationContext());
        try{
            String value = data.get();
            JSObject obj = new JSObject(value == null ? "": value);

            String lastUrl = obj.getString("last", "");
            String lastT = obj.getString("lastTitle", "");
            lastT =( lastT.length() == 0 ?  "Dernier épisode" : lastT);
            if(lastUrl.length() != 0)
            {
                Intent lasti = this.createIntent();
                lasti.putExtra("play", lastUrl);

                this.shortcutCreate(lasti, lastT, lastT, R.drawable.play_icon, id);
            }

            String nextUrl = obj.getString("next", "");
            String nextT = obj.getString("nextTitle", "Épisode suivant");
            nextT = (nextT.length() == 0 ?  "Épisode suivant" : nextT);
            if(nextUrl.length() != 0)
            {
                Intent nexti = this.createIntent();
                nexti.putExtra("play", nextUrl);

                this.shortcutCreate(nexti,nextT, nextT, R.drawable.play_icon, id2);
            }
        } catch (JSONException e) {}

    }

    private void createShortcutAdd(String id)
    {
        Intent intent = this.createIntent();
        intent.putExtra("ready", true);
        this.shortcutCreate(intent, "Ajouter une vidéo", "Ajouter", R.drawable.add_icon, id);
    }

    private void shortcutCreate(Intent intent, String title, String shorttitle,int icon, String id)
    {
        Context ctx = this.getApplicationContext();
        ShortcutInfoCompat shortcut = new ShortcutInfoCompat.Builder(ctx, id)
                .setShortLabel(shorttitle)
                .setLongLabel(title)
                .setIcon(IconCompat.createWithResource(ctx, icon))
                .setIntent(intent)
                .build();

        this.shortcuts.add(shortcut);
    }
}
