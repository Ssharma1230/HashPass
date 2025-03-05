chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "detected_login_form") {
        chrome.windows.create({
            url: chrome.runtime.getURL("site_login_popup/index.html"),
            type: "popup",
            width: 400,
            height: 600
        });
    }
    if (message.action === "detected_signup_form") {
        chrome.windows.create({
            url: chrome.runtime.getURL("site_signup_popup/index.html"),
            type: "popup",
            width: 400,
            height: 600
        });
    }
});
