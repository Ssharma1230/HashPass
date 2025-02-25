chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "detected_login_form") {
        chrome.windows.create({
            url: chrome.runtime.getURL("site_signup_signin_popup/index.html"),
            type: "popup",
            width: 400,
            height: 600
        });
    }
});
