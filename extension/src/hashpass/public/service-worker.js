chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === "fillPassword") {
    console.log("Received message:", message);
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      console.log("Result from tabs.query:", tab);
      if (tab?.id) {
        console.log("Valid tab ID found:", tab.id);
        try {
          console.log("Attempting to inject script into tab", tab.id);
          
          chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            world:  "MAIN",
            func:   injectPassword,
            args:   [message.passphrase],
          })
          .then(() => console.log("Injection done"))
          .catch(e => console.error("Injection error", e));
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

  const uuid = await getUUID();

  let blockedDomains = [];
  try {
    const response = await fetch("https://8fy84busdk.execute-api.us-east-1.amazonaws.com/API/getBlockedDomains", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ uuid: uuid })
    });
    if (!response.ok) {
        throw new Error("Failed to get domains");
    }
    blockedDomains = await response.json();
  } catch (error) {
    console.error(`Error fetching blocked domains for ${uuid}:`, error);
  }
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return "";
  const url = new URL(tab.url);
  let domain = url.hostname.replace(/^(?:.*\.)?([^.]+\.[^.]+)$/, "$1");
  console.log("Domain:", domain);

  if (domain && blockedDomains.includes(domain)) {
    console.log("Domain is blocked:", domain);
    return;
  }

  if (message.action === "detected_login_form") {
    chrome.tabs.sendMessage(sender.tab.id, { action: "injectLoginPopup" });
  } else if (message.action === "detected_signup_form") {
    chrome.tabs.sendMessage(sender.tab.id, { action: "injectSignupPopup" });
  }
}); 

function getUUID() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["uuid"], (result) => {
        resolve(result.uuid);
      });
    });
}

function injectPassword(passphrase) {
  const attempt = () => {
    const input = document.querySelector('input[type="password"]');
    if (!input) {
      console.log("⏳ password input not yet mounted, retrying…");
      return setTimeout(attempt, 300);
    }

    console.log("found password input");

    // Grab the native setter once:
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype, 'value'
    ).set;

    // Call it to bypass React’s override:
    setter.call(input, passphrase);

    // Dispatch events so React/Formik/etc hears the change:
    ['input','change','keydown','keyup','blur'].forEach(evtName => {
      input.dispatchEvent(new Event(evtName, { bubbles: true }));
    });

    console.log("final input.value:", input.value);
  };

  attempt();
}