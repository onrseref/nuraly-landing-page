(function () {
  var APP_ID = "6761827025";
  var APP_STORE_WEB =
    "https://apps.apple.com/tr/app/muslim-prayer-lock-nuraly/id" + APP_ID;
  var APP_STORE_ITMS = "itms-apps://apps.apple.com/app/id" + APP_ID;

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function isInAppBrowser() {
    var ua = navigator.userAgent || "";
    var patterns = [
      /BytedanceWebview/i,
      /musical_ly/i,
      /TikTok/i,
      /trill_/i,
      /Instagram/i,
      /FBAN|FBAV|FB_IAB/i,
    ];
    return patterns.some(function (pattern) {
      return pattern.test(ua);
    });
  }

  function getAppStoreLink() {
    return isIOS() ? APP_STORE_ITMS : APP_STORE_WEB;
  }

  function redirectToAppStore() {
    window.location.href = getAppStoreLink();

    window.setTimeout(function () {
      if (!document.hidden) {
        window.location.href = APP_STORE_WEB;
      }
    }, 1800);
  }

  var manualLink = document.getElementById("manual-app-store-link");
  if (manualLink) {
    manualLink.href = getAppStoreLink();
  }

  if (isInAppBrowser()) {
    window.setTimeout(redirectToAppStore, 400);
  } else {
    redirectToAppStore();
  }
})();
