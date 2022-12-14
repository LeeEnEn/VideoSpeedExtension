let button_1 = document.getElementById('button_1');
let button_2 = document.getElementById('button_2');
let button_3 = document.getElementById('button_3');
let button_4 = document.getElementById('button_4');
let button_5 = document.getElementById('button_5');
let button_6 = document.getElementById('button_6');
let button_7 = document.getElementById('button_7');
let txt_1 = document.getElementById('text_1');
let txt_2 = document.getElementById('text_2');
let txt_3 = document.getElementById('text_3');
let txt_4 = document.getElementById('text_4');
let txt_5 = document.getElementById('text_5');
let txt_6 = document.getElementById('text_6');
let txt_7 = document.getElementById('text_7');
let videoTitle = document.getElementById('video_title');
let HALF = 0.5;
let THREEQUARTERS = 0.75;
let ONE = 1;
let ONEANDQUARTER = 1.25;
let ONEHALF = 1.5;
let ONEANDTHREEQUARTER = 1.75;
let TWO = 2;
let NOVIDEOTITLE = '- No video found -';

var currentSpeed;

// Initialize button listeners.
button_1.addEventListener('click', () => {
	execute(button_1, txt_1, HALF);
});

button_2.addEventListener('click', () => {
	execute(button_2, txt_2, THREEQUARTERS);
});

button_3.addEventListener('click', () => {
	execute(button_3, txt_3, ONE);
});

button_4.addEventListener('click', () => {
	execute(button_4, txt_4, ONEANDQUARTER);
});

button_5.addEventListener('click', () => {
	execute(button_5, txt_5, ONEHALF);
});

button_6.addEventListener('click', () => {
	execute(button_6, txt_6, ONEANDTHREEQUARTER);
});

button_7.addEventListener('click', () => {
	execute(button_7, txt_7, TWO);
});

/**
 * Configures the runtime listener.
 */
function initMessageListener() {
    chrome.runtime.onMessage.addListener(
        function(message, sender, sendResponse) {
            if (message.newTitle) {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    setVideoTitle(tabs[0].title);
                })
            }
        }
    )
}

/**
 * Displays the video title upon user click.
 */
function initVideoTitle() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {getVideo: true}, function(response) {
            if (!chrome.runtime.lastError) {
                if (response.reply) {
                    setVideoTitle(tabs[0].title);
                } else {
                    setVideoTitle(NOVIDEOTITLE);
                }
            }
        });
    });
}

/**
 * Highlights button and text visuals on user click.
 */
function initVisuals() {
    let buttonVisual = getButtonVisual(currentSpeed);
    let textVisual = getTextVisual(currentSpeed);
    updateVisuals(buttonVisual, textVisual);
}

/**
 * Gets playback speed from chrome's storage and displays corresponding visuals.
 */
function initPopup() {
	chrome.storage.sync.get('playbackSpeed', ({ playbackSpeed }) => {
	    currentSpeed = playbackSpeed;
	    initMessageListener();
	    initVideoTitle();
	    initVisuals();
	});
}

/**
 * Executes the script to adjust the video speed and updates the popup visuals.
 * @param {button} selectedButton 
 * @param {text} selectedText 
 * @param {double} speed 
 */
function execute(selectedButton, selectedText, speed) {
	notifyContentScript(speed);
	updateVisuals(selectedButton, selectedText);
	updateCurrentSpeed(speed);
}

/**
 * Stores selected speed value into chrome storage. 
 * @param {double} speed 
 */
function updateCurrentSpeed(speed) {
	console.log('Updating current speed to: ' + speed);
	chrome.storage.sync.set({'playbackSpeed': speed });
	currentSpeed = speed;
}

/**
 * Sends a message to content script to update playback speed.
 * @param {double} speed
 */
function notifyContentScript(speed) {
    console.log('Notifying content script about speed changes.');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {newPlaybackSpeed: speed});
    });
}

/**
 * Returns a button corresponding to the speed value.
 * @param {double} playbackSpeed
 * @returns A button corresponding to the speed value.
 */
function getButtonVisual(playbackSpeed) {
	var buttonVisual;
	
	switch (playbackSpeed) {
			case HALF:
				buttonVisual = button_1;
				break;
			case THREEQUARTERS:
				buttonVisual = button_2;
				break;
			case ONE:
				buttonVisual = button_3;
				break;
			case ONEANDQUARTER:
				buttonVisual = button_4;
				break;
			case ONEHALF:
				buttonVisual = button_5;
				break;
			case ONEANDTHREEQUARTER:
				buttonVisual = button_6;
				break;
			case TWO:
				buttonVisual = button_7;
				break;
		}
	return buttonVisual;
}

/**
 * Returns a text corresponding to the speed value.
 * @param {double} playbackSpeed
 * @returns A text corresponding to the speed value.
 */
function getTextVisual(playbackSpeed) {
	var textVisual;
	
	switch (playbackSpeed) {
			case HALF:
				textVisual = txt_1;
				break;
			case THREEQUARTERS:
				textVisual = txt_2;
				break;
			case ONE:
				textVisual = txt_3;
				break;
			case ONEANDQUARTER:
				textVisual = txt_4;
				break;
			case ONEHALF:
				textVisual = txt_5;
				break;
			case ONEANDTHREEQUARTER:
				textVisual = txt_6;
				break;
			case TWO:
				textVisual = txt_7;
				break;
		}
	return textVisual;
}

/**
 * Updates the visual to both buttons and text.
 * @param {button} selectedButton 
 * @param {text} selectedTxt 
 */
function updateVisuals(selectedButton, selectedTxt) {
	updateButtonVisual(selectedButton);
	updateTextVisual(selectedTxt);
}

/**
 * Highlights the selected button and reverts the previous button to normal.
 * @param {button} selectedButton 
 */
function updateButtonVisual(selectedButton) {
	let prevButtonVisual = getButtonVisual(currentSpeed);
    prevButtonVisual.className = 'normal';
    selectedButton.className = 'selected';
}

/**
 * Highlights the selected text and reverts the previous text to normal.
 * @param {text} selectedTxt 
 */
function updateTextVisual(selectedTxt) {
	let prevTextVisual = getTextVisual(currentSpeed);
    prevTextVisual.style.fontWeight = 'normal';
    prevTextVisual.style.fontSize = '100%';
    selectedTxt.style.fontWeight = 'bold';
    selectedTxt.style.fontSize = '125%';
}

/**
 * Sets the video title.
 */
function setVideoTitle(title) {
    videoTitle.textContent = title;
}

/**
 * Runs the popup script.
 */
function run() {
    initPopup();
}

run();
