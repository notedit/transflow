document.addEventListener("DOMContentLoaded", function () {
  const opacitySlider = document.getElementById("opacitySlider");
  const opacityValue = document.getElementById("opacityValue");
  const pinButton = document.getElementById("pinButton");
  const closeButton = document.getElementById("closeButton");
  const presetButtons = document.querySelectorAll(".preset-button");

  let isPinned = true;

  // 更新透明度的函数
  function updateOpacity(value) {
    // 将值转换为0-1之间的小数
    const opacity = value / 100;
    // 更新显示的数值
    opacityValue.textContent = `${value}%`;
    // 更新滑块值
    opacitySlider.value = value;
    // 更新窗口透明度
    document.body.style.opacity = opacity;

    // 保存当前透明度设置
    chrome.storage.local.set({ windowOpacity: value });
  }

  // 监听滑块变化
  opacitySlider.addEventListener("input", (e) => {
    updateOpacity(e.target.value);
  });

  // 预设按钮点击事件
  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const opacity = button.getAttribute("data-opacity");
      updateOpacity(Number(opacity));
    });
  });

  // Pin/Unpin 功能
  pinButton.addEventListener("click", () => {
    isPinned = !isPinned;
    chrome.windows.getCurrent((window) => {
      chrome.windows.update(window.id, {
        alwaysOnTop: isPinned,
      });
    });
    pinButton.textContent = isPinned ? "📌" : "📍";
  });

  // 关闭按钮功能
  closeButton.addEventListener("click", () => {
    window.close();
  });

  // 加载保存的透明度设置
  chrome.storage.local.get(["windowOpacity"], (result) => {
    if (result.windowOpacity) {
      updateOpacity(result.windowOpacity);
    }
  });

  // 双击标题栏最大化/还原
  document.querySelector(".title-bar").addEventListener("dblclick", () => {
    chrome.windows.getCurrent((window) => {
      const newState = window.state === "maximized" ? "normal" : "maximized";
      chrome.windows.update(window.id, { state: newState });
    });
  });
});
