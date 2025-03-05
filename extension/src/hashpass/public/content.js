const observer = new MutationObserver((mutationsList, observer) => {
    const signInFormCandidates = [...document.querySelectorAll("form")].filter(form => {
        const text = form.textContent.toLowerCase();
            return (
            (text.includes("login") ||
            text.includes("sign in") ||
            text.includes("sign-in") ||
            text.includes("log in")) &&
            // Exclude if it also has sign-up keywords
            !(
                text.includes("sign up") ||
                text.includes("sign-up") ||
                text.includes("register") ||
                text.includes("create account") ||
                text.includes("join") ||
                text.includes("confirm password") ||
                text.includes("new password")
            )
        );
    });
      

    const signUpFormCandidates = [...document.querySelectorAll("form")].filter(form => {
    const text = form.textContent.toLowerCase();
        return (
            text.match(/sign\s*up|sign-up|register|create\s?account|join/i) ||
            text.includes("confirm password") ||
            text.includes("new password")
        );
    });
      

    const signInFields = signInFormCandidates.flatMap(form => [
        ...form.querySelectorAll(
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
        )
    ]);
    
    const signUpFields = signUpFormCandidates.flatMap(form => [
        ...form.querySelectorAll(
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
        )
    ]);
    
    if (signInFields.length > 0) {
        chrome.runtime.sendMessage({ action: "detected_login_form" });
    } else if (signUpFields.length > 0) {
        chrome.runtime.sendMessage({ action: "detected_signup_form" });
    }
});

observer.observe(document.body, { childList: true, subtree: true });
