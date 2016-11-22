var videoLogEl;
var tvLogEl;
var videoEl;

var videoContentEl;

var mandatoryKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Back"];
var tvKeyCode = [];

function initElements() {
	videoLogEl = document.getElementById("videoLog");
	tvLogEl = document.getElementById("tvLog");
	
	videoContentEl = document.getElementById("videoContent");
}

function main() {
	console.log("[yourSampleApp] onload");
	
	initElements();
	registerKey();
}

// keydown
function registerKey() {
	console.log('[yourSampleApp] registerKey');
	
	var supportedKeys = tizen.tvinputdevice.getSupportedKeys();
	var len = supportedKeys.length;
	
	for(var i=0; i<len; i++) {
		tvKeyCode[supportedKeys[i].name] = supportedKeys[i].code;
	}
	
	for(var i=0; i<mandatoryKeys.length; i++) {
		tvKeyCode[mandatoryKeys[i]] = tizen.tvinputdevice.getKey(mandatoryKeys[i]).code;
	}
	
	window.addEventListener('keydown', function(e) {
        switch(e.keyCode) {
	        case tvKeyCode.Back:
	          	console.log('[yourSampleApp] return');
	          	tizen.application.getCurrentApplication().exit();
	          	break;
        }
    });
}

// video
function initVideo() {
	showVideoLog('initVideo');
	videoContentEl.innerHTML = '<video id="video" src="http://media.w3.org/2010/05/sintel/trailer.mp4" controls></video>';
}

function clearVideo() {
	showVideoLog('clearVideo');
	videoEl = '';
	videoContentEl.innerHTML = '';
}

function playVideo() {
	showVideoLog('playVideo');
	if(!videoEl) {
		initVideo();
		videoEl = document.getElementById("video");
	}
	videoEl.play();
}

function pauseVideo() {
	showVideoLog('pauseVideo');
	if(!videoEl) {
		initVideo();
		videoEl = document.getElementById("video");
	}
	videoEl.pause();
}

function stopVideo() {
	showVideoLog('stopVideo');
	if(!videoEl) {
		initVideo();
		videoEl = document.getElementById("video");
	}
	videoEl.pause();
	videoEl.currentTime = 0;
}

// TV
function showTV() {
	showTVLog('showTV');
	
	try {
		tizen.tvwindow.show(
			function() {
				showTVLog('tizen.tvwindow.show Success');
				clearVideo();
			},
			function(e) {
				showTVLog('tizen.tvwindow.show failed : ' + e.message);
			},
			['960px', '270px', '960px', '540px']
		);
	} catch(e) {
		showTVLog('tizen.tvwindow.show exception : ' + e.message);
	}
}

function hideTV() {
	showTVLog('hideTV');
	
	try {
		tizen.tvwindow.hide(
			function() {
				showTVLog('tizen.tvwindow.hide Success');
				clearVideo();
			},
		   	function(e) {
				showTVLog('tizen.tvwindow.hide failed : ' + e.message);
		   	}
		);
	} catch(e) {
		showTVLog('tizen.tvwindow.hide exception : ' + e.message);
	}
}

// Debug
function showVideoLog(msg) {
	var message = '[yourSampleApp][Video] : ' + msg;
	console.log(message);
	videoLogEl.innerHTML += '<p>' + message + '</p>'
	videoLogEl.scrollTop = videoLogEl.scrollHeight;
}

function showTVLog(msg) {
	var message = '[yourSampleApp][TV] : ' + msg;
	console.log(message);
	tvLogEl.innerHTML += '<p>' + message + '</p>'
	tvLogEl.scrollTop = tvLogEl.scrollHeight;
}