let isHighlightingActive = false;

// Applies highlighting to the first three letters of each word in the input text.
function highlightFirstThreeLetters(text) {
  return text.replace(/(\b\w{1,3})(\w*)/g, '<span class="adhd-container"><strong class="adhd-highlight">$1</strong>$2</span>');
}

// Processes the DOM nodes recursively based on the specified action (apply or remove highlighting).
function processNode(node, action) {
  if (node.nodeType === Node.TEXT_NODE && !node.parentElement.closest('script, style')) {
    const parent = node.parentElement;
    if (action === 'apply') {
      const newNode = document.createElement('span');
      newNode.classList.add('adhd-container');
      newNode.innerHTML = highlightFirstThreeLetters(node.textContent);
      parent.replaceChild(newNode, node);
    } else if (action === 'remove' && parent.classList.contains('adhd-container')) {
      parent.replaceChild(document.createTextNode(node.textContent), node);
      const grandParent = parent.parentElement;
      grandParent.replaceChild(document.createTextNode(parent.textContent), parent);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let i = 0; i < node.childNodes.length; i++) {
      processNode(node.childNodes[i], action);
    }
  }
}

// Applies highlighting to the first three letters of each word on the page.
function applyHighlighting() {
  processNode(document.body, 'apply');
}

// Removes highlighting from the first three letters of each word on the page.
function clearHighlighting() {
  const highlightedElements = document.querySelectorAll('.adhd-highlight');
  const highlightedContainers = document.querySelectorAll('.adhd-container');
  highlightedContainers.forEach(element => {
    const parent = element.parentElement;
    parent.replaceChild(document.createTextNode(element.textContent), element);
  });
  highlightedElements.forEach(element => {
    const parent = element.parentElement;
    parent.replaceChild(document.createTextNode(element.textContent), element);
  });
}

// Listens for messages from the background script to toggle highlighting.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleHighlighting') {
    if (isHighlightingActive) {
      clearHighlighting();
    } else {
      applyHighlighting();
    }
    isHighlightingActive = !isHighlightingActive;
  }
});
