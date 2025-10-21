
const el = document.getElementById('trim');
chrome.storage.sync.get({ trimSubtitle: false }, ({ trimSubtitle }) => el.checked = !!trimSubtitle);
el.addEventListener('change', () => chrome.storage.sync.set({ trimSubtitle: el.checked }));
