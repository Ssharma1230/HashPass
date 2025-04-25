// Function to inject a login popup into the page using the bundled TSX component
function injectLoginPopup() {
  const host = document.createElement('div');
  host.id = 'hashpass-login-popup';
  host.style.position = 'fixed';
  host.style.bottom = '40px';
  host.style.right = '40px';
  host.style.top = 'unset';
  host.style.left = 'unset';
  host.style.transform = 'none';
  host.style.zIndex = '10000';

  const shadow = host.attachShadow({ mode: 'open' });
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('tailwind.css');
  shadow.appendChild(link);
  const reactContainer = document.createElement('div');
  shadow.appendChild(reactContainer);

  document.body.appendChild(host);

  if (window.Components && typeof window.Components.renderSiteLogIn === 'function') {
    window.Components.renderSiteLogIn(reactContainer);
  } else {
    console.error('Login component function not available.');
  }
}

// Function to inject a signup popup into the page using the bundled TSX component
function injectSignupPopup() {
  const host = document.createElement('div');
  host.id = 'hashpass-signup-popup';
  host.style.position = 'fixed';
  host.style.bottom = '40px';
  host.style.right = '40px';
  host.style.top = 'unset';
  host.style.left = 'unset';
  host.style.transform = 'none';
  host.style.zIndex = '10000';

  const shadow = host.attachShadow({ mode: 'open' });
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('tailwind.css');
  shadow.appendChild(link);
  const reactContainer = document.createElement('div');
  shadow.appendChild(reactContainer);
  
  document.body.appendChild(host);

  if (window.Components && typeof window.Components.renderSiteSignUp === 'function') {
    window.Components.renderSiteSignUp(reactContainer);
  } else {
    console.error('Signup component function not available.');
  }
}

// Listen for messages from the service worker
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "injectLoginPopup") {
    injectLoginPopup();
  } else if (message.action === "injectSignupPopup") {
    injectSignupPopup();
  }
});

const observer = new MutationObserver((mutationsList, observer) => {
    /**
     * Detect Sign-In Fields
     */
    const signInFields = [...document.querySelectorAll(
      "input[type='text'][autocomplete='username'], " +
      "input[type='email'][autocomplete='email'], " +
      "input[type='password'], " +
      "input[name*='email'], input[id*='email'], " +
      "input[name*='user'], input[id*='user'], " +
      "input[name*='login'], input[id*='login'], " +
      "input[name*='phone'], input[id*='phone'], " +
      "input[autocomplete='current-password'], input[autocomplete='new-password'], " +
      "input[aria-label*='email'], input[aria-label*='username'], input[aria-label*='phone'], " +
      "input[placeholder*='email'], input[placeholder*='username'], input[placeholder*='phone'], " +
      "input[type='tel'], input[type='number']"
    )].filter(input => {
      const form = input.closest("form");
      if (!form) return false;
  
      // Use textContent to avoid hidden markup in innerHTML
      const formText = form.textContent.toLowerCase();
  
      // Basic sign-in indicators (no sign-up references)
      const isLikelySignIn = (
        (formText.includes("login") ||
         formText.includes("sign in") ||
         formText.includes("sign-in") ||
         formText.includes("log in")) &&
        !(
          formText.includes("sign up") ||
          formText.includes("sign-up") ||
          formText.includes("register") ||
          formText.includes("create account") ||
          formText.includes("join") ||
          formText.includes("confirm password") ||
          formText.includes("new password")
        )
      );
  
      // Typically, sign-in forms have at least one password field
      const hasPasswordField = form.querySelector('input[type="password"]');
  
      return isLikelySignIn && hasPasswordField;
    });
  
    /**
     * Detect Sign-Up Fields
     */
    const signUpFields = [...document.querySelectorAll(
      "input[type='text'][autocomplete='username'], " +
      "input[type='email'][autocomplete='email'], " +
      "input[type='password'], " +
      "input[name*='email'], input[id*='email'], " +
      "input[name*='user'], input[id*='user'], " +
      "input[name*='login'], input[id*='login'], " +
      "input[name*='phone'], input[id*='phone'], " +
      "input[autocomplete='current-password'], input[autocomplete='new-password'], " +
      "input[aria-label*='email'], input[aria-label*='username'], input[aria-label*='phone'], " +
      "input[placeholder*='email'], input[placeholder*='username'], input[placeholder*='phone'], " +
      "input[type='tel'], input[type='number']"
    )].filter(input => {
      const form = input.closest("form");
      if (!form) return false;
  
      // Lowercase text to simplify matching
      const formText = form.textContent.toLowerCase();
  
      // Check for typical sign-up keywords
      const isLikelySignUp = (
        formText.includes("sign up") ||
        formText.includes("sign-up") ||
        formText.includes("register") ||
        formText.includes("create account") ||
        formText.includes("join") ||
        formText.includes("confirm password") ||
        formText.includes("new password")
      );
  
      // Usually, sign-up forms also have at least one password field
      const hasPasswordField = form.querySelector('input[type="password"]');
  
      return isLikelySignUp && hasPasswordField;
    });
  
    // If you only want to handle one form type at a time, use `if ... else if`
    if (signInFields.length > 0) {
      console.log("Log in detected");
      chrome.runtime.sendMessage({ action: "detected_login_form" });
      observer.disconnect();  // optionally stop observing
    } else if (signUpFields.length > 0) {
      console.log("Sign up detected");
      chrome.runtime.sendMessage({ action: "detected_signup_form" });
      observer.disconnect();  // optionally stop observing
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });