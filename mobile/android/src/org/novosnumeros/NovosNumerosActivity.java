package org.novosnumeros;

import android.os.Bundle;
import org.apache.cordova.*;
import com.google.ads.*;
import android.os.Handler;
import android.widget.LinearLayout;

public class NovosNumerosActivity extends DroidGap {
	private AdView adView;
	private Handler handler = new Handler();
	
	private int adDelay = 5000;
	private String adMobID = "a14ff6f6ce8c0b6";

	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      super.setIntegerProperty("splashscreen", R.drawable.splash);
      super.loadUrl("file:///android_asset/www/index.html", 10000);

      handler.postDelayed(new Runnable(){
        public void run(){
          showAd();
        }
      }, adDelay);
    }
    
    private void showAd(){
      adView = new AdView(this, AdSize.SMART_BANNER, adMobID);

      LinearLayout layout = super.root;
      layout.addView(adView);

      // centers the ads in landscape mode
      layout.setHorizontalGravity(android.view.Gravity.CENTER_HORIZONTAL);
      
      AdRequest req = new AdRequest();
      req.addTestDevice(AdRequest.TEST_EMULATOR);
      // my test device
      req.addTestDevice("CF95DC53F383F9A836FD749F3EF439CD");

      adView.loadAd(req);
    }
    
    @Override
    public void onDestroy() {
      if (adView != null)
        adView.destroy();
      super.onDestroy();
    }
}
