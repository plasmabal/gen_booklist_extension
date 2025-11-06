# gen_booklist_extension

`gen_booklist_extension` is a **Chrome extension** version of [gen_booklist](https://github.com/plasmabal/gen_booklist).
It detects supported book sites automatically and lets you collect book information (title, author, etc.) directly from your online bookshelf pages.

When you open a supported page, the extension icon shows a red dot 🔴 indicating that the site is supported.
Click the icon to collect the book list — the book info will be copied to your clipboard, ready to be pasted into Excel or Google Sheets.

This project is inspired by [this presentation](https://docs.google.com/presentation/d/1WMrwjj6R927XEYJKVX4eqGnJKkJ9s-8wTrl8ckd9ws8/edit?fbclid=IwAR1BDVfNE1L2uIowHP97S768LXodbvTzokMpzdA9oP1KBEhio6kBDHnMrJI#slide=id.gc2c595ec36_0_7) by **高振綱**, originally shared in the Facebook group *Readmoo讀墨×mooInk 線上討論區*.
The original was a Tampermonkey script — this version is a fully standalone Chrome extension.

---

## 🌟 Install from Chrome Web Store

You can install the extension directly from the Chrome Web Store:

👉 [**GenBooklist (Chrome Web Store)**](https://chromewebstore.google.com/detail/genbooklist/japbpdbkcdnjpgealpdkdhglpkogiifn)

---

## 🔧 Manual Installation (Developer Mode)

If you prefer to install manually or test the development version:

1. Download this repository as a ZIP file and extract it.
2. Open **Chrome** (or **Edge**) and visit: `chrome://extensions/`
3. Turn on **Developer mode** (top-right corner).
4. Click **Load unpacked**.
5. Select the folder containing `manifest.json`.

---

## 🚀 How to Use

1. Open a supported bookshelf page (see list below).
When supported, the extension icon will display a red dot 🔴.

2. Ensure the displayed books are sorted or filtered as desired — only visible books on the page will be collected.

3. Click the **extension icon**.
A popup will appear showing available actions (e.g. “Collect book list”).

4. Choose the action to collect book info.
The extension extracts book data (title and author) and copies it to your clipboard.

5. Open **Excel** or **Google Sheets** and paste (Ctrl + V / ⌘ + V).
You’ll see your complete book list ready for further processing.

---

## 🌐 Supported Sites

| Site | URL | Notes |
|------|-----|-------|
| Readmoo | https://read.readmoo.com/ | 書櫃 > 書籍、列表 |
| Kobo | https://www.kobo.com/tw/zh/library |  |
| Books | https://viewer-ebook.books.com.tw/viewer/index.html |  |
| HyRead | http://ebook.hyread.com.tw/Template/store/member/my_bookcase_column_list.jsp | 列表頁限定 |
| Pubu | https://www.pubu.com.tw/bookshelf |  |
| Google Play Books | https://play.google.com/books |  |
| MyBook | https://mybook.taiwanmobile.com/bookcase/list |  |
| Amazon US | https://www.amazon.com/hz/mycd/digital-console/contentlist/ |  |
| HamiBook | https://webreader.hamibook.com.tw/HamiBookcase#/ |  |
| Amazon CN | https://www.amazon.cn/hz/mycd/digital-console/contentlist/ |  |
| BOOKWALKER TW | https://www.bookwalker.com.tw/bookcase/available_book_list |  |

---

## 🧩 Technical Overview

`gen_booklist_extension` is built as a modern Chrome extension with the following structure:

| File | Purpose |
|------|----------|
| `manifest.json` | Declares permissions, scripts, and icons |
| `background.js` | Detects supported sites, updates the badge icon |
| `content.js` | Extracts book data from the active page |
| `popup.html` / `popup.js` | User interface for triggering actions |
| `utils.js` | Shared helper functions |

When a supported domain is detected, `background.js` signals the popup to enable the **Collect** button and displays a red indicator on the extension icon.

---

## 🧪 Development Notes

- To reload during development, go to `chrome://extensions/` and click **Reload (⟳)**.
- Use `console.log()` for debugging both `background.js` and `content.js`.
- **Background logs:** `chrome://extensions/` → “Inspect views: background page”
- **Content logs:** Chrome DevTools (F12) → Console
- To add support for a new site, update the domain detection list in `background.js` and parsing logic in `content.js` or `utils.js`.

---

## 💬 Acknowledgments

Special thanks to **高振綱** for the original idea and to the Facebook group *Readmoo讀墨×mooInk 線上討論區* for sharing it.
This extension is a modernized standalone implementation of the original [Tampermonkey script](https://github.com/plasmabal/gen_booklist).

---

## 🧱 License

MIT License © plasmabal
