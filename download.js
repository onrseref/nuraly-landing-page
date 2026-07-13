(function () {
  var APP_STORE_URL =
    "https://apps.apple.com/tr/app/muslim-prayer-lock-nuraly/id6761827025";

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

  function showCopiedState(button) {
    var status = document.getElementById("copy-status");
    var originalText = button.textContent;

    button.textContent = "Kopyalandı ✓";
    button.classList.add("is-copied");

    if (status) {
      status.hidden = false;
    }

    window.setTimeout(function () {
      button.textContent = originalText;
      button.classList.remove("is-copied");
    }, 2500);
  }

  function init() {
    var copyButton = document.getElementById("copy-button");

    if (!copyButton) {
      return;
    }

    copyButton.addEventListener("click", function () {
      copyToClipboard(APP_STORE_URL, function () {
        showCopiedState(copyButton);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
