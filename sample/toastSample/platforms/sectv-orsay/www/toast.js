/*
Copyright 2015 Samsung Electronics Co., Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/* Cordova plugin TOAST version 1.2.0 (2016-10-30 18:26:33 GMT+0900) */
;(function() {
// jshint strict:false
var require = cordova.require,
    define = cordova.define;

// file: www/inputdevice.js
define('cordova-plugin-toast.inputdevice', function(require, exports, module) {

'use strict';

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

var inputdeviceExport = {
    getSupportedKeys: function (callback, error) {
        argscheck.checkArgs('fF', 'inputdevice.getSupportedKeys', arguments);
        var args = [];
        error = error || function () {};
        exec(callback, error, 'toast.inputdevice', 'getSupportedKeys', args);
    },
    getKey: function (keyName, callback, error) {
        argscheck.checkArgs('sfF', 'inputdevice.getKey', arguments);
        var args = [keyName];
        error = error || function () {};
        exec(callback, error, 'toast.inputdevice', 'getKey', args);
    },
    registerKey: function (keyName, callback, error) {
        argscheck.checkArgs('sfF', 'inputdevice.registerKey', arguments);
        var args = [keyName];
        error = error || function () {};
        exec(callback, error, 'toast.inputdevice', 'registerKey', args);
    },
    unregisterKey: function (keyName, callback, error) {
        argscheck.checkArgs('sfF', 'inputdevice.unregisterKey', arguments);
        var args = [keyName];
        error = error || function () {};
        exec(callback, error, 'toast.inputdevice', 'unregisterKey', args);
    }
};

module.exports = inputdeviceExport;

});

// file: www/tvchannel.js
define('cordova-plugin-toast.tvchannel', function(require, exports, module) {

'use strict';

var tuneModeList = ['ALL', 'DIGITAL', 'ANALOG', 'FAVORITE'];

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

var tvchannelExport = {
    tune: function (tuneOption, successCallback, errorCallback) {
        argscheck.checkArgs('ooF', 'tvchannel.tune', arguments);
        if(typeof tuneOption.major != 'number') {
            throw new TypeError('tuneOption is not a number.');
        }
        if(typeof tuneOption.minor != 'number') {
            throw new TypeError('tuneOption is not a number.');
        }
        if(!successCallback.onsuccess || typeof successCallback.onsuccess != 'function') {
            throw new TypeError('successCallback.onsuccess is not a function.');
        }
        if(!successCallback.onnosignal || typeof successCallback.onnosignal != 'function') {
            throw new TypeError('successCallback.onnosignal is not a function.');
        }
        if(!successCallback.onprograminforeceived || typeof successCallback.onprograminforeceived != 'function') {
            throw new TypeError('successCallback.onprograminforeceived is not a function.');
        }

        errorCallback = errorCallback || function () {};

        var args = [tuneOption];
        exec(successCallback, errorCallback, 'toast.tvchannel', 'tune', args);
    },
    tuneUp: function (successCallback, errorCallback, tuneMode) {
        argscheck.checkArgs('oFS', 'tvchannel.tuneUp', arguments);
        if(!successCallback.onsuccess || typeof successCallback.onsuccess != 'function') {
            throw new TypeError('successCallback.onsuccess is not a function.');
        }
        if(!successCallback.onnosignal || typeof successCallback.onnosignal != 'function') {
            throw new TypeError('successCallback.onnosignal is not a function.');
        }
        if(!successCallback.onprograminforeceived || typeof successCallback.onprograminforeceived != 'function') {
            throw new TypeError('successCallback.onprograminforeceived is not a function.');
        }

        errorCallback = errorCallback || function () {};
        tuneMode = tuneMode || 'ALL';

        var match = false;
        for (var i = 0; i < tuneModeList.length; i++) {
            if (tuneMode == tuneModeList[i]) {
                match = true;
                break;
            }
        }
        if (!match) {
            throw new RangeError('tuneMode is wrong.');
        }

        var args = [tuneMode];
        exec(successCallback, errorCallback, 'toast.tvchannel', 'tuneUp', args);
    },
    tuneDown: function (successCallback, errorCallback, tuneMode) {
        argscheck.checkArgs('oFS', 'tvchannel.tuneDown', arguments);
        if(!successCallback.onsuccess || typeof successCallback.onsuccess != 'function') {
            throw new TypeError('successCallback.onsuccess is not a function.');
        }
        if(!successCallback.onnosignal || typeof successCallback.onnosignal != 'function') {
            throw new TypeError('successCallback.onnosignal is not a function.');
        }
        if(!successCallback.onprograminforeceived || typeof successCallback.onprograminforeceived != 'function') {
            throw new TypeError('successCallback.onprograminforeceived is not a function.');
        }

        errorCallback = errorCallback || function () {};
        tuneMode = tuneMode || 'ALL';

        var match = false;
        for (var i = 0; i < tuneModeList.length; i++) {
            if (tuneMode == tuneModeList[i]) {
                match = true;
                break;
            }
        }
        if (!match) {
            throw new RangeError('tuneMode is wrong.');
        }

        var args = [tuneMode];
        exec(successCallback, errorCallback, 'toast.tvchannel', 'tuneDown', args);
    },
    findChannel: function (major, minor, successCallback, errorCallback) {
        argscheck.checkArgs('nnfF', 'tvchannel.findChannel', arguments);

        errorCallback = errorCallback || function () {};

        var args = [major, minor];
        exec(successCallback, errorCallback, 'toast.tvchannel', 'findChannel', args);
    },
    getChannelList: function (successCallback, errorCallback, tuneMode, nStart, number) {
        argscheck.checkArgs('fFSNN', 'tvchannel.getChannelList', arguments);

        errorCallback = errorCallback || function () {};
        tuneMode = tuneMode || 'ALL';
        nStart = nStart || 0;
        number = number || '';

        var match = false;
        for (var i = 0; i < tuneModeList.length; i++) {
            if (tuneMode == tuneModeList[i]) {
                match = true;
                break;
            }
        }
        if (!match) {
            throw new RangeError('tuneMode is wrong.');
        }
        if(nStart < 0) {
            throw new RangeError('nStart is a negative number.');
        }
        if(number < 0) {
            throw new RangeError('number is a negative number.');
        }

        var args = [tuneMode, nStart, number];
        exec(successCallback, errorCallback, 'toast.tvchannel', 'getChannelList', args);
    },
    getCurrentChannel: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'tvchannel.getCurrentChannel', arguments);

        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.tvchannel', 'getCurrentChannel', args);
    },
    getProgramList: function (channelInfo, startTime, successCallback, errorCallback, duration) {
        argscheck.checkArgs('odfFN', 'tvchannel.getProgramList', arguments);
        if(!channelInfo.major || typeof channelInfo.major != 'number') {
            throw new TypeError('channelInfo.major is not a number.');
        }
        if(!channelInfo.minor || typeof channelInfo.minor != 'number') {
            throw new TypeError('channelInfo.minor is not a number.');
        }

        errorCallback = errorCallback || function () {};
        duration = duration || '';

        if(duration < 0) {
            throw new RangeError('duration is a negative number.');
        }

        var args = [channelInfo, startTime, duration];
        exec(successCallback, errorCallback, 'toast.tvchannel', 'getProgramList', args);
    },
    getCurrentProgram: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'tvchannel.getCurrentProgram', arguments);

        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.tvchannel', 'getCurrentProgram', args);
    },
    addChannelChangeListener: function (callback) {
        argscheck.checkArgs('f', 'tvchannel.addChannelChangeListener', arguments);

        var args = [];
        exec(callback, null, 'toast.tvchannel', 'addChannelChangeListener', args);
    },
    removeChannelChangeListener: function (callback) {
        argscheck.checkArgs('F', 'tvchannel.removeChannelChangeListener', arguments);

        var args = [];
        exec(callback, null, 'toast.tvchannel', 'removeChannelChangeListener', args);
    }
};

module.exports = tvchannelExport;

});

// file: www/tvwindow.js
define('cordova-plugin-toast.tvwindow', function(require, exports, module) {

'use strict';

var videoSourceList = [
    'TV1',
    'AV1', 'AV2', 'AV3', 'AV4',
    'SVIDEO1', 'SVIDEO2', 'SVIDEO3', 'SVIDEO4',
    'COMP1', 'COMP2', 'COMP3', 'COMP4',
    'PC1', 'PC2', 'PC3', 'PC4',
    'HDMI1', 'HDMI2', 'HDMI3', 'HDMI4',
    'SCART1', 'SCART2', 'SCART3', 'SCART4',
    'DVI1', 'DVI2', 'DVI3', 'DVI4'
];

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

var tvwindowExport = {
    setSource: function (videoSource, successCallback, errorCallback) {
        argscheck.checkArgs('ofF', 'tvwindow.setSource', arguments);
        if(!videoSource.type || typeof videoSource.type != 'string') {
            throw new TypeError('videoSource.type is not a string.');
        }
        if(!videoSource.number || typeof videoSource.number != 'number') {
            throw new TypeError('videoSource.number is not a number.');
        }
        var match = false;
        for (var i = 0; i < videoSourceList.length; i++) {
            if (videoSource.type + videoSource.number == videoSourceList[i]) {
                match = true;
                break;
            }
        }
        if (!match) {
            throw new TypeError('videoSource is wrong.');
        }

        errorCallback = errorCallback || function () {};

        var args = [videoSource];
        exec(successCallback, errorCallback, 'toast.tvwindow', 'setSource', args);
    },
    getSource: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'tvwindow.getSource', arguments);

        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.tvwindow', 'getSource', args);
    },
    show: function (rectangle, successCallback, errorCallback) {
        argscheck.checkArgs('afF', 'tvwindow.show', arguments);
        if(rectangle.length != 4) {
            throw new TypeError('rectangle.length is wrong.');
        }
        if(typeof rectangle[0] != 'number' || rectangle[0] < 0) {
            throw new TypeError('rectangle[0] is not a positive number.');
        }
        if(typeof rectangle[1] != 'number' || rectangle[1] < 0) {
            throw new TypeError('rectangle[1] is not a positive number.');
        }
        if(typeof rectangle[2] != 'number' || rectangle[2] < 0) {
            throw new TypeError('rectangle[2] is not a positive number.');
        }
        if(typeof rectangle[3] != 'number' || rectangle[3] < 0) {
            throw new TypeError('rectangle[3] is not a positive number.');
        }

        errorCallback = errorCallback || function () {};

        var args = [rectangle];
        exec(successCallback, errorCallback, 'toast.tvwindow', 'show', args);
    },
    hide: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'tvwindow.hide', arguments);

        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.tvwindow', 'hide', args);
    },
    getRect: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'tvwindow.getRect', arguments);

        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.tvwindow', 'getRect', args);
    }
};

module.exports = tvwindowExport;

});

// file: www/tvaudiocontrol.js
define('cordova-plugin-toast.tvaudiocontrol', function(require, exports, module) {


'use strict';

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

var tvaudiocontrolExport = {
    setMute: function (mute, successCallback, errorCallback) {
        argscheck.checkArgs('*fF', 'tvaudiocontrol.setMute', arguments);
        errorCallback = errorCallback || function () {};

        if(typeof mute != 'boolean') {
            var error = new TypeError('First parameter needs to be boolean type.');
            throw error;
        }

        var args = [mute];
        exec(successCallback, errorCallback, 'toast.tvaudiocontrol', 'setMute', args);
    },
    isMute: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'tvaudiocontrol.isMute', arguments);
        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.tvaudiocontrol', 'isMute', args);
    },
    setVolume: function (volume, successCallback, errorCallback) {
        argscheck.checkArgs('nfF', 'tvaudiocontrol.setVolume', arguments);
        errorCallback = errorCallback || function () {};

        var args = [volume];
        exec(successCallback, errorCallback, 'toast.tvaudiocontrol', 'setVolume', args);
    },
    setVolumeUp: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'tvaudiocontrol.setVolumeUp', arguments);
        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.tvaudiocontrol', 'setVolumeUp', args);
    },
    setVolumeDown: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'tvaudiocontrol.setVolumeDown', arguments);
        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.tvaudiocontrol', 'setVolumeDown', args);
    },
    getVolume: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'tvaudiocontrol.getVolume', arguments);
        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.tvaudiocontrol', 'getVolume', args);
    },
    setVolumeChangeListener: function (callback, successCallback, errorCallback) {
        argscheck.checkArgs('ffF', 'tvaudiocontrol.setVolumeChangeListener', arguments);
        errorCallback = errorCallback || function () {};

        var args = [callback];
        exec(successCallback, errorCallback, 'toast.tvaudiocontrol', 'setVolumeChangeListener', args);
    },
    unsetVolumeChangeListener: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'tvaudiocontrol.unsetVolumeChangeListener', arguments);
        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.tvaudiocontrol', 'unsetVolumeChangeListener', args);
    }
};

module.exports = tvaudiocontrolExport;

});

// file: www/drminfo.js
define('cordova-plugin-toast.drminfo', function(require, exports, module) {


'use strict';

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

var drminfoExport = {
    getEsn: function (compName, successCallback, errorCallback) {
        argscheck.checkArgs('sfF', 'drminfo.getEsn', arguments);
        errorCallback = errorCallback || function () {};

        var args = [compName];
        exec(successCallback, errorCallback, 'toast.drminfo', 'getEsn', args);
    },
    getSdi: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'drminfo.getSdiId', arguments);
        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.drminfo', 'getSdi', args);
    }
};

module.exports = drminfoExport;

});

// file: www/application.js
define('cordova-plugin-toast.application', function(require, exports, module) {
'use strict';

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

module.exports = {
    exit: function () {
        exec(null, null, 'toast.application', 'exit', null);
    },
    launchApp: function (appInfo, successCallback, errorCallback) {
        argscheck.checkArgs('ofF', 'application.launchApp', arguments);
        if(!appInfo.appId || typeof appInfo.appId != 'string') {
            throw new TypeError('appControl.appId is not a string');
        }

        appInfo.data = appInfo.data || {};
        if(typeof appInfo.data != 'object') {
            throw new TypeError('appControl.data is not a object');
        }

        var args = [appInfo];
        exec(successCallback, errorCallback, 'toast.application', 'launchApp', args);
    },
    getRequestedAppInfo: function (successCallback, errorCallback) {
        argscheck.checkArgs('fF', 'application.getRequestedAppInfo', arguments);

        errorCallback = errorCallback || function () {};

        var args = [];
        exec(successCallback, errorCallback, 'toast.application', 'getRequestedAppInfo', args);
    }
};

});

// file: www/Media.js
define('cordova-plugin-toast.Media', function(require, exports, module) {


'use strict';

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

var mediaObjects = null;

var Media = function () {
    if(!mediaObjects) {
        this.id = utils.createUUID();
        mediaObjects = {};
        mediaObjects[this.id] = this;
        this._mediaEventCallBack = {};
        this._containerElem = -1;
        this._duration = -1;
        this._position = 0;
        this._hooks = {};
        exec(null, null, 'toast.Media', 'create',[this.id]);
    }
    else {
        throw new RangeError('Media instance exists already. toast Media supported single instance');
    }
};

// Media EventType
Media.EVENT_STATE = 'STATE';
Media.EVENT_DURATION = 'DURATION';
Media.EVENT_POSITION = 'POSITION';
Media.EVENT_BUFFERINGPROGRESS = 'BUFFERINGPROGRESS';
Media.EVENT_SUBTITLE = 'SUBTITLE';
Media.EVENT_ENDED = 'ENDED';

//Media.MEDIA_SUBTITLE = 5;

// Media states
Media.STATE_IDLE = 'IDLE';
Media.STATE_PLAYING = 'PLAYING';
Media.STATE_PAUSED = 'PAUSED';
Media.STATE_STALLED = 'STALLED';
Media.STATE_SEEK = 'SEEK';

Media._MEDIA_CONTAINER = 'CONTAINER';
Media._MEDIA_ERROR = 'ERROR';

Media.mediaEvent = function(id, value) {
    var media = mediaObjects[id];
    if(media) {
        switch(value.type) {
        case Media.EVENT_STATE :
            if(media._mediaEventCallBack.onevent && value.data.oldState === null) {
                media._mediaEventCallBack.onevent(value);
            }
            else if(media._mediaEventCallBack.onevent && value.data.oldState !== value.data.state) {
                media._mediaEventCallBack.onevent(value);
            }
            break;
        case Media.EVENT_DURATION :
            media._duration = value.data.duration;
            media._mediaEventCallBack.onevent && media._mediaEventCallBack.onevent(value);
            break;
        case Media.EVENT_POSITION :
            media._position = Number(value.data.position);
            media._mediaEventCallBack.onevent && media._mediaEventCallBack.onevent(value);
            break;
        case Media.EVENT_BUFFERINGPROGRESS :
            media._mediaEventCallBack.onevent && media._mediaEventCallBack.onevent(value);
            break;
        case Media.EVENT_SUBTITLE :
            media._mediaEventCallBack.onevent && media._mediaEventCallBack.onevent(value);
            break;
        case Media.EVENT_ENDED :
            media.stop();
            media._mediaEventCallBack.onevent && media._mediaEventCallBack.onevent(value);
            break;
        case Media._MEDIA_CONTAINER :
            media._containerElem = value.data.containerElem;
            break;
        case Media._MEDIA_ERROR :
            media._mediaEventCallBack.onerror && media._mediaEventCallBack.onerror(value);
            break;
        default :
            console.log('Unhandled Media.mediaEvent :: ' + value.type);
            break;
        }
    }
    else {
        console.log('Received Media.onStatus callback for unknown media:: ' + id);
    }
};

Media.getInstance = function() {
    if(mediaObjects && typeof mediaObjects == 'object') {
        for(var key in mediaObjects) {
            if (mediaObjects.hasOwnProperty(key)) {
                return mediaObjects[key];
            }
        }
    }
    else {
        return new Media();
    }
};

Media.prototype.open = function(mediaUrl) {
    argscheck.checkArgs('s', 'Media.open', arguments);
    this.src = mediaUrl;
    invokeHooks('beforeopen', [this].concat(arguments));
    exec(null, null, 'toast.Media', 'open', [this.id,this.src]);
    invokeHooks('afteropen', [this].concat(arguments));
};

Media.prototype.getContainerElement = function() {
    return this._containerElem;
};

Media.prototype.play = function() {
    invokeHooks('beforeplay', [this].concat(arguments));
    exec(null, null, 'toast.Media', 'play', [this.id]);
    invokeHooks('afterplay', [this].concat(arguments));
};

Media.prototype.stop = function() {
    var me = this,
        media = mediaObjects[this.id];
    media.resetPlugin();
    exec(function() {
        me._position = 0;
        me._duration = -1;
    }, null, 'toast.Media', 'stop', [this.id]);
};

Media.prototype.seekTo = function(milliseconds) {
    argscheck.checkArgs('n', 'Media.seekTo', arguments);
    var me = this;
    exec(function(p) {
        me._position = p;
    }, null, 'toast.Media', 'seekTo', [this.id, milliseconds]);
};

Media.prototype.pause = function() {
    exec(null, null, 'toast.Media', 'pause', [this.id]);
};

Media.prototype.getDuration = function() {
    return this._duration;
};

Media.prototype.getCurrentPosition = function() {
    return this._position;
};

Media.prototype.setListener = function(listener) {
    argscheck.checkArgs('o', 'Media.setListener', arguments);
    if(arguments[0].onevent && typeof arguments[0].onevent !== 'function') {
        throw new TypeError('Type of listener.onevnet is not function');
    }
    if(arguments[0].onerror && typeof arguments[0].onerror !== 'function') {
        throw new TypeError('Type of listener.onerror is not function');
    }
    mediaObjects[this.id]._mediaEventCallBack = listener;
};

Media.prototype.unsetListener = function() {
    mediaObjects[this.id]._mediaEventCallBack = {};
};

Media.prototype.resetHook = function () {
    for(var hook in this._hooks) {
        if(this._hooks.hasOwnProperty(hook)) {
            for(var i=this._hooks[hook].length-1; i>=0; i--) {
                delete this._hooks[hook][i];
            }
            delete this._hooks[hook];
        }
    }
    this._hooks = {};
};
Media.prototype.registerHook = function (hook, fn) {
    this._hooks[hook] = this._hooks[hook] || [];
    this._hooks[hook].push(fn);
};
Media.prototype.unregisterHook = function (hook, fn) {
    if(!this._hooks[hook]) {
        return;
    }
    for(var i=this._hooks[hook].length-1; i>=0; i--) {
        if(this._hooks[hook][i] === fn) {
            this._hooks[hook].splice(i, 1);
        }
    }
};
Media.prototype.resetPlugin = function () {
    this.resetHook();
};
Media.prototype.attachPlugin = function (plugin) {
    if(plugin.onAttachToMedia) {
        plugin.onAttachToMedia(this);
    }
};

//synchronize VideoRect With Container Element
Media.prototype.syncVideoRect = function() {
    var me = this;
    exec(function(p) {
        me._position = p;
    }, null, 'toast.Media', 'syncVideoRect');
};

Media.prototype.setSubtitlePath = function(path) {
    argscheck.checkArgs('s', 'Media.setSubtitlePath', arguments);
    exec(null, null, 'toast.Media', 'setSubtitlePath',[this.id,path]);
};

Media.prototype.getSubtitleLanguageList = function(successCallback, errorCallback) {
    argscheck.checkArgs('fF', 'Media.getSubtitleLanguageList', arguments);
    errorCallback = errorCallback || function () {};
    exec(successCallback, errorCallback, 'toast.Media', 'getSubtitleLanguageList',[this.id]);
};

Media.prototype.setSubtitleLanguage = function(language) {
    argscheck.checkArgs('s', 'Media.setSubtitleLanguage', arguments);
    exec(null, null, 'toast.Media', 'setSubtitleLanguage',[this.id,language]);
};

Media.prototype.setSubtitleSync = function(milliseconds) {
    argscheck.checkArgs('n', 'Media.setSubtitleSync', arguments);
    exec(null, null, 'toast.Media', 'setSubtitleSync',[this.id,milliseconds]);
};

function invokeHooks (hook, args) {
    var media = args[0];
    args = args.slice(1);
    if(!media._hooks[hook]) {
        return;
    }
    for(var i=0; i<media._hooks[hook].length; i++) {
        media._hooks[hook][i](media, args);
    }
}

module.exports = Media;

});

// file: www/MediaPlugin.js
define('cordova-plugin-toast.MediaPlugin', function(require, exports, module) {


'use strict';

function MediaPlugin (opts) {
    this.options = opts;
}

MediaPlugin.prototype.setOption = function (key, value) {
    this.options = this.options || {};
    this.options[key] = value;
};
MediaPlugin.prototype.unsetOption = function (key) {
    if(typeof this.options === 'object' && this.options.hasOwnProperty(key)) {
        delete this.options[key];
    }
};

module.exports = MediaPlugin;

});

// file: www/util.js
define('cordova-plugin-toast.util', function(require, exports, module) {
'use strict';

function trim(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return str.replace(/^\s+|\s+$/g, '');
}

function isHTMLElement(value) {
    return (value instanceof HTMLElement);
}

function isChildOf(element, parent) {
    if (!isHTMLElement(element) || !element.parentElement) {
        return false;
    }
    if (element.parentElement === parent) {
        return true;
    }
    else {
        return isChildOf(element.parentElement, parent);
    }
}

function contains(parent, element) {
    return isChildOf(element, parent);
}

function removeClass(element, classnm) {
    if (element instanceof window.NodeList) {
        for (var i = 0; i < element.length; i++) {
            removeClass(element[i], classnm);
        }
        return;
    }
    if (!isHTMLElement(element) || typeof classnm !== 'string') {
        return false;
    }
    var className = element.className + '';
    var regex = new RegExp('(?:^|\\s+)' + classnm + '(?:\\s+|$)', 'g');
    className = className.replace(regex, ' ');
    element.className = className;

    if (hasClass(element, classnm)) { // still have the class
        removeClass(element, classnm);
    }
    element.className = trim(element.className);

    return true;
}

function addClass(element, classnm) {
    var i;
    if (element instanceof window.NodeList) {
        for (i = 0; i < element.length; i++) {
            addClass(element[i], classnm);
        }
        return;
    }
    if (!isHTMLElement(element) || typeof classnm !== 'string') {
        return false;
    }
    var tmp = classnm.split(' ');
    if (tmp.length > 1) {
        var success = true;
        for (i = 0; i < tmp.length; i++) {
            if (!addClass(element, tmp[i])) {
                success = false;
            }
        }
        return success;
    }

    if (hasClass(element, classnm)) {
        return false;
    }
    element.className = trim([element.className, classnm].join(' '));
    return true;
}

function hasClass(element, classnm) {
    if (!isHTMLElement(element) || typeof classnm !== 'string') {
        return;
    }
    var className = element.className + '';
    var regex = new RegExp('(?:^|\\s+)' + classnm + '(?:\\s+|$)', 'g');
    return regex.test(className);
}

function getElementExp(elmt) {
    if (!isHTMLElement(elmt)) {
        return '';
    }
    var id = elmt.id || '';
    var cls = elmt.className || '';
    return elmt.tagName + (id ? ('#' + id) : '') + (cls ? ('.' + cls.replace(/ /g, '.')) : '');
}

function isRemoteUrl(url) {
    var reg = /^((ftp|https?):\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)/igm;
    return !!reg.test(url);
}

function getValueOf(exp, base) {
    if (typeof exp !== 'string') {
        return exp;
    }
    var depths = exp.split('.');
    if (depths.length && depths[0] === 'window') {
        depths.shift(); // remove first 'window'
    }

    var curValue = base || window;
    for (var i = 0, len = depths.length; i < len; i++) {
        if (typeof curValue[depths[i]] === 'undefined') {
            return undefined;
        }
        curValue = curValue[depths[i]];
    }
    return curValue;
}

/**
 * getBoundingRect has argument 'mode' as 2nd parameter.
 * This will determine which rectangle would be returned.
 * +-----------------------+--> mode: 'margin'
 * |        margin         |
 * |  +-----------------+--+--> mode: default(undefined)
 * |  |     border      |  |
 * |  |  +-----------+--+--+--> mode: 'innerborder'
 * |  |  |  padding  |  |  |
 * |  |  |  +-----+--+--+--+--> mode: 'innerpadding'
 * |  |  |  |     |  |  |  |
 * |  |  |  +-----+  |  |  |
 * |  |  +-----------+  |  |
 * |  +-----------------+  |
 * +-----------------------+
 */
function getBoundingRect(el, mode) {
    var width = 0,
        height = 0,
        left = 0,
        top = 0,
        borderLeft,
        borderRight,
        borderTop,
        borderBottom,
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom;
    if (el && el === el.window) { // window
        width = el.document.documentElement.clientWidth;
        height = el.document.documentElement.clientHeight;
        return {
            left: 0,
            top: 0,
            width: width,
            height: height,
            right: width,
            bottom: height
        };
    }
    if (el && el.nodeType && el.nodeType === 9) { // document
        width = Math.max(el.body.scrollWidth, el.documentElement.scrollWidth, el.body.offsetWidth, el.documentElement.offsetWidth, el.documentElement.clientWidth);
        height = Math.max(el.body.scrollHeight, el.documentElement.scrollHeight, el.body.offsetHeight, el.documentElement.offsetHeight, el.documentElement.clientHeight);
        return {
            left: 0,
            top: 0,
            width: width,
            height: height,
            right: width,
            bottom: height
        };
    }

    if (!isHTMLElement(el) || !el.ownerDocument) {
        return null;
    }

    if ('getBoundingClientRect' in document.documentElement) {
        var clientRect = el.getBoundingClientRect();
        if (el === el.ownerDocument.body) {
            left = document.body.offsetLeft + parseFloat(getStyle(el, 'marginLeft') || 0);
            top = document.body.offsetTop + parseFloat(getStyle(el, 'marginTop') || 0);
        }
        else {
            left += clientRect.left;
            top += clientRect.top;

            // left += (window.pageXOffset || el.ownerDocument.documentElement.scrollLeft || document.body.scrollLeft);
            // top += (window.pageYOffset || el.ownerDocument.documentElement.scrollTop || document.body.scrollTop);
            left -= el.ownerDocument.documentElement.clientLeft;
            top -= el.ownerDocument.documentElement.clientTop;
        }
        width = clientRect.width;
        height = clientRect.height;
    }
    else if (typeof el.offsetWidth !== 'undefined' || typeof el.offsetHeight !== 'undefined') {
        left = parseInt(el.offsetLeft, 10);
        top = parseInt(el.offsetTop, 10);
        width = parseInt(el.offsetWidth, 10);
        height = parseInt(el.offsetHeight, 10);
    }
    else {
        return null;
    }

    // including margin as bounding rect
    if (mode && mode === 'margin') {
        marginLeft = parseInt(getStyle(el, 'marginLeft'), 10) || 0;
        marginRight = parseInt(getStyle(el, 'marginRight'), 10) || 0;
        marginTop = parseInt(getStyle(el, 'marginTop'), 10) || 0;
        marginBottom = parseInt(getStyle(el, 'marginBottom'), 10) || 0;
        left -= marginLeft;
        top -= marginTop;
        width += marginLeft + marginRight;
        height += marginTop + marginBottom;

        return {
            left: left,
            top: top,
            width: width,
            height: height,
            right: left + width,
            bottom: top + height,
            margin: {
                left: marginLeft,
                right: marginRight,
                top: marginTop,
                bottom: marginBottom
            }
        };
    }
    else if (mode && mode === 'innerborder') {
        borderLeft = parseInt(getStyle(el, 'borderLeftWidth'), 10) || 0;
        borderRight = parseInt(getStyle(el, 'borderRightWidth'), 10) || 0;
        borderTop = parseInt(getStyle(el, 'borderTopWidth'), 10) || 0;
        borderBottom = parseInt(getStyle(el, 'borderBottomWidth'), 10) || 0;
        left += borderLeft;
        top += borderTop;
        width -= borderLeft + borderRight;
        height -= borderTop + borderBottom;

        return {
            left: left,
            top: top,
            width: width,
            height: height,
            right: left + width,
            bottom: top + height,
            border: {
                left: borderLeft,
                right: borderRight,
                top: borderTop,
                bottom: borderBottom
            }
        };
    }
    else if (mode && mode === 'innerpadding') {
        borderLeft = parseInt(getStyle(el, 'borderLeftWidth'), 10) || 0;
        borderRight = parseInt(getStyle(el, 'borderRightWidth'), 10) || 0;
        borderTop = parseInt(getStyle(el, 'borderTopWidth'), 10) || 0;
        borderBottom = parseInt(getStyle(el, 'borderBottomWidth'), 10) || 0;
        paddingLeft = parseInt(getStyle(el, 'paddingLeft'), 10) || 0;
        paddingRight = parseInt(getStyle(el, 'paddingRight'), 10) || 0;
        paddingTop = parseInt(getStyle(el, 'paddingTop'), 10) || 0;
        paddingBottom = parseInt(getStyle(el, 'paddingBottom'), 10) || 0;
        left += borderLeft + paddingLeft;
        top += borderTop + paddingTop;
        width -= borderLeft + paddingLeft + paddingRight + borderRight;
        height -= borderTop + paddingTop + paddingBottom + borderBottom;

        return {
            left: left,
            top: top,
            width: width,
            height: height,
            right: left + width,
            bottom: top + height,
            border: {
                left: borderLeft,
                right: borderRight,
                top: borderTop,
                bottom: borderBottom
            },
            padding: {
                left: paddingLeft,
                right: paddingRight,
                top: paddingTop,
                bottom: paddingBottom
            }
        };
    }
    else {
        return {
            left: left,
            top: top,
            width: width,
            height: height,
            right: left + width,
            bottom: top + height
        };
    }
}

function getPosition(elem) {
    var offsetParent, offset,
        parentOffset = {
            top: 0,
            left: 0
        };

    // Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
    if (getStyle(elem, 'position') === 'fixed') {
        // We assume that getBoundingClientRect is available when computed position is fixed
        offset = elem.getBoundingClientRect();

    }
    else {
        // Get *real* offsetParent
        offsetParent = getOffsetParent(elem);

        // Get correct offsets
        offset = getBoundingOffset(elem);
        parentOffset = getBoundingOffset(offsetParent);

        // Add offsetParent borders
        parentOffset.top += parseFloat(getStyle(offsetParent, 'borderTopWidth'));
        parentOffset.left += parseFloat(getStyle(offsetParent, 'borderLeftWidth'));
    }

    offset.top -= parentOffset.top;
    offset.left -= parentOffset.left;

    offset.top -= parseFloat(getStyle(elem, 'marginTop'));
    offset.left -= parseFloat(getStyle(elem, 'marginLeft'));

    // Subtract parent offsets and element margins
    return offset;
}

function getOffsetParent(el) {
    var docElem = el.ownerDocument.documentElement;
    var offsetParent = el.offsetParent || docElem;

    while (offsetParent && getStyle(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent.offsetParent;
    }

    return offsetParent || docElem;
}

function getBoundingSize(el, mode) {
    if (!isHTMLElement(el)) {
        return null;
    }
    var rect = getBoundingRect(el, mode);
    return {
        width: rect.width,
        height: rect.height
    };
}

function getBoundingOffset(el, mode) {
    if (!isHTMLElement(el)) {
        return null;
    }
    var rect = getBoundingRect(el, mode);
    return {
        left: rect.left,
        top: rect.top
    };
}

function getElementVisibility(el) {
    if (!isHTMLElement(el)) {
        return false;
    }
    if (getStyle(el, 'display') === 'none' || getStyle(el, 'visibility') === 'hidden' || getStyle(el, 'opacity') === '0') {
        return false;
    }
    if (el.parentElement && !getElementVisibility(el.parentElement)) {
        return false;
    }
    return true;
}

var camelCache = {};
var rexHypen = /-(.)/gi;
function camelCase(input) {
    if (!rexHypen.test(input)) {
        return input;
    }
    if (camelCache[input]) {
        return camelCache[input];
    }
    camelCache[input] = input.toLowerCase().replace(rexHypen, function(match, word, index) {
        return index === 0 ? word : word.toUpperCase();
    });
    return camelCache[input];
}

function setStyle(element, prop, value) {
    if (element instanceof window.NodeList) {
        for (var i = 0; i < element.length; i++) {
            setStyle(element[i], prop, value);
        }
        return;
    }

    if (!isHTMLElement(element)) {
        return;
    }

    if (prop instanceof Object) {
        for (var p in prop) {
            if (typeof p === 'string' && prop.hasOwnProperty(p)) {
                setStyle(element, camelCase(p), prop[p]);
            }
        }
    }
    else if (typeof prop === 'string') {
        prop = camelCase(prop);
        element.style[prop] = value;
    }
}

function getStyle(element, prop) {
    prop = camelCase(prop);
    return element.currentStyle ?
        element.currentStyle[prop] :
        document.defaultView.getComputedStyle(element, '')[prop];
}

function createElement(tagName, attributes, children) {
    var elem = document.createElement(tagName);
    for (var attr in attributes) {
        if (attr === 'className') { // 'class' is keyword for JavaScript, so we use 'className' for the name
            elem.setAttribute('class', attributes[attr]);
        }
        else {
            elem.setAttribute(attr, attributes[attr]);
        }
    }
    if (typeof children === 'string') {
        elem.appendChild(document.createTextNode(children));
    }
    else if (children && children.length) {
        for (var i = 0; children && i < children.length; i++) {
            if (isHTMLElement(children[i])) {
                elem.appendChild(children[i]);
            }
        }
    }
    else if (isHTMLElement(children)) {
        elem.appendChild(children);
    }
    return elem;
}

module.exports = {
    trim: trim,
    createElement: createElement,
    isHTMLElement: isHTMLElement,
    isChildOf: isChildOf,
    contains: contains,
    removeClass: removeClass,
    hasClass: hasClass,
    addClass: addClass,
    getElementExp: getElementExp,
    isRemoteUrl: isRemoteUrl,
    getValueOf: getValueOf,
    getBoundingRect: getBoundingRect,
    getPosition: getPosition,
    getOffsetParent: getOffsetParent,
    getBoundingSize: getBoundingSize,
    getBoundingOffset: getBoundingOffset,
    getElementVisibility: getElementVisibility,
    setStyle: setStyle,
    getStyle: getStyle
};

});

// file: src/sectv-orsay/inputdeviceProxy.js
define('cordova-plugin-toast.inputdeviceProxy', function(require, exports, module) {

'use strict';

var supportedKeys = [
    {name: 'ArrowUp', code: 29460},
    {name: 'ArrowDown', code: 29461},
    {name: 'ArrowLeft', code: 4},
    {name: 'ArrowRight', code: 5},
    {name: 'Enter', code: 29443},
    {name: 'Return', code: 88},
    {name: 'ColorF0Red', code: 108},
    {name: 'ColorF1Green', code: 20},
    {name: 'ColorF2Yellow', code: 21},
    {name: 'ColorF3Blue', code: 22},
    {name: 'MediaRecord', code: 192},
    {name: 'MediaStop', code: 70},
    {name: 'MediaFastForward', code: 72},
    {name: 'MediaPlay', code: 71},
    {name: 'MediaPause', code: 74},
    {name: 'MediaRewind', code: 69},
    {name: 'Tools', code: 75},
    {name: '0', code: 17},
    {name: '1', code: 101},
    {name: '2', code: 98},
    {name: '3', code: 6},
    {name: '4', code: 8},
    {name: '5', code: 9},
    {name: '6', code: 10},
    {name: '7', code: 12},
    {name: '8', code: 13},
    {name: '9', code: 14}
];

module.exports = {

    getSupportedKeys: function (success, fail, args) {
        try {
            setTimeout(function() {
                success(supportedKeys);
            }, 0);
        }
        catch (e) {
            var error = new Error(e.message);
            error.name = e.name;
            setTimeout(function() {
                fail(error);
            }, 0);
        }
    },
    getKey: function(success, fail, args) {
        try {
            for(var i = 0; i < supportedKeys.length; i++) {
                if(supportedKeys[i].name === args[0]) {
                    break;
                }
            }
            if(i != supportedKeys.length) {
                setTimeout(function() {
                    success(supportedKeys[i]);
                }, 0);
            }
            else {
                var error = new RangeError('keyName is not in the supported keys set.');
                error.name = 'RangeError';
                setTimeout(function() {
                    fail(error);
                }, 0);
            }
        }
        catch (e) {
            var error = new Error(e.message);
            error.name = e.name;
            setTimeout(function() {
                fail(e);
            }, 0);
        }
    },
    registerKey: function(success, fail, args) {
        try {
            var error;
            var SEF = require('cordova/plugin/SEF');
            var AppCommonPlugin = SEF.get('AppCommon');
            for(var i = 0; i < supportedKeys.length; i++) {
                if(supportedKeys[i].name === args[0]) {
                    break;
                }
            }
            if(i != supportedKeys.length) {
                var result = AppCommonPlugin.Execute('RegisterKey',supportedKeys[i].code);
                if(result > 0) {
                    setTimeout(function() {
                        success();
                    }, 0);
                }
                else {
                    error = new Error('registerKey error');
                    error.name = 'registerKey error';
                    setTimeout(function() {
                        fail(error);
                    }, 0);
                }
            }
            else {
                error = new RangeError('keyName is not in the supported keys set.');
                error.name = 'RangeError';
                setTimeout(function() {
                    fail(error);
                }, 0);
            }
        }
        catch (e) {
            error = new Error(e.message);
            error.name = e.name;
            setTimeout(function() {
                fail(error);
            }, 0);
        }
    },
    unregisterKey: function(success, fail, args) {
        try {
            var error;
            var SEF = require('cordova/plugin/SEF');
            var AppCommonPlugin = SEF.get('AppCommon');
            for(var i = 0; i < supportedKeys.length; i++) {
                if(supportedKeys[i].name === args[0]) {
                    break;
                }
            }
            if(i != supportedKeys.length) {
                var result = AppCommonPlugin.Execute('UnregisterKey',supportedKeys[i].code);
                if(result > 0) {
                    success();
                }
                else {
                    error = new Error('UnregisterKey error');
                    error.name = 'UnregisterKey error';
                    setTimeout(function() {
                        fail(error);
                    }, 0);
                }
            }
            else {
                error = new RangeError('keyName is not in the supported keys set.');
                error.name = 'RangeError';
                setTimeout(function() {
                    fail(error);
                }, 0);
            }
        }
        catch (e) {
            error = new Error(e.message);
            error.name = e.name;
            setTimeout(function() {
                fail(error);
            }, 0);
        }
    }
};

require('cordova/exec/proxy').add('toast.inputdevice',module.exports);

});

// file: src/sectv-orsay/tvwindowProxy.js
define('cordova-plugin-toast.tvwindowProxy', function(require, exports, module) {

'use strict';

var sefObject = require('cordova/plugin/SEF');
var sef = sefObject.get('Window');

var videoSourceTypeList = ['TV', 'AV', 'SVIDEO', 'COMP', 'PC', 'HDMI', 'SCART', 'DVI', 'MEDIA'];
var videoSourceList = {
    TV1: 0,
    AV1: 15, AV2: 16, AV3: 17, AV4: 18,
    SVIDEO1: 19, SVIDEO2: 20, SVIDEO3: 21, SVIDEO4: 22,
    COMP1: 23, COMP2: 24, COMP3: 25, COMP4: 26,
    PC1: 27, PC2: 28, PC3: 29, PC4: 30,
    HDMI1: 31, HDMI2: 32, HDMI3: 33, HDMI4: 34,
    SCART1: 35, SCART2: 36, SCART3: 37, SCART4: 38,
    DVI1: 39, DVI2: 40, DVI3: 41, DVI4: 42,
    MEDIA: 43
};
var windowType = 0;
var videoSource = {
    type: '',
    number: -1
};
var windowRect = ['', '', '', ''];

module.exports = {
    setSource: function (success, fail, args) {
        var videoSourceStr = args[0].type + args[0].number;

        var result = sef.Execute('SetSource', videoSourceList[videoSourceStr]);

        if (result != -1) {
            videoSource.type = args[0].type;
            videoSource.number = args[0].number;

            setTimeout(function () {
                success(videoSource);
            }, 0);
        }
        else {
            setTimeout(function () {
                fail(new Error('Fail to find source.'));
            }, 0);
        }
    },
    getSource: function (success, fail, args) {
        if (videoSource.type) {
            setTimeout(function () {
                success(videoSource);
            }, 0);
        }
        else {
            var sourceInfo = webapis.tv.window.getSource(windowType);

            if (sourceInfo.type !== undefined && typeof sourceInfo.type == 'number' && 0 <= sourceInfo.type && sourceInfo.type <= 8) {
                videoSource.type = videoSourceTypeList[sourceInfo.type];
                videoSource.number = sourceInfo.number;

                setTimeout(function () {
                    success(videoSource);
                }, 0);
            }
            else {
                setTimeout(function () {
                    fail(new Error('Fail to get source.'));
                }, 0);
            }
        }
    },
    show: function (success, fail, args) {
        var result = webapis.tv.window.setRect({
            left: args[0][0],
            top: args[0][1],
            width: args[0][2],
            height: args[0][3]
        }, windowType);

        if (result) {
            windowRect[0] = args[0][0] + 'px';
            windowRect[1] = args[0][1] + 'px';
            windowRect[2] = args[0][2] + 'px';
            windowRect[3] = args[0][3] + 'px';

            sef.Execute('SetPreviousSource');
            document.getElementById('_plugin_Window').style.position = 'fixed';

            result = webapis.tv.window.show(windowType);
            if (result) {
                setTimeout(function () {
                    success(windowRect);
                }, 0);
            }
            else {
                setTimeout(function () {
                    fail(new Error('Fail to show window.'));
                }, 0);
            }
        }
        else {
            setTimeout(function () {
                fail(new Error('Fail to show window.'));
            }, 0);
        }
    },
    hide: function (success, fail, args) {
        sef.Execute('SetSource', videoSourceList.MEDIA);

        var result = webapis.tv.window.hide(windowType);
        if (result) {
            windowRect[0] = '';
            windowRect[1] = '';
            windowRect[2] = '';
            windowRect[3] = '';

            setTimeout(function () {
                success();
            }, 0);
        }
        else {
            setTimeout(function () {
                fail(new Error('Fail to hide window.'));
            }, 0);
        }
    },
    getRect: function (success, fail, args) {
        if (windowRect[0]) {
            setTimeout(function () {
                success(windowRect);
            }, 0);
        }
        else {
            setTimeout(function () {
                fail(new Error('Fail to get rectagle.'));
            }, 0);
        }
    }
};

require('cordova/exec/proxy').add('toast.tvwindow', module.exports);

});

// file: src/sectv-orsay/tvchannelProxy.js
define('cordova-plugin-toast.tvchannelProxy', function(require, exports, module) {

'use strict';

var sefObject = require('cordova/plugin/SEF');
var sef = sefObject.get('Window');

var windowType = 0;
var channelChangeCallback = [];

var setChannel = {
    up: 3,
    down: 4
};
var tuneModeList = {
    ALL: 0,
    DIGITAL: 1,
    ANALOG: 2,
    FAVORITE: 3
};

function fireChannelChangeEvent (channelInfo) {
    for (var i = 0; i < channelChangeCallback.length; i++) {
        channelChangeCallback[i](channelInfo);
    }
}

module.exports = {
    tune: function (success, fail, args) {
        var result = sef.Execute('SetChannel', args[0].major, args[0].minor);

        if (result != -1) {
            var channelInfo = webapis.tv.channel.getCurrentChannel(windowType);
            setTimeout(function () {
                success.onsuccess(channelInfo);
                fireChannelChangeEvent(channelInfo);
            }, 0);
        }
        else {
            setTimeout(function () {
                success.onnosignal();
            }, 0);
        }
    },
    tuneUp: function (success, fail, args) {
        var result = sef.Execute('SetChannel_Seek', setChannel.up, tuneModeList[args[0]]);

        if (result != -1) {
            var channelInfo = webapis.tv.channel.getCurrentChannel(windowType);
            setTimeout(function () {
                success.onsuccess(channelInfo);
                fireChannelChangeEvent(channelInfo);
            }, 0);
        }
        else {
            setTimeout(function () {
                fail(new Error('Fail to tune up.'));
            }, 0);
        }
    },
    tuneDown: function (success, fail, args) {
        var result = sef.Execute('SetChannel_Seek', setChannel.down, tuneModeList[args[0]]);

        if (result != -1) {
            setTimeout(function () {
                var channelInfo = webapis.tv.channel.getCurrentChannel(windowType);
                success.onsuccess(channelInfo);
                fireChannelChangeEvent(channelInfo);
            }, 0);
        }
        else {
            setTimeout(function () {
                fail(new Error('Fail to tune up.'));
            }, 0);
        }
    },
    findChannel: function (success, fail, args) {
        webapis.tv.channel.findChannel(args[0], args[1], success, fail);
    },
    getChannelList: function (success, fail, args) {
        webapis.tv.channel.getChannelList(success, fail, tuneModeList[args[0]], args[1], args[2]);
    },
    getCurrentChannel: function (success, fail, args) {
        var channelInfo = webapis.tv.channel.getCurrentChannel(windowType);

        setTimeout(function () {
            success(channelInfo);
        }, 0);
    },
    getProgramList: function (success, fail, args) {
        var startTime = Math.round(args[1].getTime()/1000); //convert to epoch time
        var duration = args[2] * 3600; //convert hour to second

        webapis.tv.channel.getProgramList(args[0], startTime, success, fail, duration);
    },
    getCurrentProgram: function (success, fail, args) {
        var programInfo = webapis.tv.channel.getCurrentProgram(windowType);

        setTimeout(function () {
            success(programInfo);
        }, 0);
    },
    addChannelChangeListener: function (success, fail, args) {
        channelChangeCallback.push(success);
    },
    removeChannelChangeListener: function (success, fail, args) {
        if(success) {
            for (var i = 0; i < channelChangeCallback.length; i++) {
                if (success === channelChangeCallback[i]) {
                    channelChangeCallback.splice(i, 1);
                }
            }
        }
        else {
            channelChangeCallback = [];
        }
    }
};

require('cordova/exec/proxy').add('toast.tvchannel', module.exports);

});

// file: src/sectv-orsay/tvaudiocontrolProxy.js
define('cordova-plugin-toast.tvaudiocontrolProxy', function(require, exports, module) {


'use strict';

var SEF = require('cordova/plugin/SEF');

var volumeChangeCallback = null;

var PL_AUDIO_VOLUME_KEY_UP = 0;
var PL_AUDIO_VOLUME_KEY_DOWN = 1;

var PLR_TRUE = 1;
var PLR_FALSE = 0;

function volumeTrigger(volume) {
    var sef = SEF.get('Audio');

    if(!volume) {
        volume = sef.Execute('GetVolume');
    }

    if(volumeChangeCallback) {
        if((typeof volume == 'number') && (volume != -1)) {
            volumeChangeCallback(volume);
        }
    }
}

module.exports = {
    setMute: function (success, fail, args) {
        var userMute = args[0] ? PLR_TRUE : PLR_FALSE;

        var sef = SEF.get('Audio');
        var result = sef.Execute('SetUserMute', userMute);

        if (result != -1) {
            setTimeout(function () {
                success();
            }, 0);
        }
        else {
            setTimeout(function () {
                var e = new Error('failed to setMute');
                fail(e);
            }, 0);
        }
    },
    isMute: function (success, fail, args) {
        var sef = SEF.get('Audio');
        var result = sef.Execute('GetUserMute');

        if (result != -1) {
            result = (result == PLR_TRUE) ? true : false;
            setTimeout(function () {
                success(result);
            }, 0);
        }
        else {
            setTimeout(function () {
                var e = new Error('failed to execute isMute');
                fail(e);
            }, 0);
        }
    },
    setVolume: function (success, fail, args) {
        var sef = SEF.get('Audio');
        var muteResult = sef.Execute('SetUserMute', PLR_FALSE);

        if (muteResult != -1) {
            var result = sef.Execute('SetVolume', args[0]);

            if(result != -1) {
                setTimeout(function () {
                    volumeTrigger(args[0]);
                    success();
                }, 0);
            }
            else {
                setTimeout(function () {
                    var e = new Error('failed to setVolume');
                    fail(e);
                }, 0);
            }
        }
        else {
            setTimeout(function () {
                var e = new Error('failed to setVolumeDown');
                fail(e);
            }, 0);
        }
    },
    setVolumeUp: function (success, fail, args) {
        var sef = SEF.get('Audio');
        var muteResult = sef.Execute('SetUserMute', PLR_FALSE);

        if (muteResult != -1) {
            var result = sef.Execute('SetVolumeWithKey', PL_AUDIO_VOLUME_KEY_UP);

            if(result != -1) {
                setTimeout(function () {
                    volumeTrigger();
                    success();
                }, 0);
            }
            else {
                setTimeout(function () {
                    var e = new Error('failed to setVolumeUp');
                    fail(e);
                }, 0);
            }
        }
        else {
            setTimeout(function () {
                var e = new Error('failed to setVolumeDown');
                fail(e);
            }, 0);
        }
    },
    setVolumeDown: function (success, fail, args) {
        var sef = SEF.get('Audio');
        var muteResult = sef.Execute('SetUserMute', PLR_FALSE);

        if (muteResult != -1) {
            var result = sef.Execute('SetVolumeWithKey', PL_AUDIO_VOLUME_KEY_DOWN);

            if(result != -1) {
                setTimeout(function () {
                    volumeTrigger();
                    success();
                }, 0);
            }
            else {
                setTimeout(function () {
                    var e = new Error('failed to setVolumeDown');
                    fail(e);
                }, 0);
            }
        }
        else {
            setTimeout(function () {
                var e = new Error('failed to setVolumeDown');
                fail(e);
            }, 0);
        }
    },
    getVolume: function (success, fail, args) {
        var sef = SEF.get('Audio');
        var result = sef.Execute('GetVolume');

        if (result != -1) {
            setTimeout(function () {
                success(result);
            }, 0);
        }
        else {
            setTimeout(function () {
                var e = new Error('failed to getVolume');
                fail(e);
            }, 0);
        }
    },
    setVolumeChangeListener: function (success, fail, args) {
        volumeChangeCallback = args[0];
        if(volumeChangeCallback) {
            setTimeout(function () {
                success();
            }, 0);
        }
        else {
            setTimeout(function () {
                var e = new Error('failed to setVolumeChangeListener');
                fail(e);
            }, 0);
        }
    },
    unsetVolumeChangeListener: function (success, fail, args) {
        volumeChangeCallback = '';

        if(!volumeChangeCallback) {
            setTimeout(function () {
                success();
            }, 0);
        }
        else {
            setTimeout(function () {
                var e = new Error('failed to unsetVolumeChangeListener');
                fail(e);
            }, 0);
        }
    }
};

require('cordova/exec/proxy').add('toast.tvaudiocontrol', module.exports);

});

// file: src/sectv-orsay/drminfoProxy.js
define('cordova-plugin-toast.drminfoProxy', function(require, exports, module) {


'use strict';

var SEF = require('cordova/plugin/SEF');

module.exports = {
    getEsn: function(success, fail, args) {
        var sef = SEF.get('ExternalWidgetInterface');
        var result = sef.Execute('GetESN', args[0]);

        if (result) {
            setTimeout(function () {
                success(result);
            }, 0);
        }
        else {
            setTimeout(function () {
                var e = new Error('failed to getEsn');
                fail(e);
            }, 0);
        }
    },
    getSdi: function(success, fail, args) {
        var sef = SEF.get('ExternalWidgetInterface');
        var result = sef.Execute('GetSDI_ID');

        if (result) {
            setTimeout(function () {
                success(result);
            }, 0);
        }
        else {
            setTimeout(function () {
                var e = new Error('failed to getSdiId');
                fail(e);
            }, 0);
        }
    }
};

require('cordova/exec/proxy').add('toast.drminfo',module.exports);

});

// file: src/sectv-orsay/applicationProxy.js
define('cordova-plugin-toast.applicationProxy', function(require, exports, module) {
'use strict';

module.exports = {
    exit: function (success, fail, args) {
        curWidget.setPreference('return', 'true');
    },
    launchApp: function (success, fail, args) {
        try {
            var paramAppId = args[0].appId;
            var paramData = args[0].data;
            var paramDataKeys = Object.keys(paramData);

            var widgetType = '02'; // Common.API.EVENT_ENUM.RUN_SEARCH_WIDGET
            var webbrowserType = '3010'; // Common.API.EVENT_ENUM.RUN_WEBBROWSER

            /*jshint undef: false */
            if(device.version < 'T-INFOLINK2013-9999') { // for 2013'
                webbrowserType = '3008'; // Common.API.EVENT_ENUM.RUN_WEBBROWSER
            }

            if(paramAppId == '29_fullbrowser') {
                var browserData = window.curWidget.id;
                if(paramData) {
                    browserData += '|?|' + paramData[paramDataKeys[0]];
                }

                /*jshint undef: false */
                var browserWidgetEvent = new WidgetEvent(webbrowserType, browserData);
                sendWidgetEvent('', browserWidgetEvent, false);
            }
            else {
                var data = window.curWidget.id + '?' + encodeURIComponent(paramAppId) + '?' + '&toast_data=' + encodeURIComponent(JSON.stringify(paramData));

                /*jshint undef: false */
                var widgetEvent = new WidgetEvent(widgetType, data);
                sendWidgetEvent('', widgetEvent, false);
            }
            setTimeout(function() {
                success();
            }, 0);
        }
        catch (e) {
            var error = new Error(e.message);
            error.name = e.name;
            setTimeout(function() {
                fail(error);
            }, 0);
        }
    },
    getRequestedAppInfo: function (success, fail, args) {
        try {
            var originalData = window.location.search;
            var reqCallerAppId = parseAppData(originalData, '&callerid=');
            var reqData = parseAppData(originalData, '&toast_data=');

            var reqDataObj = JSON.parse((decodeURIComponent(reqData)));

            setTimeout(function() {
                success({callerAppId: decodeURIComponent(reqCallerAppId), data: reqDataObj});
            }, 0);
        }
        catch (e) {
            var error = new Error(e.message);
            error.name = e.name;
            setTimeout(function() {
                fail(error);
            }, 0);
        }

        function parseAppData(originalData, searchData) {
            var str = originalData.substring(originalData.indexOf(searchData) + 1);
            return str.substring(str.indexOf('=') + 1, str.indexOf('&'));
        }
    }
};

require('cordova/exec/proxy').add('toast.application',module.exports);

});

// file: src/sectv-orsay/mediaProxy.js
define('cordova-plugin-toast.mediaProxy', function(require, exports, module) {


'use strict';

var Media = require('cordova-plugin-toast.Media');
var SEF = require('cordova/plugin/SEF');
var Util = require('cordova-plugin-toast.util');
var Urlutil = require('cordova/urlutil');

var containerElem = null;
var subtitleInfoObj= null;

function createVideoContainer(id) {
    function setContainerStyleEventListener(elem,callback) {
        var containerObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(e) {
                callback.call(e.target, e.attributeName);
            });
        });

        containerObserver.observe(elem, {
            childList: false,
            subtree: false,
            attributes: true
        });
    }

    function setContainerAppendEventListener(callback) {
        var bodyObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(e) {
                callback.call(e.target, e);
            });
        });
        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    containerElem = document.createElement('div');
    containerElem.style.left = '0px';
    containerElem.style.top = '0px';
    containerElem.style.width = '0px';
    containerElem.style.height = '0px';
    containerElem.innerHTML = '<OBJECT classid="clsid:SAMSUNG-INFOLINK-SEF" style="display:block;position:absolute;width:0px;height:0px;"></OBJECT>';
    Media.mediaEvent(id,getMediaEventValue(Media._MEDIA_CONTAINER,containerElem));

    if(window.MutationObserver) {
        setContainerStyleEventListener(containerElem,containerStyleEventCallback);
        setContainerAppendEventListener(containerAppendEventCallback);
    }
    else {
        document.documentElement.addEventListener('DOMNodeInserted',function(ev) {
            if(containerElem === ev.target || Util.isChildOf(containerElem,ev.target)) {
                console.log('media::container append');
                synchronizeVideoRect();
            }
        });
    }
}

var containerStylecallbackFnTimer = null;
function containerStyleEventCallback(MutationRecordProperty) {
    if(containerStylecallbackFnTimer) {
        clearTimeout(containerStylecallbackFnTimer);
    }

    containerStylecallbackFnTimer = setTimeout(function() {
        if (MutationRecordProperty == 'style' && containerElem.childNodes[0]) {
            console.log('media::container style changed');
            synchronizeVideoRect();
        }
    },0);
}

var containerAppendcallbackFnTimer = null;
function containerAppendEventCallback(MutationRecordProperty) {
    if(containerAppendcallbackFnTimer) {
        clearTimeout(containerAppendcallbackFnTimer);
    }

    containerAppendcallbackFnTimer = setTimeout(function() {
        if (MutationRecordProperty.addedNodes.length > 0) {
            if(hasContainerElem(MutationRecordProperty.addedNodes) && containerElem.childNodes[0]) {
                console.log('media::container append');
                synchronizeVideoRect();
            }
        }
    },0);
}

function hasContainerElem(nodes) {
    for(var i = 0; i < nodes.length; i++) {
        if(containerElem === nodes[i] || Util.isChildOf(containerElem,nodes[i])) {
            return true;
        }
    }
    return false;
}

function synchronizeVideoRect () {
    var boundingRect = Util.getBoundingRect(containerElem);
    console.log('media:: DisplayRect left = '+boundingRect.left + ' | top = ' + boundingRect.top + ' | width = ' + boundingRect.width + ' | height = ' + boundingRect.height);

    //sectv-orsay needs a style update when append to DOM tree.
    containerElem.childNodes[0].style.width = boundingRect.width + 'px';
    containerElem.childNodes[0].style.height = boundingRect.height + 'px';
    setAvplayVideoRect(boundingRect);
}

function getFitDisplayRect(rect,videoResolution) {
    var FRAME_LEFT = rect.left,
        FRAME_TOP = rect.top,
        FRAME_WIDTH = rect.width,
        FRAME_HEIGHT = rect.height,
        nLeft,
        nTop,
        nWidth,
        nHeight,
        fnRound = Math.round;

    if(videoResolution.width && videoResolution.width > 0 && videoResolution.height && videoResolution.height > 0) {
        if (videoResolution.width / videoResolution.height > FRAME_WIDTH / FRAME_HEIGHT) {
            nHeight = fnRound((FRAME_WIDTH * videoResolution.height) / videoResolution.width);
            nWidth = FRAME_WIDTH;
        }
        else {
            nWidth = fnRound((FRAME_HEIGHT * videoResolution.width) / videoResolution.height);
            nHeight = FRAME_HEIGHT;
        }

        nLeft = FRAME_LEFT + fnRound((FRAME_WIDTH - nWidth) / 2);
        nTop = FRAME_TOP + fnRound((FRAME_HEIGHT - nHeight) / 2);
    }
    else {
        nLeft = FRAME_LEFT;
        nTop = FRAME_TOP;
        nWidth = videoResolution.width;
        nHeight = videoResolution.height;
    }
    console.log('media:: fitDisplayRect left = '+nLeft + ' | top = ' + nTop + ' | width = ' + nWidth + ' | height = ' + nHeight);

    return {
        'left': nLeft,
        'top': nTop,
        'width': nWidth,
        'height': nHeight
    };
}

function getVideoResolution() {
    var reval = mediaObjects[currentMediaInfo.id].Execute('GetVideoResolution');
    var videoWidth = 0;
    var videoHeight = 0;
    console.log('media:: videoResolution = '+reval);
    if (typeof reval == 'string') {
        reval = reval.split('|');
        videoWidth = reval[0];
        videoHeight = reval[1];
    }
    return {
        'width': Number(videoWidth),
        'height': Number(videoHeight)
    };
}

function setAvplayVideoRect(rect) {
    var videoResolution = getVideoResolution();
    var FitRect = getFitDisplayRect(rect,videoResolution);

    try {
        if(mediaObjects[currentMediaInfo.id]) {
            mediaObjects[currentMediaInfo.id].Execute('SetDisplayArea',Number(FitRect.left),Number(FitRect.top),Number(FitRect.width),Number(FitRect.height),curWidget.height);
        }
    }
    catch (e) {
        console.log('[Warning]Fail to setDisplayRect' + e);
    }
}

function getMediaEventValue (type,data) {
    var reval = {};
    switch(type) {
    case Media.EVENT_STATE :
        reval = {
            'type': type,
            'data': {
                'state': data,
                'oldState': currentMediaInfo.state
            }
        };
        currentMediaInfo.state = data;
        break;
    case Media.EVENT_DURATION :
        reval = {
            'type': type,
            'data': {
                'duration': data
            }
        };
        break;
    case Media.EVENT_POSITION :
        reval = {
            'type': type,
            'data': {
                'position': data
            }
        };
        break;
    case Media.EVENT_BUFFERINGPROGRESS :
        reval = {
            'type': type,
            'data': {
                'bufferingPercentage': data
            }
        };
        break;
    case Media.EVENT_SUBTITLE :
        reval = {
            'type': type,
            'data': {
                'text': data
            }
        };
        break;
    case Media.EVENT_ENDED :
        reval = {
            'type': type,
            'data': {}
        };
        break;
    case Media._MEDIA_CONTAINER :
        reval = {
            'type': type,
            'data': {
                'containerElem': data
            }
        };
        break;
    case Media._MEDIA_ERROR :
        reval = {
            'type': type,
            'data': data
        };
        break;
    }
    return reval;
}

var mediaObjects = {
    //Error
    CONNECTION_FAILED: 1,
    AUTHENTICATION_FAILED: 2,
    STREAM_NOT_FOUND: 3,
    NETWORK_DISCONNECTED: 4,
    NETWORK_SLOW: 5,
    RENDER_ERROR: 6,
    RENDERING_START: 7,

    STREAM_COMPLETED: 8,
    LOADED_METADATA: 9,
    BUFFERING_START: 11,
    BUFFERING_COMPLETE: 12,
    BUFFERING_PROGRESS: 13,
    CURRENT_PLAYTIME: 14,
    SUBTITLE: 19
};

function mediaEventListener(type,data1,data2) {
    console.log('media::mediaEventListener: ('+type+','+data1+','+data2+')');
    switch(type) {
    case mediaObjects.LOADED_METADATA :
        var duration = mediaObjects[currentMediaInfo.id].Execute('GetDuration');
        currentMediaInfo.duration = duration;
        Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media.EVENT_DURATION,Number(duration)));
        synchronizeVideoRect();
        if(subtitleInfoObj && subtitleInfoObj.url) {
            var retValue = mediaObjects[currentMediaInfo.id].Execute('StartSubtitle',subtitleInfoObj.url);
            if ( retValue < 1 ) {
                console.log('[Warning] Failed to Subtitle setting');
            }
            else {
                var subtitleStreamType = 5,
                    reval = 0,
                    index = 0;

                mediaObjects[currentMediaInfo.id].subtitleLanguageObj = {};

                while(reval != -1) {
                    reval = mediaObjects[currentMediaInfo.id].Execute('GetStreamLanguageInfo', subtitleStreamType, index); //-1: fail
                    if(reval != -1) {
                        mediaObjects[currentMediaInfo.id].subtitleLanguageObj[getLanguageStr(reval)] = index;
                        index++;
                    }
                }
                mediaObjects[currentMediaInfo.id].Execute('SetStreamID', subtitleStreamType, 0);
                mediaObjects[currentMediaInfo.id].Execute('SetSubtitleSync', 0);
            }
        }
        break;
    case mediaObjects.BUFFERING_START :
        console.log('media::onStalled()');
        currentMediaInfo.oldState = currentMediaInfo.state;
        Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media.EVENT_STATE,Media.STATE_STALLED));
        break;
    case mediaObjects.BUFFERING_PROGRESS :
        console.log('media::Buffering progress data: ' + data1);
        Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media.EVENT_BUFFERINGPROGRESS,Number(data1)));
        break;
    case mediaObjects.BUFFERING_COMPLETE :
        if(currentMediaInfo.oldState == Media.STATE_PLAYING) {
            Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media.EVENT_STATE,Media.STATE_PLAYING));
        }
        else if(currentMediaInfo.oldState == Media.STATE_PAUSED) {
            Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media.EVENT_STATE,Media.STATE_PAUSED));
        }
        currentMediaInfo.oldState = currentMediaInfo.state;
        console.log('media::Buffering complete.');
        break;
    case mediaObjects.RENDERING_START :
        console.log('media::Rendering start');
        Media.mediaEvent(currentMediaInfo.id, getMediaEventValue(Media.EVENT_STATE, Media.STATE_PLAYING));
        break;
    case mediaObjects.STREAM_COMPLETED :
        console.log('media::streamcompleted()');
        Media.mediaEvent(currentMediaInfo.id, getMediaEventValue(Media.EVENT_ENDED));
        break;
    case mediaObjects.CURRENT_PLAYTIME :
        console.log('media::Current playtime: ' + data1);
        if(currentMediaInfo.state !== Media.STATE_IDLE) {
            currentMediaInfo.position = data1;
            Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media.EVENT_POSITION,Number(data1)));
        }
        break;
    case mediaObjects.SUBTITLE :
        console.log('media::Subtitle Changed.');
        Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media.EVENT_SUBTITLE,data1));
        break;
    case mediaObjects.CONNECTION_FAILED :
        console.log('media::Event type error: ' + data1);
        Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media._MEDIA_ERROR,data1));
        break;
    case mediaObjects.AUTHENTICATION_FAILED :
        console.log('media::Event type error: ' + data1);
        Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media._MEDIA_ERROR,data1));
        break;
    case mediaObjects.STREAM_NOT_FOUND :
        console.log('media::Event type error: ' + data1);
        Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media._MEDIA_ERROR,data1));
        break;
    case mediaObjects.NETWORK_DISCONNECTED :
        console.log('media::Event type error: ' + data1);
        Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media._MEDIA_ERROR,data1));
        break;
    case mediaObjects.NETWORK_SLOW :
        console.log('media::Event type error: ' + data1);
        Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media._MEDIA_ERROR,data1));
        break;
    case mediaObjects.RENDER_ERROR :
        console.log('media::Event type error: ' + data1);
        Media.mediaEvent(currentMediaInfo.id,getMediaEventValue(Media._MEDIA_ERROR,data1));
        break;
    }
}

var currentMediaInfo = {};
var MediaSource = 43;
var SEFDownLoad = null;
function createSEF(id) {
    var SEFWindow = SEF.get('Window');
    if(SEFWindow.Execute('GetSource') != MediaSource) {
        SEFWindow.Execute('SetSource',MediaSource);
    }
    mediaObjects[id] = SEF.get('Player');
    mediaObjects[id].OnEvent = function (type,data1,data2) {
        mediaEventListener(type,data1,data2);
    };
}

function setScreenSaver (state) {
    var SEFNNavi = SEF.get('NNavi');
    var SEFTVMW = SEF.get('TVMW');
    var PL_PRFID_AUTO_PROTECTION_TIME = 13;
    var SCREEN_SAVER_ON = 3;
    var SCREEN_SAVER_OFF = 4;
    var protectionTime = {
        0: 300, //PROFILE_DURATION_5MIN
        1: 600, //PROFILE_DURATION_10MIN
        2: 1200, //PROFILE_DURATION_20MIN
        3: 1800, //PROFILE_DURATION_30MIN
        4: 2400, //PROFILE_DURATION_40MIN
        5: 3600, //PROFILE_DURATION_1HOUR
        6: 7200, //PROFILE_DURATION_2HOUR
        7: 14400, //PROFILE_DURATION_4HOUR
        8: 28800, //PROFILE_DURATION_8HOUR
        9: 36000, //PROFILE_DURATION_10HOUR
        10: -1 //PROFILE_DURATION_ALWAYS
    };
    var reval = 0;

    var pf = SEFTVMW.Execute('GetProfile',PL_PRFID_AUTO_PROTECTION_TIME);
    console.log('media:: AUTO_PROTECTION_TIME : '+ pf);
    if (state.toLowerCase() === 'on') {
        if ( protectionTime && protectionTime.hasOwnProperty(parseInt(pf)) ) {
            if(protectionTime[parseInt(pf)] > 0) {
                reval = SEFNNavi.Execute('SendEventToDevice',SCREEN_SAVER_ON,protectionTime[parseInt(pf)]);
                if(reval > 0) {
                    console.log('media:: success to screenSaver ON');
                }
                else {
                    console.log('media:: fail to screenSaver ON');
                }
            }
        }
        else {
            reval = SEFNNavi.Execute('SendEventToDevice',SCREEN_SAVER_ON,7200); // default 2 hour
            if(reval > 0) {
                console.log('media:: success to screenSaver ON');
            }
            else {
                console.log('media:: fail to screenSaver ON');
            }
        }
    }
    else if (state.toLowerCase() === 'off') {
        reval = SEFNNavi.Execute('SendEventToDevice',SCREEN_SAVER_OFF,0);
        if(reval > 0) {
            console.log('media:: success to screenSaver OFF');
        }
        else {
            console.log('media:: fail to screenSaver OFF');
        }
    }
}

function getSubtitleExtension(url) {
    var extension = null;
    extension = url.match(/(\.\w+$)/igm,'');
    return extension ? extension : '.smi';
}

function getLanguageStr(num) {
    /*
    streamLanguageStr = {
        7040882 : 'kor',
        6647399 : 'eng',
        7565409 : 'spa',
        6713957 : 'fre',
        6975598 : 'jpn',
        6514793 : 'chi',
        6776178 : 'ger',
        6911073 : 'ita',
        7501171 : 'rus',
        7368562 : 'por',
    }
    */

    var nHex = num.toString(16);

    var sHex1 = '0x'+nHex.substr(0,2);
    var sHex2 = '0x'+nHex.substr(2,2);

    var str1 = String.fromCharCode(sHex1);
    var str2 = String.fromCharCode(sHex2);

    var str = str1 + str2;

    return str;
}

module.exports = {
    create: function(successCallback, errorCallback, args) {
        var id = args[0];
        console.log('media::create() - id =' + id);
        createSEF(id);
        currentMediaInfo = {};
        currentMediaInfo.id = id;
        createVideoContainer(id);
    },

    open: function(successCallback, errorCallback, args) {
        var id = args[0],
            src = args[1],
            absoluteUrl = Urlutil.makeAbsolute(args[1]);

        if(!Util.isRemoteUrl(absoluteUrl)) {
            src = absoluteUrl.replace(/^file:\/\//,'');
        }

        if(currentMediaInfo.state && currentMediaInfo.state !== Media.STATE_IDLE) {
            mediaObjects[id].Execute('Stop');
        }

        console.log('media::open() - id =' + id + ' src = '+src);

        if(mediaObjects[id]) {
            currentMediaInfo.id = id;
            currentMediaInfo.src = src;
            currentMediaInfo.position = 0;
            currentMediaInfo.duration = -1;
            currentMediaInfo.state = null;
            currentMediaInfo.oldState = null;
            console.log('currentMediaInfo.oldState '+currentMediaInfo.oldState);
            Media.mediaEvent(id, getMediaEventValue(Media.EVENT_STATE, Media.STATE_IDLE));
        }
        else {
            throw new Error('Fail to Media open');
        }
    },

    // play
    play: function(successCallback, errorCallback, args) {
        var id = args[0];
        var reval = 0;
        console.log('media::play() - id =' + id);
        if(currentMediaInfo.state == Media.STATE_IDLE) {
            if(subtitleInfoObj && subtitleInfoObj.isRemoteUrl) {
                SEFDownLoad.OnEvent = function (type,data1,data2) {
                    _downloadCallback(type,data1,data2);
                };
                var extension = getSubtitleExtension(subtitleInfoObj.url);

                SEFDownLoad.Execute('StartDownFile', subtitleInfoObj.url, '$TEMP/TOAST_MediaSubtitle'+extension);

                var _downloadCallback = function(type, param1, param2) {
                    console.log('[Subtitle] _downloadCallback('+type+','+param1+','+param2+')');
                    var aResult = param1.split('?');
                    switch (aResult[0]) {
                        case '1000': // download is complete
                            if (aResult[1] == 1) { // success
                                console.log('download success!!');
                                subtitleInfoObj.url = '$TEMP/TOAST_MediaSubtitle'+extension;
                                playMedia();
                            }
                            else { // fail
                                console.log('[Warning] Failed to download Subtitle');
                                playMedia();
                            }
                            break;
                        default:
                            break;
                    }
                };
            }
            else {
                playMedia();
            }
        }
        else {
            reval = mediaObjects[id].Execute('Resume');
        }

        function playMedia() {
            reval = mediaObjects[id].Execute('InitPlayer',currentMediaInfo.src);
            reval += mediaObjects[id].Execute('StartPlayback',currentMediaInfo.position);
            if(reval > 0) {
                console.log('Success to Media play');
                setScreenSaver('off');
            }
            else {
                throw new Error('Fail to Media play');
            }
        }
    },

    // Stops the playing media
    stop: function(successCallback, errorCallback, args) {
        var id = args[0];
        var reval = 0;
        console.log('media::stop() - MEDIA_STATE -> IDLE');

        currentMediaInfo.position = 0;
        subtitleInfoObj = null;
        if(mediaObjects[id].hasOwnProperty('subtitleLanguageObj')) {
            delete mediaObjects[currentMediaInfo.id].subtitleLanguageObj;
        }
        reval = mediaObjects[id].Execute('Stop');

        if(reval > 0) {
            currentMediaInfo.oldState = currentMediaInfo.state;
            Media.mediaEvent(id, getMediaEventValue(Media.EVENT_STATE, Media.STATE_IDLE));
            successCallback();
            setScreenSaver('on');
        }
        else {
            throw new Error('Fail to Media stop');
        }
    },

    // Seeks to the position in the media
    seekTo: function(successCallback, errorCallback, args) {
        var id = args[0],
            milliseconds = args[1],
            reval = 0,
            offset;
        console.log('media::seekTo()');

        if(currentMediaInfo.state == Media.STATE_IDLE) {
            currentMediaInfo.position = milliseconds;
        }
        else if(currentMediaInfo.state == Media.STATE_PLAYING || currentMediaInfo.state == Media.STATE_PAUSED) {
            if(milliseconds > (currentMediaInfo.duration-2000)) {
                throw new Error('The seekTo time is too close duration');
            }
            else {
                offset = milliseconds - currentMediaInfo.position;
                if(offset > 0 ) {
                    offset = parseInt(offset / 1000);
                    reval = mediaObjects[id].Execute('JumpForward',offset);
                }
                else {
                    offset = parseInt((offset * -1) / 1000);
                    reval = mediaObjects[id].Execute('JumpBackward',offset);
                }

                if(reval > 0) {
                    console.log('Sucess to Media SeekTo ' + milliseconds);
                }
                else {
                    throw new Error('Fail to Media seekTo');
                }
            }
        }
    },

    // Pauses the playing media
    pause: function(successCallback, errorCallback, args) {
        var id = args[0];
        var reval = 0;
        console.log('media::pause() - MEDIA_STATE -> PAUSED');
        reval = mediaObjects[id].Execute('Pause');

        if(reval > 0) {
            currentMediaInfo.oldState = currentMediaInfo.state;
            Media.mediaEvent(id, getMediaEventValue(Media.EVENT_STATE, Media.STATE_PAUSED));
            setScreenSaver('on');
        }
        else {
            throw new Error('Fail to Media pause');
        }
    },

    setStreamingProperty: function(successCallback, errorCallback, args) {
        var id = currentMediaInfo.id,
            reval = 0;

        console.log('media::setStreamingProperty() - '+args);

        reval = mediaObjects[id].Execute.apply(mediaObjects[id],args);

        if(reval > 0) {
            console.log('Success to Media setStreamingProperty');
        }
        else {
            throw new Error('Fail to Media setStreamingProperty');
        }
    },

    setDrm: function(successCallback, errorCallback, args) {
        var id = currentMediaInfo.id,
            reval = 0;

        console.log('media::setDrm() - '+args);

        reval = mediaObjects[id].Execute.apply(mediaObjects[id],args);

        if(reval > 0) {
            console.log('Success to Media setDrm');
        }
        else {
            throw new Error('Fail to Media setDrm');
        }
    },

    syncVideoRect: function(successCallback, errorCallback, args) {
        console.log('media::syncVideoRect');
        synchronizeVideoRect();
    },

    setSubtitlePath: function(successCallback, errorCallback, args) {
        console.log('media::setSubtitle()');
        var path = args[1],
            absoluteUrl = Urlutil.makeAbsolute(args[1]);

        subtitleInfoObj = {};

        if(path && typeof path == 'string') {
            if(!Util.isRemoteUrl(absoluteUrl)) {
                subtitleInfoObj.isRemoteUrl = false;
                subtitleInfoObj.url = absoluteUrl.replace(/^file:\/\//,'');
            }
            else {
                subtitleInfoObj.isRemoteUrl = true;
                subtitleInfoObj.url = absoluteUrl;
                if(SEFDownLoad === null) {
                    SEFDownLoad=SEF.get('Download');
                }
            }

        }
        else {
            console.log('[Warning] Subtitle path is not valid.');
        }
    },

    getSubtitleLanguageList: function(successCallback, errorCallback, args) {
        console.log('media::getSubtitleLanguageList()');
        var id = args[0],
            subtitleLanguageArr = [];

        if(mediaObjects[id].hasOwnProperty('subtitleLanguageObj')) {
            for(var key in mediaObjects[id].subtitleLanguageObj) {
                subtitleLanguageArr.push(key);
            }
        }

        if(subtitleLanguageArr.length !== 0 ) {
            setTimeout(function() {
                successCallback(subtitleLanguageArr);
            },0);
        }
        else {
            subtitleLanguageArr = null;
            errorCallback(new Error('Fail to get subtitle language information'));
        }
    },

    setSubtitleLanguage: function(successCallback, errorCallback, args) {
        console.log('media::setSubtitleLanguage()');
        var id = args[0],
            lang = args[1].toLowerCase(),
            reval = 0,
            subtitleStreamType = 5;

        if(mediaObjects[id].hasOwnProperty('subtitleLanguageObj') && mediaObjects[id].subtitleLanguageObj.hasOwnProperty(lang)) {
            reval = mediaObjects[id].Execute('SetStreamID', subtitleStreamType, mediaObjects[id].subtitleLanguageObj[lang]);
            if(reval > 0) {
                console.log('Success to setSubtitleLanguage');
            }
            else {
                throw new Error('Fail to Media setSubtitleLanguage');
            }
        }
        else {
            throw new Error('Subtitle is not support this language.');
        }
    },

    setSubtitleSync: function(successCallback, errorCallback, args) {
        console.log('media::setSubtitleSync()');
        var id = args[0],
            milliseconds = args[1],
            reval = 0;
        reval = mediaObjects[id].Execute('SetSubtitleSync', milliseconds/100); //orsay platform has bug about time unit converting
        if(reval > 0) {
            console.log('Success to setSubtitleSync');
        }
        else {
            throw new Error('Fail to Media setSubtitleSync');
        }
    }
};

require('cordova/exec/proxy').add('toast.Media',module.exports);

});

// file: src/sectv-orsay/MediaPluginWideVine.js
define('cordova-plugin-toast.MediaPluginWideVine', function(require, exports, module) {


'use strict';

var MediaPlugin = require('cordova-plugin-toast.MediaPlugin');

function MediaPluginWideVine () {
    MediaPlugin.apply(this, arguments);
    this.name = 'MediaPluginWideVine';
}

MediaPluginWideVine.prototype = new MediaPlugin();

function getOptionString(options) {
    var opts = [];
    for(var key in options) {
        opts.push(key + '=' + options[key]);
    }
    return opts.join('|');
}

MediaPluginWideVine.prototype.onAttachToMedia = function (media) {
    var tempSrc = media.src;
    var optionStr = getOptionString(this.options);
    media.registerHook('beforeopen', function (media, args) {
        media.src = media.src + '|COMPONENT=WV|' + optionStr;
    });
    media.registerHook('afterplay', function (media, args) {
        media.src = tempSrc;
    });
};

module.exports = MediaPluginWideVine;

});

// file: src/sectv-orsay/MediaPluginHLS.js
define('cordova-plugin-toast.MediaPluginHLS', function(require, exports, module) {


'use strict';

var MediaPlugin = require('cordova-plugin-toast.MediaPlugin');

function MediaPluginHLS () {
    MediaPlugin.apply(this, arguments);
    this.name = 'MediaPluginHLS';
}

MediaPluginHLS.prototype = new MediaPlugin();

function getOptionString(options) {
    var opts = [];
    for(var key in options) {
        opts.push(key + '=' + options[key]);
    }
    return opts.join('|');
}

MediaPluginHLS.prototype.onAttachToMedia = function (media) {
    var tempSrc = media.src;
    var optionStr = getOptionString(this.options);
    media.registerHook('beforeopen', function (media, args) {
        media.src = media.src + '|COMPONENT=HLS|' + optionStr;
    });
    media.registerHook('afterplay', function (media, args) {
        media.src = tempSrc;
    });
};

module.exports = MediaPluginHLS;

});

// file: src/sectv-orsay/MediaPluginUHD.js
define('cordova-plugin-toast.MediaPluginUHD', function(require, exports, module) {


'use strict';

var exec = require('cordova/exec'),
    MediaPlugin = require('cordova-plugin-toast.MediaPlugin'),
    SEF = require('cordova/plugin/SEF');

function MediaPluginUHD () {
    var TVPlugin = SEF.get('TV');
    var panelResolution = JSON.parse(TVPlugin.Execute('GetPanelResolution'));
    if(Number(panelResolution.vertical) >= 2160) {
        MediaPlugin.apply(this, arguments);
        this.name = 'MediaPluginUHD';
    }
    else {
        throw new Error('This device\'s screen is not suitable for UHD Contents playback.');
    }
}

MediaPluginUHD.prototype = new MediaPlugin();

MediaPluginUHD.prototype.onAttachToMedia = function (media) {
    media.registerHook('afterplay', function (media, args) {
        exec(null, null, 'toast.Media', 'setStreamingProperty', [
            'SetUHDResolution',true
        ]);
    });
};

module.exports = MediaPluginUHD;

});

// file: src/sectv-orsay/MediaPluginPlayReady.js
define('cordova-plugin-toast.MediaPluginPlayReady', function(require, exports, module) {


'use strict';

var exec = require('cordova/exec'),
    MediaPlugin = require('cordova-plugin-toast.MediaPlugin');

var PLAYREADY_CUSTOM_DATA = 3,
    PLAYREADY_LICENSE_SERVER = 4;

function MediaPluginPlayReady () {
    MediaPlugin.apply(this, arguments);
    this.name = 'MediaPluginPlayReady';
}

MediaPluginPlayReady.prototype = new MediaPlugin();

MediaPluginPlayReady.prototype.onAttachToMedia = function (media) {
    var me = this;
    if(this.options.CustomData) {
        media.registerHook('afterplay', function (media, args) {
            exec(null, null, 'toast.Media', 'setDrm', [
                'SetPlayerProperty',
                PLAYREADY_CUSTOM_DATA,
                me.options.CustomData,
                me.options.CustomData.length
            ]);
        });
    }

    if(this.options.LicenseServer) {
        media.registerHook('afterplay', function (media, args) {
            exec(null, null, 'toast.Media', 'setDrm', [
                'SetPlayerProperty',
                PLAYREADY_LICENSE_SERVER,
                me.options.LicenseServer,
                me.options.LicenseServer.length
            ]);
        });
    }
};

module.exports = MediaPluginPlayReady;

});

var moduleMapper = require('cordova/modulemapper');
moduleMapper.clobbers('cordova-plugin-toast.inputdevice', 'toast.inputdevice');
moduleMapper.clobbers('cordova-plugin-toast.tvchannel', 'toast.tvchannel');
moduleMapper.clobbers('cordova-plugin-toast.tvwindow', 'toast.tvwindow');
moduleMapper.clobbers('cordova-plugin-toast.tvaudiocontrol', 'toast.tvaudiocontrol');
moduleMapper.clobbers('cordova-plugin-toast.drminfo', 'toast.drminfo');
moduleMapper.clobbers('cordova-plugin-toast.application', 'toast.application');
moduleMapper.clobbers('cordova-plugin-toast.Media', 'toast.Media');
moduleMapper.clobbers('cordova-plugin-toast.MediaPlugin', 'toast.MediaPlugin');
moduleMapper.clobbers('cordova-plugin-toast.MediaPluginWideVine', 'toast.MediaPluginWideVine');
moduleMapper.clobbers('cordova-plugin-toast.MediaPluginHLS', 'toast.MediaPluginHLS');
moduleMapper.clobbers('cordova-plugin-toast.MediaPluginUHD', 'toast.MediaPluginUHD');
moduleMapper.clobbers('cordova-plugin-toast.MediaPluginPlayReady', 'toast.MediaPluginPlayReady');
moduleMapper.runs('cordova-plugin-toast.inputdeviceProxy');
moduleMapper.runs('cordova-plugin-toast.tvwindowProxy');
moduleMapper.runs('cordova-plugin-toast.tvchannelProxy');
moduleMapper.runs('cordova-plugin-toast.tvaudiocontrolProxy');
moduleMapper.runs('cordova-plugin-toast.drminfoProxy');
moduleMapper.runs('cordova-plugin-toast.applicationProxy');
moduleMapper.runs('cordova-plugin-toast.mediaProxy');
moduleMapper.mapModules(window);
window.toast.version = '1.2.0';
})();

