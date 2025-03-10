  chrome.runtime.onMessage.addListener((message, sender) => {
    // Check that sender.tab exists so we can target the correct tab
    if (!sender.tab || !sender.tab.id) return;
  
    if (message.action === "detected_login_form") {
      chrome.tabs.sendMessage(sender.tab.id, { action: "injectLoginPopup" });
    } else if (message.action === "detected_signup_form") {
      chrome.tabs.sendMessage(sender.tab.id, { action: "injectSignupPopup" });
    }
  });
  