
const collectBtn = document.getElementById("collectBtn");
const statusEl = document.getElementById("status");
const trimChk = document.getElementById("trimChk");
const previewWrap = document.getElementById("previewWrap");
const previewPre = document.getElementById("preview");
const countEl = document.getElementById("count");

function setStatus(text, ok = false) {
  statusEl.textContent = text || "";
  statusEl.className = "hint" + (ok ? " ok" : "");
}

async function getActiveTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id;
}

async function refreshUI() {
  const tabId = await getActiveTabId();
  if (!tabId) return;

  chrome.storage.sync.get({ trimSubtitle: false }, ({ trimSubtitle }) => {
    trimChk.checked = !!trimSubtitle;
  });

  chrome.tabs.sendMessage(tabId, { type: "GBL_PREVIEW", limit: 10 }, (res) => {
    if (!res) {
      setStatus("這個頁面不在支援的網站（或尚未注入 content script）。");
      collectBtn.disabled = true;
      previewWrap.style.display = "none";
      return;
    }
    if (!res.canExtract) {
      setStatus(res.hint || "這個頁面目前無法擷取。");
      collectBtn.disabled = true;
      previewWrap.style.display = "none";
    } else {
      setStatus("此頁可擷取。", true);
      collectBtn.disabled = false;
      previewWrap.style.display = "";
      previewPre.textContent = res.lines.join("\n");
      countEl.textContent = `共 ${res.total} 筆（預覽 10 筆）`;
    }
  });
}

collectBtn.addEventListener("click", async () => {
  const tabId = await getActiveTabId();
  if (!tabId) return;
  collectBtn.disabled = true;
  setStatus("擷取中…");
  chrome.tabs.sendMessage(tabId, { type: "GBL_COLLECT" }, (res) => {
    if (res?.ok) {
      setStatus(`已複製 ${res.count} 筆到剪貼簿。`, true);
    } else {
      setStatus("擷取失敗或無資料。");
    }
    collectBtn.disabled = false;
    refreshUI();
  });
});

trimChk.addEventListener("change", () => {
  chrome.storage.sync.set({ trimSubtitle: trimChk.checked }, () => {
    refreshUI();
  });
});

document.addEventListener("DOMContentLoaded", refreshUI);
