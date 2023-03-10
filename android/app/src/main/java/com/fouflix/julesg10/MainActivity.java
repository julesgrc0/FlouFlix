package com.fouflix.julesg10;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.core.content.pm.ShortcutInfoCompat;
import androidx.core.content.pm.ShortcutManagerCompat;
import androidx.core.graphics.drawable.IconCompat;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;
import com.google.android.gms.cast.framework.CastContext;

import org.json.JSONException;

public class MainActivity extends BridgeActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        this.registerPlugin(FlouFlixPlugin.class);

        super.onCreate(savedInstanceState);
        CastContext.getSharedInstance(this);

        ShortcutManagerCompat.removeAllDynamicShortcuts(this.getApplicationContext());
        this.createShortcutWatch("id1");
        this.createShortcutAdd("id2");
    }

    private Intent createIntent()
    {
        Intent intent = new Intent(this.getApplicationContext(), MainActivity.class);
        intent.setAction(Intent.ACTION_VIEW);

        return intent;
    }

    private void createShortcutWatch(String id)
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

        ShortcutManagerCompat.pushDynamicShortcut(this.getApplicationContext(), shortcut);
    }
}
