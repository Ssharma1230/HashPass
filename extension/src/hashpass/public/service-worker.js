chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "detected_login_form") {
        chrome.windows.create({
            url: chrome.runtime.getURL("index.html"),
            type: "popup",
            width: 400,
            height: 600
        });
    }
});
