console.log('backgroud.js 检测注入host: ')

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.name==='devtools') {
    const data = JSON.parse(message.content)
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=> {
      console.log('chrome.tabs.sendMessage',data)
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'sendData',
        content: data
      });
    })
  }
})