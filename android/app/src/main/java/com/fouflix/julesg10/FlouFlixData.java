package com.fouflix.julesg10;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;

import com.capacitorjs.plugins.preferences.Preferences;
import com.getcapacitor.JSObject;

import org.json.JSONException;

public class FlouFlixData {

    private SharedPreferences preferences;
    private interface PreferencesOperation {
        void execute(SharedPreferences.Editor editor);
    }

    public FlouFlixData(Context context)
    {
        this.preferences = context.getSharedPreferences("FlouFlix", Activity.MODE_PRIVATE);
    }

    public void set(String value)
    {
        executeOperation(editor -> editor.putString("data", value));
    }

    public String get() {
        return preferences.getString("data", null);
    }

    private void executeOperation(PreferencesOperation op) {
        SharedPreferences.Editor editor = preferences.edit();
        op.execute(editor);
        editor.apply();
    }
}
