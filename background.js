// 安裝腳本時設定 default 值
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ AutoRemove: false });
});

// 當點擊擴展圖標時，這個監聽器將會被觸發
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
          128: iconPath,
        },
      });

      // 這個消息將被發送到 content-script.js ，但是在非 URL 匹配的情況下會導致 Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
      // 因為需要獲取 tab query 去判斷是否是正確的 URL 會需要額外權限，所以這邊就放任它發生錯誤
      chrome.tabs.sendMessage(tab.id, { AutoRemove: isAutoRemoveEnabled });
    });
  });
});

// 當 content-script.js 發送消息時，這個監聽器將會被觸發
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.query === "getAutoRemoveStatus") {
    chrome.storage.local.get("AutoRemove", (data) => {
      sendResponse({ AutoRemove: data.AutoRemove });
    });
    return true;
  }
});

function updateIcon() {
  chrome.storage.local.get("AutoRemove", (data) => {
    const iconPath = data.AutoRemove
      ? "icons/logo-enabled.png"
      : "icons/logo-disabled.png";
    chrome.action.setIcon({
      path: {
        128: iconPath,
      },
    });
  });
}

// 當擴展安裝或更新時設置圖標
chrome.runtime.onInstalled.addListener(updateIcon);

// 當瀏覽器啟動時設置圖標
chrome.runtime.onStartup.addListener(updateIcon);
