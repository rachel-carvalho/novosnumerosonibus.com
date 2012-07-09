package com.novosnumerosonibus;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;
import org.json.JSONArray;

public class AdMobPlugin extends Plugin {
  @Override
  public PluginResult execute(String action, JSONArray data, String callback) {
    ((NovosNumerosActivity)this.ctx).allowAd();
    return new PluginResult(Status.OK);
  }
}

