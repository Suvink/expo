"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSplashStrings = setSplashStrings;
exports.withAndroidSplashStrings = void 0;
function _configPlugins() {
  const data = require("@expo/config-plugins");
  _configPlugins = function () {
    return data;
  };
  return data;
}
function _getAndroidSplashConfig() {
  const data = require("./getAndroidSplashConfig");
  _getAndroidSplashConfig = function () {
    return data;
  };
  return data;
}
const RESIZE_MODE_KEY = 'expo_splash_screen_resize_mode';
const STATUS_BAR_TRANSLUCENT_KEY = 'expo_splash_screen_status_bar_translucent';
const FADE_TIME_KEY = 'expo_splash_screen_fade_time';
const defaultResizeMode = 'contain';
const withAndroidSplashStrings = (config, splash) => {
  return (0, _configPlugins().withStringsXml)(config, config => {
    const splashConfig = (0, _getAndroidSplashConfig().getAndroidSplashConfig)(config);
    if (splashConfig) {
      var _config$androidStatus;
      const resizeMode = (splash === null || splash === void 0 ? void 0 : splash.resizeMode) || defaultResizeMode;
      const statusBarTranslucent = !!((_config$androidStatus = config.androidStatusBar) !== null && _config$androidStatus !== void 0 && _config$androidStatus.translucent);
      const fadeTime = `${splash === null || splash === void 0 ? void 0 : splash.fadeTime}`;
      config.modResults = setSplashStrings(config.modResults, resizeMode, statusBarTranslucent, fadeTime);
    }
    return config;
  });
};
exports.withAndroidSplashStrings = withAndroidSplashStrings;
function setSplashStrings(strings, resizeMode, statusBarTranslucent, fadeTime) {
  return _configPlugins().AndroidConfig.Strings.setStringItem([_configPlugins().AndroidConfig.Resources.buildResourceItem({
    name: RESIZE_MODE_KEY,
    value: resizeMode,
    translatable: false
  }), _configPlugins().AndroidConfig.Resources.buildResourceItem({
    name: STATUS_BAR_TRANSLUCENT_KEY,
    value: String(statusBarTranslucent),
    translatable: false
  }), _configPlugins().AndroidConfig.Resources.buildResourceItem({
    name: FADE_TIME_KEY,
    value: String(fadeTime),
    translatable: false
  })], strings);
}
//# sourceMappingURL=withAndroidSplashStrings.js.map