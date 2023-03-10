# FlouFlix

> About FlouFlix

Flouflix is ​​a very simple android application which allows by adding the link to a player, to save your videos and to read them. Convenient to avoid ads from streaming sites, you just have to copy the link of the site's video player and FlouFlix takes care of the rest.

> Shares and add from browser


You can add a link directly by copying it into the browser and selecting the "Add to flouflix" option.
You can also share files with flouflix, so that he can add them. Here is an example:

```
[Series name]
episode 1:https://mylink/video.html
episode 2:https://
episode ...

[Movie name]
movie name:https://mymovie/video.html

[title]
name:link
...
```

> TODO

I didn't want to create a new capacitor plugin, so I temporarily modified the AppPlugin.java file which belongs to @capacitor/app.
So my plugin will have to be created in the future to add these few lines:

```java
/**
* Handle ACTION_VIEW intents to store a URL that was used to open the app
* @param intent
*/
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
    this.notifyListeners(EVENT_URL_OPEN, ret, true);
}
```