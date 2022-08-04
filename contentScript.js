var currentSpeed;
var currentVideo;
var observer;

/**
 * Gets playback speed and tries to adjust video speed immediately 
 * after the webpage has been loaded.
 */ 
chrome.storage.sync.get('playbackspeed', ({ playbackspeed }) => {
	currentSpeed = playbackspeed;
});

/** 
 * Configures an observer to look out for changes in the DOM with relation to video tag.
 * Once found, adjust video speed accordingly.
 */
observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		mutation.addedNodes.forEach(node => {
		    try {
		        var newVideo = node.querySelector('video');

		        if (newVideo != null && newVideo.tagName == 'VIDEO') {
                    newVideo.addEventListener('loadeddata', (event) => {
                        adjustVideoSpeed(newVideo);
                        console.log('Video found using mutation observer, adjusting speed to ' + speed + 'x');
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

/**
 * Sets mutation observer to look for changes in the direct children of node,
 * and in all decendants of node.
 */
observer.observe(document.body, {
	childList: true,
	subtree: true
});

/**
 * Adjusts video speed.
 */
function adjustVideoSpeed(newVideo) {
    currentVideo = newVideo;
    currentVideo.playbackRate = currentSpeed;
}

function updateVideoSpeed(playbackSpeed) {
    currentSpeed = playbackSpeed;
}

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        var playbackSpeed = message.newPlaybackSpeed;

        if (playbackSpeed != null) {
            updateVideoSpeed(playbackSpeed);
            adjustVideoSpeed(video);
        }
    }
);
