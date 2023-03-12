package com.fouflix.julesg10;

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
    private String EVENT_PLAY_LAST = "onPlayLast";
    private String EVENT_PLAY_NEXT = "onPlayNext";

    private FlouFlixData data;

    public void load()
    {
        this.data = new FlouFlixData(getContext());
    }

    @PluginMethod
    public void setData(PluginCall call)
    {
        String value = call.getString("value");
        this.data.set(value);
        call.resolve();
    }

    @PluginMethod
    public void getData(PluginCall call)
    {
        JSObject ret = new JSObject();
        String value = this.data.get();
        ret.put("value", value);
        call.resolve(ret);
    }

    @Override
    protected void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);

        if(intent == null)
        {
            return;
        }
        if(this.checkIntentAction(intent,"next", EVENT_PLAY_NEXT))
        {
            return;
        }

        if(this.checkIntentAction(intent,"last", EVENT_PLAY_LAST))
        {
            return;
        }

        if(this.checkIntentAction(intent,"ready", EVENT_READY_CREATE))
        {
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


    private boolean checkIntentAction(Intent intent, String key, String event)
    {
        JSObject ret = new JSObject();
        if(intent.getBooleanExtra(key, false))
        {
            ret.put("last", true);
            this.notifyListeners(event, ret, true);
            return true;
        }

        return false;
    }
}
