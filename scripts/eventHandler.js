document.getElementById('loopForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const loopCount = parseInt(document.getElementById('loopCount').value, 10);
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'startLoop', loopCount: loopCount });
  });
  window.close();
});
