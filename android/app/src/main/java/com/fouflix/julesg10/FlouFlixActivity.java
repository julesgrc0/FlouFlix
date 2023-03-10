package com.fouflix.julesg10;

import android.app.SearchManager;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.PersistableBundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

public class FlouFlixActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        Intent main = new Intent(this, MainActivity.class);
        main.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        main.putExtra("text", this.extractQuery(intent));
        main.putExtra("file", this.extractFile(intent));

        this.startActivity(main);
        this.finish();
    }

    private String extractQuery(Intent intent)
    {
        if (intent == null) return null;

        String textSelectionQuery = intent.getStringExtra(Intent.EXTRA_PROCESS_TEXT);
        if (textSelectionQuery != null) return textSelectionQuery;

        String webSearchQuery = intent.getStringExtra(SearchManager.QUERY);
        if (webSearchQuery != null) return webSearchQuery;

        String extraText = intent.getStringExtra(Intent.EXTRA_TEXT);
        if (extraText != null) return extraText;

        return null;
    }

    private String extractFile(Intent intent) {
        Uri file = intent.getParcelableExtra(Intent.EXTRA_STREAM);
        if (file == null) return null;

        StringBuilder fileContent = new StringBuilder();
        try {
            InputStream inputStream = this.getContentResolver().openInputStream(file);
            InputStreamReader streamReader = new InputStreamReader(inputStream);
            BufferedReader reader = new BufferedReader(streamReader);
            while (reader.ready()) {
                String line = reader.readLine();
                fileContent.append(line + "\n");
            }
        } catch (Exception e) {
            return null;
        }
        return fileContent.toString();
    }
}
