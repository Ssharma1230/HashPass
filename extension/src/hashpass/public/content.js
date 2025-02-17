const observer = new MutationObserver((mutationsList, observer) => {
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
        return input.closest("form") && /login|signin|sign-in|login|log-in|account/i.test(input.closest("form").innerHTML);
    });

    if (signInFields.length > 0) {
        chrome.runtime.sendMessage({ action: "detected_login_form" });
        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
