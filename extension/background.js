function createTransparentWindow() {
  chrome.windows.create({
    url: "popup.html",
    type: "popup",
    width: 400,
    height: 300,
    left: 120,
    top: 20,
    focused: true,
  });
}

chrome.action.onClicked.addListener((tab) => {
  createTransparentWindow();
});
