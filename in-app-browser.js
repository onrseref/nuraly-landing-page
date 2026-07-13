(function () {
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

  function tryOpenExternal(url) {
    if (isIOS()) {
      window.location.href = "x-safari-" + url;
      window.setTimeout(function () {
        window.location.href = url;
      }, 350);
      return;
    }

    if (/Android/i.test(navigator.userAgent)) {
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

  function handleAppStoreClick(event) {
    if (!isInAppBrowser()) {
      return;
    }

    event.preventDefault();
    showPopup();
  }

  function init() {
    var links = document.querySelectorAll("[data-app-store-link], .app-store-badge");
    var openInBrowserButton = document.getElementById("open-in-browser");
    var copyLinkButton = document.getElementById("copy-link");
    var closeTargets = document.querySelectorAll("[data-close-popup]");

    links.forEach(function (link) {
      link.addEventListener("click", handleAppStoreClick);
    });

    if (openInBrowserButton) {
      openInBrowserButton.addEventListener("click", function () {
        tryOpenExternal(PAGE_URL);
      });
    }

    if (copyLinkButton) {
      copyLinkButton.addEventListener("click", function () {
        copyLink(copyLinkButton);
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
