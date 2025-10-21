const { findSite, getBooksFromSite } = window.GBL || {};

async function getTrimSetting() {
  return new Promise(resolve => {
    chrome.storage.sync.get({ trimSubtitle: false }, ({ trimSubtitle }) => resolve(!!trimSubtitle));
  });
}

function trimColon(title, on) {
  return on ? title.replace(/：.+$/, "") : title;
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

function canExtractNow() {
  if (!findSite) return false;
  const site = findSite(document);
  if (!site) return false;
  try {
    const books = getBooksFromSite(site, document);
    return books.length > 0;
  } catch {
    return false;
  }
}

function updateIcon() {
  const on = canExtractNow();
  chrome.runtime.sendMessage({ type: "GBL_ICON", on });
}

(function observePage() {
  let lastHref = location.href;
  const origPush = history.pushState;
  const origReplace = history.replaceState;
  function onUrlChange() {
    if (location.href !== lastHref) {
      lastHref = location.href;
      setTimeout(updateIcon, 250);
    }
  }
  history.pushState = function (...args) { origPush.apply(this, args); onUrlChange(); };
  history.replaceState = function (...args) { origReplace.apply(this, args); onUrlChange(); };
  window.addEventListener("popstate", onUrlChange);

  const mo = new MutationObserver(() => {
    if (observePage._tick) return;
    observePage._tick = setTimeout(() => {
      observePage._tick = null;
      updateIcon();
    }, 300);
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  updateIcon();
})();

async function collectAndCopy() {
  if (!findSite) {
    alert("內容腳本尚未就緒。");
    return { ok: false, count: 0, lines: [] };
  }
  const site = findSite(document);
  if (!site) {
    alert("這個頁面不在支援的書櫃/列表裡。");
    return { ok: false, count: 0, lines: [] };
  }
  const books = getBooksFromSite(site, document);
  if (!books.length) {
    alert(site.hint || "找不到書籍列表。");
    return { ok: false, count: 0, lines: [] };
  }
  const trim = await getTrimSetting();
  const lines = books.map(b => `${trimColon(b.name || "", trim)}\t${b.author || ""}`);
  const ok = await writeClipboard(lines.join("\n") + "\n");
  if (!ok) {
    alert("寫入剪貼簿失敗，請檢查權限或重試。");
    return { ok: false, count: books.length, lines };
  }
  alert(`${books.length} ${books.length === 1 ? "book" : "books"} are collected.`);
  return { ok: true, count: books.length, lines };
}

async function previewLines(limit = 10) {
  if (!findSite) return { canExtract: false, hint: "內容腳本尚未就緒", lines: [] };
  const site = findSite(document);
  if (!site) return { canExtract: false, hint: "不是支援的網站或頁面", lines: [] };
  const books = getBooksFromSite(site, document);
  const canExtract = books.length > 0;
  const trim = await getTrimSetting();
  const all = books.map(b => `${trimColon(b.name || "", trim)}\t${b.author || ""}`);
  return { canExtract, hint: site.hint, lines: all.slice(0, limit), total: all.length };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    if (msg?.type === "GBL_COLLECT") {
      const res = await collectAndCopy();
      sendResponse(res);
    } else if (msg?.type === "GBL_PREVIEW") {
      const res = await previewLines(msg.limit ?? 10);
      sendResponse(res);
    } else if (msg?.type === "GBL_CAN_EXTRACT") {
      sendResponse({ canExtract: canExtractNow() });
    }
  })();
  return true;
});
