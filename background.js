// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ AutoRemove: false }); // 将默认值设置为 false
});

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get("AutoRemove", (data) => {
    const isAutoRemoveEnabled = !data.AutoRemove;

    // 更新 AutoRemove 狀態
    chrome.storage.local.set({ AutoRemove: isAutoRemoveEnabled }, () => {
      // 根據 AutoRemove 的狀態更新圖標
      const iconPath = isAutoRemoveEnabled
        ? "icons/logo-enabled.png"
        : "icons/logo-disabled.png";
      chrome.action.setIcon({
        path: {
          16: iconPath,
        },
      });

      // 向当前标签页的内容脚本发送消息
      chrome.tabs.sendMessage(tab.id, { AutoRemove: isAutoRemoveEnabled });
    });
  });
});

// 在 background.js 中
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.query === "getAutoRemoveStatus") {
    chrome.storage.local.get("AutoRemove", (data) => {
      sendResponse({ AutoRemove: data.AutoRemove });
    });
    return true; // 保持消息通道打开，以便异步发送响应
  }
});

function updateIcon() {
  chrome.storage.local.get("AutoRemove", (data) => {
    const iconPath = data.AutoRemove
      ? "icons/logo-enabled.png"
      : "icons/logo-disabled.png";
    chrome.action.setIcon({ path: iconPath });
  });
}

// 當擴展安裝或更新時設置圖標
chrome.runtime.onInstalled.addListener(updateIcon);

// 當瀏覽器啟動時設置圖標
chrome.runtime.onStartup.addListener(updateIcon);
