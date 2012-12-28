package com.novosnumerosonibus;

import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;

public class AdMobPlugin extends CordovaPlugin {
  @Override
  public boolean execute(String action, JSONArray data, CallbackContext callback) throws JSONException {
    ((NovosNumerosActivity)cordova.getActivity()).allowAd();
    return true;
  }
}

