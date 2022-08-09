let speed = 1;

/**
 * Sets the default playback speed to be 1.
 */ 
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({"playbackSpeed": speed});
  console.log('Default playback speed set to ' + speed + 'x');
});