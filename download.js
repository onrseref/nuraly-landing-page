(function () {
  var APP_ID = "6761827025";
  var APP_STORE_WEB =
    "https://apps.apple.com/tr/app/muslim-prayer-lock-nuraly/id" + APP_ID;
  var APP_STORE_ITMS = "itms-apps://apps.apple.com/app/id" + APP_ID;
  var PAGE_URL = window.location.origin + window.location.pathname;

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

    return /tiktok|instagram|facebook|fb\.com|twitter|t\.co/i.test(referrer);
  }

  function openAppStore() {
    window.location.href = isIOS() ? APP_STORE_ITMS : APP_STORE_WEB;
  }

  function copyToClipboard(text, onSuccess) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(function () {
        fallbackCopy(text, onSuccess);
      });
      return;
    }

    fallbackCopy(text, onSuccess);
  }

  function fallbackCopy(text, onSuccess) {
    var input = document.createElement("textarea");
    input.value = text;
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

  function showStatus(message) {
    var status = document.getElementById("browser-status");
    if (!status) {
      return;
    }

    status.textContent = message;
    status.hidden = false;
  }

  function openWithAnchor(url) {
    var link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function openWithScheme(schemeUrl) {
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = schemeUrl;
    document.body.appendChild(iframe);

    window.setTimeout(function () {
      document.body.removeChild(iframe);
    }, 1500);
  }

  function openAndroidIntent(url, packageName) {
    var path = url.replace(/^https?:\/\//, "");
    var intent =
      "intent://" +
      path +
      "#Intent;scheme=https;action=android.intent.action.VIEW;";

    if (packageName) {
      intent +=
        "package=" +
        packageName +
        ";S.browser_fallback_url=" +
        encodeURIComponent(url) +
        ";";
    }

    intent += "end";
    window.location.href = intent;
  }

  function openInSafari(url) {
    copyToClipboard(url, function () {
      showStatus("Safari açılıyor… Açılmazsa link kopyalandı.");
    });

    if (isIOS()) {
      openWithScheme("x-safari-" + url);
      openWithAnchor(url);
      return;
    }

    if (isAndroid()) {
      openAndroidIntent(url, null);
    }
  }

  function openInChrome(url) {
    copyToClipboard(url, function () {
      showStatus("Chrome açılıyor… Açılmazsa link kopyalandı.");
    });

    if (isIOS()) {
      var chromeUrl = url.replace(/^https:\/\//, "googlechromes://");
      openWithScheme(chromeUrl);
      window.location.href = chromeUrl;
      return;
    }

    if (isAndroid()) {
      openAndroidIntent(url, "com.android.chrome");
    }
  }

  function showPopup() {
    var popup = document.getElementById("browser-popup");
    if (!popup) {
      return;
    }

    popup.hidden = false;
    popup.classList.add("is-visible");
    document.body.classList.add("popup-open");
  }

  function hidePopup() {
    var popup = document.getElementById("browser-popup");
    if (!popup) {
      return;
    }

    popup.classList.remove("is-visible");
    popup.hidden = true;
    document.body.classList.remove("popup-open");
  }

  function handleDownloadClick() {
    if (isInAppBrowser()) {
      showPopup();
      return;
    }

    openAppStore();
  }

  function init() {
    var downloadButton = document.getElementById("download-button");
    var safariButton = document.getElementById("open-safari");
    var chromeButton = document.getElementById("open-chrome");
    var copyLinkButton = document.getElementById("copy-link");
    var closeTargets = document.querySelectorAll("[data-close-popup]");

    if (downloadButton) {
      downloadButton.addEventListener("click", handleDownloadClick);
    }

    if (safariButton) {
      safariButton.addEventListener("click", function () {
        openInSafari(PAGE_URL);
      });
    }

    if (chromeButton) {
      chromeButton.addEventListener("click", function () {
        openInChrome(PAGE_URL);
      });
    }

    if (copyLinkButton) {
      copyLinkButton.addEventListener("click", function () {
        copyToClipboard(PAGE_URL, function () {
          copyLinkButton.textContent = "Link kopyalandı ✓";
          showStatus("Link kopyalandı. Safari veya Chrome'da yapıştır.");
        });
      });
    }

    closeTargets.forEach(function (target) {
      target.addEventListener("click", hidePopup);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
