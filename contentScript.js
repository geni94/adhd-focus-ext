let wordsHighlighted = false;

function highlightFirstThreeLetters(text) {
  return text.replace(/(\b\w{1,3})(\w*)/g, '<span class="adhd-container"><strong class="adhd-highlight">$1</strong>$2</span>');
}

function processNode(node, action) {
  if (node.nodeType === Node.TEXT_NODE && node.parentElement.tagName.toLowerCase() !== 'script') {
    if (action === 'apply') {
      const newNode = document.createElement('span');
      newNode.classList.add('adhd-container');
      newNode.innerHTML = highlightFirstThreeLetters(node.textContent);
      node.parentElement.replaceChild(newNode, node);
    } else if (action === 'remove') {
      const parent = node.parentElement;
      parent.replaceChild(document.createTextNode(node.textContent), node);
      if (parent.classList.contains('adhd-container')) {
        const grandParent = parent.parentElement;
        grandParent.replaceChild(document.createTextNode(parent.textContent), parent);
      }
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (let i = 0; i < node.childNodes.length; i++) {
      processNode(node.childNodes[i], action);
    }
  }
}

function applyHighlighting() {
  const body = document.body;
  processNode(body, 'apply');
}

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleHighlighting') {
    if (wordsHighlighted) {
      clearHighlighting();
    } else {
      applyHighlighting();
    }
    wordsHighlighted = !wordsHighlighted;
  }
});
