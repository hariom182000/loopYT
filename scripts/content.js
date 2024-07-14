const LOOP_COUNT_KEY = "-loopCount";
const AUTO_PLAY_ELEMENT_NAME = "ytp-autonav-toggle-button";
const U_HASH_KEY="uHash";

function generateRandomHash() {
    const randomNumber = Math.floor(Math.random() * 10000000);
    const randomHash = randomNumber.toString().padStart(7, '0');
    return randomHash;
}

try {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action === 'startLoop') {
            const loopCount = message.loopCount;
            const uHash = generateRandomHash();
            window.localStorage.setItem(uHash + LOOP_COUNT_KEY, loopCount);

            const video = document.getElementsByTagName('video')[0];
            if (!video) return;

            const autoPlay = document.getElementsByClassName(AUTO_PLAY_ELEMENT_NAME)[0];
            if (autoPlay) {
                autoPlay.removeAttribute("aria-checked");
            }

            video.setAttribute(U_HASH_KEY, uHash);

            video.addEventListener('ended', function() {
                const uHash = video.getAttribute(U_HASH_KEY);
                const loopCounter = parseInt(window.localStorage.getItem(uHash + LOOP_COUNT_KEY));
                
                if (loopCounter > 0) {
                    window.localStorage.setItem(uHash + LOOP_COUNT_KEY, loopCounter - 1);
                    video.play().catch(() => {
                        window.localStorage.removeItem(uHash + LOOP_COUNT_KEY);
                        video.removeAttribute(U_HASH_KEY);
                    });
                } else {
                    window.localStorage.removeItem(uHash + LOOP_COUNT_KEY);
                     video.removeAttribute(U_HASH_KEY);
                }
            });
        }
    });
} catch (error) {
    console.error('Error in content script:', error);
}
