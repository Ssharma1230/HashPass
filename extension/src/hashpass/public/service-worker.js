chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "fillPassword") {
    console.log("Received message:", message);
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      console.log("Result from tabs.query:", tab);
      if (tab?.id) {
        console.log("Valid tab ID found:", tab.id);
        try {
          console.log("Attempting to inject script into tab", tab.id);
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (passphrase) => {
              console.log("Injected script executing on the page");
              const emailInput = document.querySelector('input[type="email"]');
              if (emailInput) {
                console.log("Email input field found. Setting value.");
                emailInput.value = passphrase;
              } else {
                console.log("No email input field found on the page.");
                alert('No email field found on the page.');
              }
            },
            args: [message.passphrase]
          }).then(() => {
            console.log("Script injection completed successfully.");
          }).catch(err => {
            console.log("Script injection failed:", err);
          });
        } catch (e) {
          console.log("Unexpected error during script injection:", e);
        }
      } else {
        console.log("No active tab ID found.");
      }
    });
    return true;
  }
  
  // Check that sender.tab exists so we can target the correct tab
  if (!sender.tab || !sender.tab.id) return;

  if (message.action === "detected_login_form") {
    chrome.tabs.sendMessage(sender.tab.id, { action: "injectLoginPopup" });
  } else if (message.action === "detected_signup_form") {
    chrome.tabs.sendMessage(sender.tab.id, { action: "injectSignupPopup" });
  }
}); 