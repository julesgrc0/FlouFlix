package com.fouflix.julesg10;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.annotation.Nullable;
import androidx.core.content.pm.ShortcutInfoCompat;
import androidx.core.content.pm.ShortcutManagerCompat;
import androidx.core.graphics.drawable.IconCompat;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;
import com.google.android.gms.cast.framework.CastContext;

import org.json.JSONException;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {

    private ArrayList<ShortcutInfoCompat> shortcuts = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        this.registerPlugin(FlouFlixPlugin.class);

        super.onCreate(savedInstanceState);
        CastContext.getSharedInstance(this);

        if(getIntent().getAction().equals(Intent.ACTION_MAIN))
        {
            this.updateShortcuts();
        }
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
    protected void onPostCreate(@Nullable Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        getBridge().getWebView().setBackgroundColor(Color.parseColor("#161616"));
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

            String lastTitle = obj.getString("last_title", "");
            if(lastTitle.length() != 0)
            {
                Intent lasti = this.createIntent();
                lasti.putExtra("last", true);

                this.shortcutCreate(lasti,"Regarder "+lastTitle, lastTitle, R.drawable.play_icon, id);
            }

            String nextTitle = obj.getString("next_title", "");
            if(nextTitle.length() != 0)
            {
                Intent nexti = this.createIntent();
                nexti.putExtra("next", true);

                this.shortcutCreate(nexti,"Regarder "+nextTitle, nextTitle, R.drawable.play_icon, id2);
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
