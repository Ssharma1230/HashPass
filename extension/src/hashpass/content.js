const observer = new MutationObserver((mutationsList, observer) => {
    const loginField = document.querySelector("input[type='password']");
    if (loginField) {
        chrome.runtime.sendMessage({ action: "detected_login_form" });
        observer.disconnect(); // Stop observing once found
    }
});

observer.observe(document.body, { childList: true, subtree: true });
