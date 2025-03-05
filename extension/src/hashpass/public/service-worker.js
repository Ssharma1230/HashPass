chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "detected_login_form") {
      chrome.action.setPopup({
        popup: chrome.runtime.getURL("site_login_popup/index.html")
      }, () => {
        chrome.action.openPopup();
      });
    } else if (message.action === "detected_signup_form") {
      chrome.action.setPopup({
        popup: chrome.runtime.getURL("site_signup_popup/index.html")
      }, () => {
        chrome.action.openPopup();
      });
    }
  });