(function () {
  var APP_ID = "6761827025";
  var APP_STORE_WEB =
    "https://apps.apple.com/tr/app/muslim-prayer-lock-nuraly/id" + APP_ID;
  var APP_STORE_ITMS = "itms-apps://apps.apple.com/app/id" + APP_ID;
  var PAGE_URL = window.location.href.split("#")[0];

  var IN_APP_PATTERNS = [
    /BytedanceWebview/i,
    /musical_ly/i,
    /TikTok/i,
    /trill_/i,
    /Instagram/i,
    /FBAN|FBAV|FB_IAB/i,
    /Twitter/i,
    /LinkedInApp/i,
    /Snapchat/i,
    /Line\//i,
    /MicroMessenger/i,
    /Pinterest/i,
  ];

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  function isInAppBrowser() {
    var ua = navigator.userAgent || "";
    var referrer = document.referrer || "";

    if (IN_APP_PATTERNS.some(function (pattern) {
      return pattern.test(ua);
    })) {
      return true;
    }

    if (/tiktok|instagram|facebook|fb\.com|twitter|t\.co/i.test(referrer)) {
      return true;
    }

    return false;
  }

  function getAppStoreUrl() {
    if (isIOS()) {
      return APP_STORE_ITMS;
    }
    return APP_STORE_WEB;
  }

  function tryOpenExternal(url) {
    if (isIOS()) {
      window.location.href = "x-safari-" + url;
      window.setTimeout(function () {
        window.location.href = url;
      }, 350);
      return;
    }

    if (isAndroid()) {
      var path = url.replace(/^https?:\/\//, "");
      window.location.href =
        "intent://" +
        path +
        "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
        encodeURIComponent(url) +
        ";end";
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openAppStore() {
    window.location.href = getAppStoreUrl();
    window.setTimeout(function () {
      if (!document.hidden) {
        window.location.href = APP_STORE_WEB;
      }
    }, 1500);
  }

  function updateAppStoreLinks() {
    var links = document.querySelectorAll("[data-app-store-link], .app-store-badge, .btn--small[href*='apps.apple.com']");
    var targetUrl = isInAppBrowser() && isIOS() ? APP_STORE_ITMS : APP_STORE_WEB;

    links.forEach(function (link) {
      link.href = targetUrl;
    });
  }

  function copyLink(button) {
    var originalText = button.textContent;

    function onSuccess() {
      button.textContent = "Link kopyalandı ✓";
      window.setTimeout(function () {
        button.textContent = originalText;
      }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(PAGE_URL).then(onSuccess).catch(function () {
        fallbackCopy(onSuccess);
      });
      return;
    }

    fallbackCopy(onSuccess);
  }

  function fallbackCopy(onSuccess) {
    var input = document.createElement("textarea");
    input.value = PAGE_URL;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();

    try {
      document.execCommand("copy");
      onSuccess();
    } catch (error) {
      /* ignore */
    }

    document.body.removeChild(input);
  }

  function showOverlay() {
    var overlay = document.getElementById("in-app-overlay");
    if (!overlay) {
      return;
    }

    overlay.hidden = false;
    overlay.classList.add("is-visible");
    document.body.classList.add("in-app-active");
  }

  function hideOverlay() {
    var overlay = document.getElementById("in-app-overlay");
    if (!overlay) {
      return;
    }

    overlay.classList.remove("is-visible");
    overlay.hidden = true;
    document.body.classList.remove("in-app-active");
  }

  function init() {
    updateAppStoreLinks();

    if (!isInAppBrowser()) {
      return;
    }

    document.body.classList.add("in-app-detected");
    showOverlay();

    var openExternalButton = document.getElementById("open-external-browser");
    var openAppStoreButton = document.getElementById("open-app-store-direct");
    var copyLinkButton = document.getElementById("copy-page-link");
    var continueButton = document.getElementById("continue-in-app");

    if (openExternalButton) {
      openExternalButton.addEventListener("click", function () {
        tryOpenExternal(PAGE_URL);
      });
    }

    if (openAppStoreButton) {
      openAppStoreButton.addEventListener("click", function (event) {
        event.preventDefault();
        openAppStore();
      });
    }

    if (copyLinkButton) {
      copyLinkButton.addEventListener("click", function () {
        copyLink(copyLinkButton);
      });
    }

    if (continueButton) {
      continueButton.addEventListener("click", function () {
        hideOverlay();
      });
    }

    if (isIOS()) {
      window.setTimeout(openAppStore, 800);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
