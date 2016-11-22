var videoLogEl;
var tvLogEl;
var videoEl;

// [TOAST] media 변환
var media;

var videoContentEl;

var mandatoryKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Back"];
var tvKeyCode = [];

// for Toast : Add deviceready Event
function toastInit() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    console.log("start the app");

	// 기존에 onload에서 불리던 main함수 호출
	main();
}

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
	
	// [TOAST] toast.inputdevice.getSupportedKeys 변환 
	toast.inputdevice.getSupportedKeys(function (supportedKeys) {
		console.log('toast.inputdevice.getSupportedKeys success');

		var len = supportedKeys.length;
	
		for(var i=0; i<len; i++) {
			tvKeyCode[supportedKeys[i].name] = supportedKeys[i].code;
		}
	}, function(e) {
		console.log('toast.inputdevice.getSupportedKeys failed : ' + e.message);
	});
	
	// [TOAST] toast.inputdevice.getKey 변환 
	for(var i=0; i<mandatoryKeys.length; i++) {
		toast.inputdevice.getKey(mandatoryKeys[i], function (key) {
			tvKeyCode[mandatoryKeys[i]] = key.code;
		}, function(e) {
			console.log('toast.inputdevice.getKey failed : ' + e.message);
		});
	}
	
	window.addEventListener('keydown', function(e) {
        switch(e.keyCode) {
	        case tvKeyCode.Back:
	          	console.log('[yourSampleApp] return');

				// [TOAST] toast.application.exit 변환 
	          	toast.application.exit();
	          	break;
        }
    });

	// var supportedKeys = tizen.tvinputdevice.getSupportedKeys();
	// var len = supportedKeys.length;
	
	// for(var i=0; i<len; i++) {
	// 	tvKeyCode[supportedKeys[i].name] = supportedKeys[i].code;
	// }
	
	// for(var i=0; i<mandatoryKeys.length; i++) {
	// 	tvKeyCode[mandatoryKeys[i]] = tizen.tvinputdevice.getKey(mandatoryKeys[i]).code;
	// }
	
	// window.addEventListener('keydown', function(e) {
    //     switch(e.keyCode) {
	//         case tvKeyCode.Back:
	//           	console.log('[yourSampleApp] return');
	//           	tizen.application.getCurrentApplication().exit();
	//           	break;
    //     }
    // });
}

var url = "http://media.w3.org/2010/05/sintel/trailer.mp4";

// video
function initVideo() {
	showVideoLog('initVideo');

	// [TOAST] media  변환
	if(!media) {
		media = toast.Media.getInstance();
	}
	media.open(url);
	// videoContentEl.innerHTML = '<video id="video" src="' + url + '" controls></video>';

	videoEl = media.getContainerElement();
	videoEl.style.left = 0 + 'px'; // 'x'
	videoEl.style.top = 0 + 'px'; // 'y'
	videoEl.style.width = 960 + 'px'; // 'width'
	videoEl.style.height = 540 + 'px'; // 'height'

	videoContentEl.appendChild(videoEl);
}

function clearVideo() {
	showVideoLog('clearVideo');
	videoEl = '';
	videoContentEl.innerHTML = '';
	media = '';
}

function playVideo() {
	showVideoLog('playVideo');

	if(!media) {
		initVideo();
	}
	media.play();
	// if(!videoEl) {
	// 	initVideo();
	// 	videoEl = document.getElementById("video");
	// }
	// videoEl.play();
}

function pauseVideo() {
	showVideoLog('pauseVideo');

	if(!media) {
		initVideo();
	}
	media.pause();

	// if(!videoEl) {
	// 	initVideo();
	// 	videoEl = document.getElementById("video");
	// }
	// videoEl.pause();
}

function stopVideo() {
	showVideoLog('stopVideo');

	if(!media) {
		initVideo();
	}
	media.stop();
	// if(!videoEl) {
	// 	initVideo();
	// 	// videoEl = document.getElementById("video");
	// }
	// videoEl.pause();
	// videoEl.currentTime = 0;
}

// TV
function showTV() {
	showTVLog('showTV');
	
	// [TOAST] toast.tvwindow.show 변환 
	try {
		toast.tvwindow.show([960, 270, 960, 540], function() {
			showTVLog('toast.tvwindow.show Success');
			clearVideo();
		}, function(e) {
			showTVLog('toast.tvwindow.show failed : ' + e.message);
		});  
	} catch(e) {
		showTVLog('tizen.tvwindow.show exception : ' + e.message);
	}

	// try {
	// 	tizen.tvwindow.show(
	// 		function() {
	// 			showTVLog('tizen.tvwindow.show Success');
	// 			clearVideo();
	// 		},
	// 		function(e) {
	// 			showTVLog('tizen.tvwindow.show failed : ' + e.message);
	// 		},
	// 		['960px', '270px', '960px', '540px']
	// 	);
	// } catch(e) {
	// 	showTVLog('tizen.tvwindow.show exception : ' + e.message);
	// }
}

function hideTV() {
	showTVLog('hideTV');

	// [TOAST] toast.tvwindow.hide 변환 
	try {
		toast.tvwindow.hide(function() {
			showTVLog('toast.tvwindow.hide Success');
			clearVideo();
		}, function(e) {
			showTVLog('toast.tvwindow.hide failed : ' + e.message);
		});  
	} catch(e) {
		showTVLog('tizen.tvwindow.show exception : ' + e.message);
	}
	
	// try {
	// 	tizen.tvwindow.hide(
	// 		function() {
	// 			showTVLog('tizen.tvwindow.hide Success');
	// 			clearVideo();
	// 		},
	// 	   	function(e) {
	// 			showTVLog('tizen.tvwindow.hide failed : ' + e.message);
	// 	   	}
	// 	);
	// } catch(e) {
	// 	showTVLog('tizen.tvwindow.hide exception : ' + e.message);
	// }
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