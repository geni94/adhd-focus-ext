// chrome.action.onClicked.addListener((tab) => {
//   chrome.tabs.sendMessage(tab.id, { action: 'applyHighlighting' });
// });

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggleHighlighting' });
});
