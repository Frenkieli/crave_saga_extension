if (new URLSearchParams(window.location.search).get("id") === "47") {
  const title = document.title;

  setTimeout(() => {
    chrome.runtime.sendMessage({ query: "getAutoRemoveStatus" }, (response) => {
      if (response.AutoRemove) {
        removeAll();
      }
    });
  }, 0);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.AutoRemove === false) {
      const customStyle = document.getElementById("custom-style");
      if (customStyle) {
        customStyle.remove();
      }

      document.title = title;
    } else {
      removeAll();
    }
  });

  function removeAll() {
    document.title = "New Title";
    const css = document.createElement("style");

    css.id = "custom-style"; // 给<style>元素设置一个唯一的id
    css.textContent = `
          #game_frame {
            width: 395px !important;
          }

          #webGL-container {
            display: flex;
            justify-content: center;
          }

          #nav, #footer {
            display: none;
          }
        `;

    if (document.head) {
      document.head.appendChild(css);
    }
  }
}
