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

  function showCopyStatus() {
    var status = document.getElementById("copy-status");
    if (!status) {
      return;
    }

    status.hidden = false;
  }

  function showPopup() {
    var popup = document.getElementById("browser-popup");
    if (!popup) {
      return;
    }

    popup.hidden = false;
    popup.classList.add("is-visible");
    document.body.classList.add("popup-open");

    copyToClipboard(PAGE_URL, showCopyStatus);
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
    var copyLinkButton = document.getElementById("copy-link");
    var shareLinkButton = document.getElementById("share-link");
    var closeTargets = document.querySelectorAll("[data-close-popup]");

    if (downloadButton) {
      downloadButton.addEventListener("click", handleDownloadClick);
    }

    if (copyLinkButton) {
      copyLinkButton.addEventListener("click", function () {
        copyToClipboard(PAGE_URL, function () {
          showCopyStatus();
          copyLinkButton.textContent = "Link kopyalandı ✓";
        });
      });
    }

    if (shareLinkButton && navigator.share) {
      shareLinkButton.hidden = false;
      shareLinkButton.addEventListener("click", function () {
        navigator.share({
          title: "Nuraly — App Store'da İndir",
          text: "Nuraly uygulamasını indir",
          url: PAGE_URL,
        }).catch(function () {
          /* user cancelled */
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
