package org.novosnumeros;

import android.os.Bundle;
import org.apache.cordova.*;
import com.google.ads.*;
import android.os.Handler;
import android.widget.LinearLayout;
import android.util.Log;

public class NovosNumerosActivity extends DroidGap {
  private AdView adView;
  private Handler handler = new Handler();

  private int adDelay = 50;
  private String adMobID = "a14ff6f6ce8c0b6";
  private LinearLayout adContainer;

  /** Called when the activity is first created. */
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    super.setIntegerProperty("splashscreen", R.drawable.splash);
    super.loadUrl("file:///android_asset/www/index.html", 10000);

    adContainer = super.root;
    adContainer.setHorizontalGravity(android.view.Gravity.CENTER_HORIZONTAL);

    handler.postDelayed(new Runnable(){
      public void run(){
        showAd();
      }
    }, adDelay);
  }

  private boolean canShowAd = false;

  public void allowAd(){
  canShowAd = true;
  }

  private void showAd(){
    if(!canShowAd){
      handler.postDelayed(new Runnable(){
        public void run(){
          showAd();
        }
      }, adDelay);
      return;
    }

    adView = new AdView(this, AdSize.SMART_BANNER, adMobID);

    adContainer.addView(adView);

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
