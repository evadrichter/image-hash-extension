chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "viewHash",
      title: "View Hash",
      contexts: ["image"]  // Context menu will appear for images
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "viewHash") {
      chrome.tabs.sendMessage(tab.id, {
        action: "computeHash",
        imageUrl: info.srcUrl
      });
    }
  });
  