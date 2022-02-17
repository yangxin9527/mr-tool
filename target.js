// 此处 注入到目标页
"use strict";
console.log("mr-tool检测注入");
function addButton(title, clickFunc) {
  const buttonEle = document.createElement("button");
  buttonEle.innerText = title;
  buttonEle.style.marginLeft = "10px";
  buttonEle.addEventListener("click", () => {
    clickFunc && clickFunc();
  });
  wrapEle.appendChild(buttonEle);
}
document.querySelector(".aui-page-header-main").style.position = "relative";
const wrapEle = document.createElement("div");
wrapEle.style.position = "absolute";
wrapEle.style.right = "0";
wrapEle.style.zIndex = "9999";
document.querySelector(".aui-page-header-main").appendChild(wrapEle);

const jiraId = document.querySelector("#key-val").innerHTML;
const jiraDescription = document.querySelector("#summary-val").innerHTML;
const isBugfix = jiraId.includes("WBBUG");
addButton("复制jiraId", () => {
  copy(`${jiraId}`);
});
addButton("创建分支", () => {
  copy(`zx http://10.9.30.85:5000/bugfix.mjs -id ${jiraId}`);
});

function addPreMrButton(type) {
  addButton(`创建${type} MR`, () => {
    let targetBranch = "";
    switch (type) {
      case "test":
        targetBranch = "test-v22.8";
        break;

      case "pre":
        targetBranch = "pre-v22.8.2";
        break;
      case "master":
        targetBranch = 'master'
        break;
    }
    if (targetBranch) {
      let content = ``;
      if (isBugfix) {
        content = `bugfix 修复 ${jiraId} ${jiraDescription}`;
        copy(
          `glab mr create -b ${targetBranch} -s 'yx/bugfix-${jiraId}' -t '${content}' -d '${content}' `
        );
      }
    } else {
      Toastify({
        text: "复制失败  " + type,
        position: "center",
        duration: 5000,
        type: "error",
      }).showToast();
    }
  });
}
addPreMrButton("test");
addPreMrButton("pre");
addPreMrButton("master");

// console.log()

console.log(jiraId, jiraDescription);
console.log(jiraId);

function copy(value = "") {
  const input = document.createElement("input");
  input.setAttribute("value", value);
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  Toastify({
    text: "复制成功: " + value,
    position: "center",
    duration: 5000,
  }).showToast();
}
