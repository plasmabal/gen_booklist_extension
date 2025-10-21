(function(){
  const Sites = [
    { // Readmoo
      name: "Readmoo",
      detect: (host) => host === "read.readmoo.com",
      collect: (doc) => {
        const list = doc.getElementsByClassName("library-item-info");
        return [...list].map(item => ({
          name: item.getElementsByClassName("title")[0]?.innerText ?? "",
          author: item.getElementsByClassName("author")[0]?.innerText ?? ""
        }));
      },
      hint: "找不到書籍列表。請切換到書櫃並選擇為列表顯示。"
    },
    { // Kobo
      name: "Kobo",
      detect: (host) => host === "www.kobo.com",
      collect: (doc) => {
        const root = doc.getElementsByClassName("book-list")[0];
        const list = root ? root.getElementsByClassName("element-flipper") : [];
        return [...list].flatMap(item => {
          if (item.getElementsByClassName("buy-now").length > 0) return [];
          const info = item.getElementsByClassName("item-info")[0];
          return [{
            name: info?.getElementsByClassName("title")[0]?.innerText ?? "",
            author: info?.getElementsByClassName("authors")[0]?.innerText ?? ""
          }];
        });
      },
      hint: "找不到書籍列表。"
    },
    { // Books.com.tw viewer
      name: "Books",
      detect: (host) => host === "viewer-ebook.books.com.tw",
      collect: (doc) => {
        const list = doc.getElementsByClassName("bookshelf__book");
        return [...list].flatMap(item => {
          const bookmarks = item.getElementsByClassName("book__bookmark");
          if (bookmarks.length > 0 && bookmarks[0].innerText === "試閱") return [];
          const name = item.getElementsByClassName("book__description__title")[0]?.innerText ?? "";
          const author = (item.getElementsByClassName("book__description__author")[0]?.innerText ?? "").replace("作者：", "");
          return [{ name, author }];
        });
      },
      hint: "找不到書籍列表。"
    },
    { // HyRead
      name: "HyRead",
      detect: (host) => host === "ebook.hyread.com.tw",
      collect: (doc) => {
        const list = doc.getElementsByClassName("bookcase_list_item");
        return [...list].map(item => {
          const name = item.getElementsByClassName("bookname")[0]?.innerText ?? "";
          const author = item.getElementsByClassName("bookname")[1]?.innerText ?? "";
          return { name, author };
        });
      },
      hint: "找不到書籍列表。"
    },
    { // Pubu
      name: "Pubu",
      detect: (host) => host === "www.pubu.com.tw",
      collect: (doc) => {
        const list = doc.getElementsByClassName("allBook");
        return [...list].map(item => {
          const name = item.getElementsByTagName("h3")[0]?.innerText ?? "";
          return { name, author: "" };
        });
      },
      hint: "找不到書籍列表。"
    },
    { // Google Play Books
      name: "Google Play Books",
      detect: (host) => host === "play.google.com",
      collect: (doc) => {
        const list = doc.getElementsByClassName("ebook");
        return [...list].flatMap(item => {
          const badge = item.getElementsByClassName("cover-badge");
          if (badge.length > 0 && badge[0].innerText === "試閱內容") return [];
          const name = item.getElementsByClassName("title")[0]?.innerText ?? "";
          const author = item.getElementsByClassName("author")[0]?.innerText ?? "";
          return [{ name, author }];
        });
      },
      hint: "找不到書籍列表。"
    },
    { // MyBook
      name: "MyBook",
      detect: (host) => host === "mybook.taiwanmobile.com",
      collect: (doc) => {
        const root = doc.getElementsByClassName("bookshelf-list-grid")[0];
        const list = root ? root.getElementsByClassName("item") : [];
        return [...list].map(item => {
          const name = item.getElementsByTagName("h3")[0]?.innerText ?? "";
          const author = (item.getElementsByClassName("author")[0]?.innerText ?? "").replace("作者：", "");
          return { name, author };
        });
      },
      hint: "找不到書籍列表。"
    },
    { // Amazon US
      name: "Amazon US",
      detect: (host) => host === "www.amazon.com",
      collect: (doc) => {
        const tbody = doc.getElementById("CONTENT_LIST")?.getElementsByTagName("tbody")[0];
        const rows = tbody ? tbody.getElementsByTagName("tr") : [];
        return [...rows].map(row => {
          const name = row.getElementsByClassName("digital_entity_title")[0]?.innerText ?? "";
          const author = row.getElementsByClassName("information_row")[0]?.innerText ?? "";
          return { name, author };
        });
      },
      hint: "找不到書籍列表。"
    },
    { // HamiBook
      name: "HamiBook",
      detect: (host) => host === "webreader.hamibook.com.tw",
      collect: (doc) => {
        const ul = doc.getElementsByClassName("one_classification_book_content")[0];
        const list = ul ? ul.getElementsByTagName("li") : [];
        return [...list].map(li => {
          const name = li.getElementsByClassName("index_book_title")[0]?.innerText ?? "";
          return { name, author: "" };
        });
      },
      hint: "找不到書籍列表。"
    },
    { // Amazon CN
      name: "Amazon CN",
      detect: (host) => host === "www.amazon.cn",
      collect: (doc) => {
        const list = doc.getElementById("CONTENT_LIST")?.getElementsByClassName("digital_entity_details") || [];
        return [...list].map(item => {
          const name = item.getElementsByClassName("digital_entity_title")[0]?.innerText ?? "";
          const author = item.getElementsByClassName("information_row")[0]?.innerText ?? "";
          return { name, author };
        });
      },
      hint: "找不到書籍列表。"
    },
    { // BOOK☆WALKER TW
      name: "BOOK☆WALKER TAIWAN",
      detect: (host) => host === "www.bookwalker.com.tw",
      collect: (doc) => {
        const list = doc.getElementsByClassName("readerBookListType");
        return [...list].map(item => {
          const name = item.getElementsByClassName("readerBookName")[0]?.innerText ?? "";
          const author = item.getElementsByClassName("readerBookAuthor")[0]?.innerText ?? "";
          return { name, author };
        });
      },
      hint: "找不到書籍列表。"
    }
  ];

  function findSite(doc) {
    const host = location.host;
    return Sites.find(s => s.detect(host));
  }

  function getBooksFromSite(site, doc) {
    return site ? site.collect(doc).filter(Boolean) : [];
  }

  window.GBL = { Sites, findSite, getBooksFromSite };
})();
