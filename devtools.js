// chrome.devtools.panels.create("My Panel",
//     "MyPanelIcon.png",
//     "panel.html",
//     function(panel) {
//       // code invoked on panel creation
//     }
// );

// chrome.devtools.network.onRequestFinished.addListener(
//     function(request) {
//       if(request.request.url.includes('v1/api-details')){
//           request.getContent((content)=>{
//             // chrome.runtime.sendMessage({
//             //     name:'devtools',
//             //     content
//             // })
//           })
//       }
//     }
//   );