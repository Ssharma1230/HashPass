chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "detected_login_form") {
        chrome.windows.create({
            url: chrome.runtime.getURL("dashboard/index.html"),
            type: "popup",
            width: 400,
            height: 600
        });
    }
});
