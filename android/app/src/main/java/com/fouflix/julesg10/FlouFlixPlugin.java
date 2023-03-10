package com.fouflix.julesg10;

import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name="FlouFlix")
public class FlouFlixPlugin  extends Plugin {

    private String EVENT_USER_ADD = "add";

    @Override
    protected void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);

        if(intent == null)
        {
            return;
        }

        String text = intent.getStringExtra("text");
        String file = intent.getStringExtra("file");

        if(text == null && file == null)
        {
            return;
        }

        JSObject ret = new JSObject();
        ret.put("text", text);
        ret.put("file", file);

        this.notifyListeners(EVENT_USER_ADD, ret, true);
    }

}
