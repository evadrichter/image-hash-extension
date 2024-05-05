chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showHash") {
    document.getElementById('hash').textContent = `Hash: ${message.hash}`;
  }
});

