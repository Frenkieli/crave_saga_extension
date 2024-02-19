if (new URLSearchParams(window.location.search).get("id") === "47") {
  const title = document.title;
  const iconUrl = document.querySelector('link[rel="shortcut icon"]').href;

  setTimeout(() => {
    chrome.runtime.sendMessage({ query: "getAutoRemoveStatus" }, (response) => {
      if (response.AutoRemove) {
        removeAll();
      }
    });
  }, 0);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.AutoRemove) {
      removeAll();
    } else {
      addAll();
    }
  });

  function addAll() {
    const customStyle = document.getElementById("custom-style");
    if (customStyle) {
      customStyle.remove();
    }

    document.title = title;

    if (document.querySelector('link[rel="shortcut icon"]')) {
      document.querySelector('link[rel="shortcut icon"]').href = iconUrl;
    }
  }

  function removeAll() {
    document.title = chrome.i18n.getMessage("newTitle");

    if (document.querySelector('link[rel="shortcut icon"]')) {
      document.querySelector('link[rel="shortcut icon"]').href =
        chrome.runtime.getURL("icons/logo-enabled.png");
    }

    const css = document.createElement("style");

    css.id = "custom-style";
    css.textContent = `
          #game_frame {
            width: 395px !important;
          }

          #webGL-container {
            display: flex;
            justify-content: center;
          }

          #nav, #footer, .footer_mobileNav.mobile {
            display: none !important;
          }
        `;

    if (document.head) {
      document.head.appendChild(css);
    }
  }
}
