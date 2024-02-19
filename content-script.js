console.log("content-script.js");
if (new URLSearchParams(window.location.search).get("id") === "47") {
  console.log("content-script.js");
  setTimeout(() => {
    chrome.runtime.sendMessage({ query: "getAutoRemoveStatus" }, (response) => {
      if (response.AutoRemove) {
        if (document.querySelector("#nav")) {
          document.querySelector("#nav").remove();
        }

        if (document.querySelector("#footer")) {
          document.querySelector("#footer").remove();
        }

        document.title = "New Title";

        const css = document.createElement("style");
        css.textContent = `
          #game_frame {
            width: 395px !important;
          }
          
          #webGL-container {
            display: flex;
            justify-content: center;
          }
        `;

        if (document.head) {
          document.head.appendChild(css);
        }
      }
    });
  }, 0);
}
