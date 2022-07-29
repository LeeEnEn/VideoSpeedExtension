var speed;
var video;
var observer;

/**
 * Gets playback speed and tries to adjust video speed immediately 
 * after the webpage has been loaded.
 */ 
chrome.storage.sync.get('playbackspeed', ({ playbackspeed }) => {
	speed = playbackspeed;

	adjustVideoSpeed()
});

/** 
 * Configures an observer to look out for changes in the DOM with relation to video tag.
 * Once found, adjust video speed accordingly and stop observing.
 */
observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		mutation.addedNodes.forEach(node => {
			video = node.querySelector('video');
			
			if (video != null && video.tagName == 'VIDEO') {
				video.addEventListener('loadeddata', (event) => {
					video.playbackRate = speed;
					console.log('Video found using mutation observer, adjusting speed to ' + speed + 'x');
				});
				observer.disconnect();
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
function adjustVideoSpeed() {
	var video = document.querySelector('video');
	
	if (video != null) {
		video.playbackRate = speed;
		console.log('Video found, adjusting speed to ' + speed + 'x');
	}
}
