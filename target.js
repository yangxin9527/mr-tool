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
main();
