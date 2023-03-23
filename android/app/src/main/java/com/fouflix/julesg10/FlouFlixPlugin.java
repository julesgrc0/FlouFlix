package com.fouflix.julesg10;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(name="FlouFlix")
public class FlouFlixPlugin  extends Plugin {

    private String EVENT_SHARE_TEXT_DATA = "onTextDataShared";
    private String EVENT_READY_CREATE = "onReadyCreate";
    private String EVENT_PLAY = "onPlay";

    private FlouFlixData data;

    public void load()
    {
        this.data = new FlouFlixData(getContext());

    }

    @PluginMethod
    public void setData(PluginCall call)
    {
        JSObject ret = new JSObject();
        ret.put("next", call.getString("next"));
        ret.put("last", call.getString("last"));
        ret.put("nextTitle", call.getString("nextTitle"));
        ret.put("lastTitle", call.getString("lastTitle"));
        this.data.set(ret.toString());
        call.resolve();
    }

    @Override
    protected void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);

        if(intent == null)
        {
            return;
        }

        String url = intent.getStringExtra("play");
        if(url != null && url.length() != 0)
        {
            JSObject ret = new JSObject();
            ret.put("state", true);
            ret.put("url", url);
            this.notifyListeners(EVENT_PLAY, ret, true);
            return;
        }

        if(intent.getBooleanExtra("ready", false))
        {
            JSObject ret = new JSObject();
            ret.put("state", true);
            ret.put("url", "");
            this.notifyListeners(EVENT_READY_CREATE, ret, true);
            return;
        }

        String text = intent.getStringExtra("text");
        String file = intent.getStringExtra("file");

        JSObject ret = new JSObject();
        if(text != null)
        {
            ret.put("text", text);
        }

        if(file != null)
        {
            ret.put("file", file);
        }

        this.notifyListeners(EVENT_SHARE_TEXT_DATA, ret, true);
    }

}
