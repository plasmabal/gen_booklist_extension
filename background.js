chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "gbl_collect",
    title: "GenBooklist：擷取此頁書目",
    contexts: ["all"]
  });
  chrome.contextMenus.create({
    id: "gbl_trim",
    title: "Trim subtitle（裁掉副標）",
    type: "checkbox",
    contexts: ["all"],
    checked: false
  });

  chrome.storage.sync.get({ trimSubtitle: false }, ({ trimSubtitle }) => {
    chrome.contextMenus.update("gbl_trim", { checked: trimSubtitle });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;
  if (info.menuItemId === "gbl_collect") {
    chrome.tabs.sendMessage(tab.id, { type: "GBL_COLLECT" });
  } else if (info.menuItemId === "gbl_trim") {
    const checked = info.checked === true;
    await chrome.storage.sync.set({ trimSubtitle: checked });
    chrome.tabs.sendMessage(tab.id, { type: "GBL_CONF_CHANGED", trimSubtitle: checked });
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg?.type === "GBL_ICON") {
    const tabId = sender?.tab?.id || msg.tabId;
    if (!tabId) return;
    const on = !!msg.on;
    const path = on
      ? {16:"icons/icon16_dot.png",32:"icons/icon32_dot.png",48:"icons/icon48_dot.png",128:"icons/icon128_dot.png"}
      : {16:"icons/icon16.png",32:"icons/icon32.png",48:"icons/icon48.png",128:"icons/icon128.png"};
    chrome.action.setIcon({ tabId, path });
  }
});
