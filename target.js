// 此处 注入到目标页
"use strict";
console.log("mr-tool检测注入");
const apiAddress = "http://10.9.31.10:8888/";
function main() {
  function addButton(title, clickFunc) {
    const buttonEle = document.createElement("button");
    buttonEle.innerText = title;
    buttonEle.setAttribute("class", "aui-button");
    buttonEle.style.marginLeft = "12px";
    buttonEle.addEventListener("click", () => {
      clickFunc && clickFunc();
    });
    wrapEle.appendChild(buttonEle);
  }
  const mainEle = document.querySelector("#stalker");

  if (!mainEle) {
    return;
  }

  mainEle.style.position = "relative";
  const wrapEle = document.createElement("div");
  // wrapEle.style.position = "absolute";
  wrapEle.style.padding = "0 20px 20px";
  // wrapEle.style.zIndex = "9999";
  mainEle.appendChild(wrapEle);

  const jiraId = document.querySelector("#key-val").innerText;
  const jiraDescription = document.querySelector("#summary-val").innerText;
  const isBugfix = jiraId.includes("WBBUG");
  let jiraType = isBugfix ? "bugfix" : "feature";

  function getJiraBranchName() {
    return `${prefix}${jiraType}-${jiraId}`;
  }

  let testBranch = localStorage.getItem(`wb-test`);
  let preBranch = localStorage.getItem(`wb-pre`);
  let prefix = localStorage.getItem(`wb-prefix`) || "";
  if (prefix) {
    prefix += "/";
  }
  function addInput(type) {
    const inputEle = document.createElement("input");
    inputEle.setAttribute("id", `${type}-id`);
    inputEle.setAttribute("class", `diy-input`);

    inputEle.style.width = "100px";
    inputEle.style.marginRight = "12px";
    inputEle.setAttribute(
      "placeholder",
      type == "prefix" ? `前缀eg:yx` : `当前${type}分支名`
    );
    wrapEle.appendChild(inputEle);
    let branchName = localStorage.getItem("wb-pre")
      ? localStorage.getItem(`wb-${type}`)
      : "";
    if (branchName) {
      inputEle.value = branchName;
    }
    inputEle.addEventListener("input", (e) => {
      const value = e.target.value;
      localStorage.setItem(`wb-${type}`, value);

      if (type === "test") {
        testBranch = value;
      } else if (type === "pre") {
        preBranch = value;
      } else if (type === "prefix") {
        prefix = value + "/";
      }
    });
  }
  addInput("prefix");
  addInput("test");
  addInput("pre");

  addButton("复制分支名", () => {
    copy(`${getJiraBranchName()}`);
    toast(`分支名: ${getJiraBranchName()}`);
  });
  addButton("创建分支", () => {
    copy(
      `zx http://34.81.247.176:8888/down/bYAmfNzp6sIp ${getJiraBranchName()}`
    );
    toast(
      `zx http://34.81.247.176:8888/down/bYAmfNzp6sIp ${getJiraBranchName()}`
    );
  });

  function addPreMrButton(type) {
    addButton(`创建${type} MR`, () => {
      let targetBranch = "";
      switch (type) {
        case "test":
          targetBranch = testBranch;
          break;
        case "pre":
          targetBranch = preBranch;
          break;
        case "master":
          targetBranch = "master";
          break;
      }
      if (targetBranch) {
        let content = ``;
        let testUserName = "";
        let testUserEle = document.querySelector("#customfield_10172-field");
        if (!testUserEle) {
          testUserEle = document.querySelector("#customfield_10182-val");
        }
        if (!testUserEle) {
          // 设计
          testUserEle = document.querySelector("#customfield_10165-field");
        }
        if (!testUserEle) {
          // 报告
          testUserEle = document.querySelector("#view-issue-field");
        }

        const reporterEle = document.querySelector("#reporter-val");
        if (testUserEle) {
          testUserName = testUserEle.innerText;
        } else if (reporterEle) {
          testUserName = reporterEle.innerText;
        }
        if (isBugfix) {
          content = `bugfix: 修复 ${jiraId} ${jiraDescription} -${testUserName}`;
        } else {
          content = `feature: ${jiraId} ${jiraDescription} -${testUserName}`;
        }
        let cmd = `glab mr create -b ${targetBranch} -s '${getJiraBranchName()}' -t '${content}' -d '${content}' `;
        copy(cmd);
        window.open(
          `${apiAddress}?p=${JSON.stringify({
            title: content,
            description: content,
            source: getJiraBranchName(),
            branch: targetBranch,
          })}`
        );

        toast(`${getJiraBranchName()} ====> ${targetBranch} `, 3000, "info");
      } else {
        toast(`分支错误：: ${type}`, 3000, "error");
      }
    });
  }
  addPreMrButton("test");
  addPreMrButton("pre");
  addPreMrButton("master");

  function copy(value = "") {
    const input = document.createElement("input");
    input.setAttribute("value", value);
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  }
  /**
   *
   * @param {*} content
   * @param {*} duration
   * @param {'info' | 'error'} type
   */
  function toast(content, duration = 3000, type = "info") {
    Toastify({
      text: `${content}`,
      position: "center",
      duration,
      style: {
        background: type === "info" ? "#0876f9" : "#ff232f",
      },
    }).showToast();
  }
}
if (location.href.includes("jira.yiban.io")) {
  main();
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
//apifox
if (location.href.includes("apifox.cn")) {
  setInterval(() => {
    let wrapList = document.querySelectorAll(".actions-wrap");
    wrapList.forEach((wrap) => {
      if (wrap && !wrap.querySelector(".yx-diy-btn")) {
        const btnEle = document.createElement("button", {
          type: "button",
          className: "ant-btn foxui",
        });
        btnEle.setAttribute("type", "button");
        btnEle.setAttribute("class", "ant-btn foxui yx-diy-btn"); // yx-diy-btn用于标识
        btnEle.innerHTML =
          '<span role="img" class="anticon fox_icon mr-1"><svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><use xlink:href="#icon-Button_icon_generate"></use></svg></span>生成代码';
        wrap.appendChild(btnEle);
        btnEle.addEventListener("click", (e) => {
          let url = location.pathname.replace(/^(.+project\/)(.+)/, "$2");
          const project = url.includes("apis") ? url.split("/")[0] : url;
          let target = e.target;
          let id = "";
          while (!id) {
            // rc-tabs-0-tab-apiDetail rc-tabs-2-tab-apiDetail
            if (target.id && /^rc-tabs-.+apiDetail\./.test(target.id)) {
              id = target.id.replace(/^rc-tabs-.+apiDetail\./, "");
              console.log(id);
              break;
            }
            target = target.parentElement;
            if (!target) {
              break;
            }
          }
          console.log(id);
          let version = "";
         [...document.getElementsByTagName("script")].forEach(item=>{
           if(item.innerHTML.includes('window.eventTrackingAppVersion')){
             let html =item.innerHTML
             let arr = html.match(/eventTrackingAppVersion.+"(.+)"/)
              version = arr[1]
           }
         })
         
         if(version){
          const  headers = new Headers({
            Authorization: JSON.parse(localStorage.getItem("common.accessToken")),
            "X-Client-Mode": "web",
            "X-Client-Version": version,
            "X-Device-Id": JSON.parse(localStorage.getItem("common.projectCid")),
            "X-Project-Id": project,
            "Accept-Language": "zh-CN",
            "Access-Control-Allow-Origin": "*",
            Origin: "https://www.apifox.cn",
          })
          // api/v1/api-schemas   // 拿模型
          Promise.all([fetch("https://api.apifox.cn/api/v1/api-details?locale=zh-CN", {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers,
          }).then(res=>res.json()),fetch("https://api.apifox.cn/api/v1/api-schemas?locale=zh-CN", {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers,
          }).then(res=>res.json())]).then(([apis,schemas])=>{
            if(apis.success&&schemas.success){
                let data = apis.data.find(item=>item.id===Number(id))
                window.open(`${apiAddress}code.html?project=${project}&api=${id}&data=${encodeURIComponent(JSON.stringify(data))}&schemas=${encodeURIComponent(JSON.stringify(schemas.data))}`);
            }
          })
          // fetch("https://api.apifox.cn/api/v1/api-details?locale=zh-CN", {
          //   method: "GET", // *GET, POST, PUT, DELETE, etc.
          //   headers,
          // }).then(res => {
          //   return res.json();
          // }).then(res => {
          //     if(res.success){
          //       let data = res.data.find(item=>item.id===Number(id))
          //       window.open(`${apiAddress}code.html?project=${project}&api=${id}&data=${encodeURIComponent(JSON.stringify(data))}`);
          //     }
          // })
         }else{
           alert('获取version失败，请手动设置version')
         }
        

          // Authorization
          // X-Client-Mode: web
          // X-Client-Version: 2.1.12-alpha.1
          // localStorage.getItem('common.projectCid') X-Device-Id: 3bm8TQ7kOsNMk3FH9xxrBsnxEixI3fAUN09tmoWIqsAFiN1dBXz938ur693RAoQu
          // X-Project-Id: 910225
        });
      }
    });
  }, 1000);

  // 只有打开控制台才能拦截 暂时废弃
  // chrome.runtime.onMessage.addListener(function (
  //   message,
  //   sender,
  //   sendResponse
  // ) {
  //   if (message.type === "sendData") {
  //   }
  // });

 
}
