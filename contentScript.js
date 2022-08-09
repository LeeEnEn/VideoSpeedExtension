var currentSpeed;
var currentVideo;
var observer;

/**
 * Gets playback speed from chrome's storage.
 */
function setPlaybackSpeed() {
    chrome.storage.sync.get('playbackSpeed', ({ playbackSpeed }) => {
        currentSpeed = playbackSpeed;
    });
}

/**
 * Configures an observer to look out for changes in the DOM with relation to video tag.
 * Once found, adjust video speed accordingly. Sets mutation observer to look for changes in the direct children,
 * and in all descendants of node.
 */
function initObserver() {
    observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(node => {
                try {
                    var newVideo = node.querySelector('video');

                    if (newVideo != null && newVideo.tagName == 'VIDEO') {
                        newVideo.addEventListener('loadeddata', (event) => {
                            console.log('Video found using mutation observer, adjusting speed to ' + currentSpeed + 'x');
                            adjustVideoSpeed(newVideo);
                            notifyPopup();
                        });
                    }
                } catch (error) {
                    if (error instanceof TypeError) {
                        console.log('Node changes is not an object!');
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Configures the runtime listener.
 */
function initMessageListener() {
    chrome.runtime.onMessage.addListener(
        function(message, sender, sendResponse) {
            var playbackSpeed = message.newPlaybackSpeed;

            if (playbackSpeed != null) {
                updateVideoSpeed(playbackSpeed);
                adjustVideoSpeed(currentVideo);
            } else if (message.getVideo != null) {
                let isVideoDetected = document.querySelector('video') != null;
                sendResponse({reply: isVideoDetected});
            }
        }
    );
}

/**
 * Adjusts video speed.
 */
function adjustVideoSpeed(video) {
    currentVideo = video;

    if (currentVideo != null) {
        currentVideo.playbackRate = currentSpeed;
    } else {
        currentVideo = document.querySelector('video');

        if (currentVideo != null) {
            currentVideo.addEventListener('loadeddata', (event) => {
                currentVideo.playbackRate = currentSpeed;
            })
        } else {
            console.log('Unable to find video on this tab!');
        }
    }
}

/**
 * Updates the current speed.
 * @param {double} playbackSpeed
 */
function updateVideoSpeed(playbackSpeed) {
    currentSpeed = playbackSpeed;
}

/**
 * Sends a message to popup to change the video title.
 */
function notifyPopup() {
    chrome.runtime.sendMessage({newTitle: true});
}

/**
 * Runs the main program residing in content script.
 */
function run() {
    setPlaybackSpeed();
    initMessageListener();
    initObserver();
}

run();
