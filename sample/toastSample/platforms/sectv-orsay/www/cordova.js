// Platform: sectv-orsay
// ded62dda172755defaf75378ed007dc05730ec22
/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
*/
;(function() {
var PLATFORM_VERSION_BUILD_LABEL = '1.2.0';
// file: src/scripts/require.js

/*jshint -W079 */
/*jshint -W020 */

var require,
    define;

(function () {
    var modules = {},
    // Stack of moduleIds currently being built.
        requireStack = [],
    // Map of module ID -> index into requireStack of modules currently being built.
        inProgressModules = {},
        SEPARATOR = ".";



    function build(module) {
        var factory = module.factory,
            localRequire = function (id) {
                var resultantId = id;
                //Its a relative path, so lop off the last portion and add the id (minus "./")
                if (id.charAt(0) === ".") {
                    resultantId = module.id.slice(0, module.id.lastIndexOf(SEPARATOR)) + SEPARATOR + id.slice(2);
                }
                return require(resultantId);
            };
        module.exports = {};
        delete module.factory;
        factory(localRequire, module.exports, module);
        return module.exports;
    }

    require = function (id) {
        if (!modules[id]) {
            throw "module " + id + " not found";
        } else if (id in inProgressModules) {
            var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
            throw "Cycle in require graph: " + cycle;
        }
        if (modules[id].factory) {
            try {
                inProgressModules[id] = requireStack.length;
                requireStack.push(id);
                return build(modules[id]);
            } finally {
                delete inProgressModules[id];
                requireStack.pop();
            }
        }
        return modules[id].exports;
    };

    define = function (id, factory) {
        if (modules[id]) {
            throw "module " + id + " already defined";
        }

        modules[id] = {
            id: id,
            factory: factory
        };
    };

    define.remove = function (id) {
        delete modules[id];
    };

    define.moduleMap = modules;
})();

//Export for use in node
if (typeof module === "object" && typeof require === "function") {
    module.exports.require = require;
    module.exports.define = define;
}

// file: src/cordova.js
define("cordova", function(require, exports, module) {

// Workaround for Windows 10 in hosted environment case
// http://www.w3.org/html/wg/drafts/html/master/browsers.html#named-access-on-the-window-object
if (window.cordova && !(window.cordova instanceof HTMLElement)) {
    throw new Error("cordova already defined");
}


var channel = require('cordova/channel');
var platform = require('cordova/platform');


/**
 * Intercept calls to addEventListener + removeEventListener and handle deviceready,
 * resume, and pause events.
 */
var m_document_addEventListener = document.addEventListener;
var m_document_removeEventListener = document.removeEventListener;
var m_window_addEventListener = window.addEventListener;
var m_window_removeEventListener = window.removeEventListener;

/**
 * Houses custom event handlers to intercept on document + window event listeners.
 */
var documentEventHandlers = {},
    windowEventHandlers = {};

document.addEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    if (typeof documentEventHandlers[e] != 'undefined') {
        documentEventHandlers[e].subscribe(handler);
    } else {
        m_document_addEventListener.call(document, evt, handler, capture);
    }
};

window.addEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    if (typeof windowEventHandlers[e] != 'undefined') {
        windowEventHandlers[e].subscribe(handler);
    } else {
        m_window_addEventListener.call(window, evt, handler, capture);
    }
};

document.removeEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    // If unsubscribing from an event that is handled by a plugin
    if (typeof documentEventHandlers[e] != "undefined") {
        documentEventHandlers[e].unsubscribe(handler);
    } else {
        m_document_removeEventListener.call(document, evt, handler, capture);
    }
};

window.removeEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    // If unsubscribing from an event that is handled by a plugin
    if (typeof windowEventHandlers[e] != "undefined") {
        windowEventHandlers[e].unsubscribe(handler);
    } else {
        m_window_removeEventListener.call(window, evt, handler, capture);
    }
};

function createEvent(type, data) {
    var event = document.createEvent('Events');
    event.initEvent(type, false, false);
    if (data) {
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                event[i] = data[i];
            }
        }
    }
    return event;
}


var cordova = {
    define:define,
    require:require,
    version:PLATFORM_VERSION_BUILD_LABEL,
    platformVersion:PLATFORM_VERSION_BUILD_LABEL,
    platformId:platform.id,
    /**
     * Methods to add/remove your own addEventListener hijacking on document + window.
     */
    addWindowEventHandler:function(event) {
        return (windowEventHandlers[event] = channel.create(event));
    },
    addStickyDocumentEventHandler:function(event) {
        return (documentEventHandlers[event] = channel.createSticky(event));
    },
    addDocumentEventHandler:function(event) {
        return (documentEventHandlers[event] = channel.create(event));
    },
    removeWindowEventHandler:function(event) {
        delete windowEventHandlers[event];
    },
    removeDocumentEventHandler:function(event) {
        delete documentEventHandlers[event];
    },
    /**
     * Retrieve original event handlers that were replaced by Cordova
     *
     * @return object
     */
    getOriginalHandlers: function() {
        return {'document': {'addEventListener': m_document_addEventListener, 'removeEventListener': m_document_removeEventListener},
        'window': {'addEventListener': m_window_addEventListener, 'removeEventListener': m_window_removeEventListener}};
    },
    /**
     * Method to fire event from native code
     * bNoDetach is required for events which cause an exception which needs to be caught in native code
     */
    fireDocumentEvent: function(type, data, bNoDetach) {
        var evt = createEvent(type, data);
        if (typeof documentEventHandlers[type] != 'undefined') {
            if( bNoDetach ) {
                documentEventHandlers[type].fire(evt);
            }
            else {
                setTimeout(function() {
                    // Fire deviceready on listeners that were registered before cordova.js was loaded.
                    if (type == 'deviceready') {
                        document.dispatchEvent(evt);
                    }
                    documentEventHandlers[type].fire(evt);
                }, 0);
            }
        } else {
            document.dispatchEvent(evt);
        }
    },
    fireWindowEvent: function(type, data) {
        var evt = createEvent(type,data);
        if (typeof windowEventHandlers[type] != 'undefined') {
            setTimeout(function() {
                windowEventHandlers[type].fire(evt);
            }, 0);
        } else {
            window.dispatchEvent(evt);
        }
    },

    /**
     * Plugin callback mechanism.
     */
    // Randomize the starting callbackId to avoid collisions after refreshing or navigating.
    // This way, it's very unlikely that any new callback would get the same callbackId as an old callback.
    callbackId: Math.floor(Math.random() * 2000000000),
    callbacks:  {},
    callbackStatus: {
        NO_RESULT: 0,
        OK: 1,
        CLASS_NOT_FOUND_EXCEPTION: 2,
        ILLEGAL_ACCESS_EXCEPTION: 3,
        INSTANTIATION_EXCEPTION: 4,
        MALFORMED_URL_EXCEPTION: 5,
        IO_EXCEPTION: 6,
        INVALID_ACTION: 7,
        JSON_EXCEPTION: 8,
        ERROR: 9
    },

    /**
     * Called by native code when returning successful result from an action.
     */
    callbackSuccess: function(callbackId, args) {
        cordova.callbackFromNative(callbackId, true, args.status, [args.message], args.keepCallback);
    },

    /**
     * Called by native code when returning error result from an action.
     */
    callbackError: function(callbackId, args) {
        // TODO: Deprecate callbackSuccess and callbackError in favour of callbackFromNative.
        // Derive success from status.
        cordova.callbackFromNative(callbackId, false, args.status, [args.message], args.keepCallback);
    },

    /**
     * Called by native code when returning the result from an action.
     */
    callbackFromNative: function(callbackId, isSuccess, status, args, keepCallback) {
        try {
            var callback = cordova.callbacks[callbackId];
            if (callback) {
                if (isSuccess && status == cordova.callbackStatus.OK) {
                    callback.success && callback.success.apply(null, args);
                } else if (!isSuccess) {
                    callback.fail && callback.fail.apply(null, args);
                }
                /*
                else
                    Note, this case is intentionally not caught.
                    this can happen if isSuccess is true, but callbackStatus is NO_RESULT
                    which is used to remove a callback from the list without calling the callbacks
                    typically keepCallback is false in this case
                */
                // Clear callback if not expecting any more results
                if (!keepCallback) {
                    delete cordova.callbacks[callbackId];
                }
            }
        }
        catch (err) {
            var msg = "Error in " + (isSuccess ? "Success" : "Error") + " callbackId: " + callbackId + " : " + err;
            console && console.log && console.log(msg);
            cordova.fireWindowEvent("cordovacallbackerror", { 'message': msg });
            throw err;
        }
    },
    addConstructor: function(func) {
        channel.onCordovaReady.subscribe(function() {
            try {
                func();
            } catch(e) {
                console.log("Failed to run constructor: " + e);
            }
        });
    }
};


module.exports = cordova;

});

// file: src/common/argscheck.js
define("cordova/argscheck", function(require, exports, module) {

var utils = require('cordova/utils');

var moduleExports = module.exports;

var typeMap = {
    'A': 'Array',
    'D': 'Date',
    'N': 'Number',
    'S': 'String',
    'F': 'Function',
    'O': 'Object'
};

function extractParamName(callee, argIndex) {
    return (/.*?\((.*?)\)/).exec(callee)[1].split(', ')[argIndex];
}

function checkArgs(spec, functionName, args, opt_callee) {
    if (!moduleExports.enableChecks) {
        return;
    }
    var errMsg = null;
    var typeName;
    for (var i = 0; i < spec.length; ++i) {
        var c = spec.charAt(i),
            cUpper = c.toUpperCase(),
            arg = args[i];
        // Asterix means allow anything.
        if (c == '*') {
            continue;
        }
        typeName = utils.typeName(arg);
        if ((arg === null || arg === undefined) && c == cUpper) {
            continue;
        }
        if (typeName != typeMap[cUpper]) {
            errMsg = 'Expected ' + typeMap[cUpper];
            break;
        }
    }
    if (errMsg) {
        errMsg += ', but got ' + typeName + '.';
        errMsg = 'Wrong type for parameter "' + extractParamName(opt_callee || args.callee, i) + '" of ' + functionName + ': ' + errMsg;
        // Don't log when running unit tests.
        if (typeof jasmine == 'undefined') {
            console.error(errMsg);
        }
        throw TypeError(errMsg);
    }
}

function getValue(value, defaultValue) {
    return value === undefined ? defaultValue : value;
}

moduleExports.checkArgs = checkArgs;
moduleExports.getValue = getValue;
moduleExports.enableChecks = true;


});

// file: src/common/base64.js
define("cordova/base64", function(require, exports, module) {

var base64 = exports;

base64.fromArrayBuffer = function(arrayBuffer) {
    var array = new Uint8Array(arrayBuffer);
    return uint8ToBase64(array);
};

base64.toArrayBuffer = function(str) {
    var decodedStr = typeof atob != 'undefined' ? atob(str) : new Buffer(str,'base64').toString('binary');
    var arrayBuffer = new ArrayBuffer(decodedStr.length);
    var array = new Uint8Array(arrayBuffer);
    for (var i=0, len=decodedStr.length; i < len; i++) {
        array[i] = decodedStr.charCodeAt(i);
    }
    return arrayBuffer;
};

//------------------------------------------------------------------------------

/* This code is based on the performance tests at http://jsperf.com/b64tests
 * This 12-bit-at-a-time algorithm was the best performing version on all
 * platforms tested.
 */

var b64_6bit = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64_12bit;

var b64_12bitTable = function() {
    b64_12bit = [];
    for (var i=0; i<64; i++) {
        for (var j=0; j<64; j++) {
            b64_12bit[i*64+j] = b64_6bit[i] + b64_6bit[j];
        }
    }
    b64_12bitTable = function() { return b64_12bit; };
    return b64_12bit;
};

function uint8ToBase64(rawData) {
    var numBytes = rawData.byteLength;
    var output="";
    var segment;
    var table = b64_12bitTable();
    for (var i=0;i<numBytes-2;i+=3) {
        segment = (rawData[i] << 16) + (rawData[i+1] << 8) + rawData[i+2];
        output += table[segment >> 12];
        output += table[segment & 0xfff];
    }
    if (numBytes - i == 2) {
        segment = (rawData[i] << 16) + (rawData[i+1] << 8);
        output += table[segment >> 12];
        output += b64_6bit[(segment & 0xfff) >> 6];
        output += '=';
    } else if (numBytes - i == 1) {
        segment = (rawData[i] << 16);
        output += table[segment >> 12];
        output += '==';
    }
    return output;
}

});

// file: src/common/builder.js
define("cordova/builder", function(require, exports, module) {

var utils = require('cordova/utils');

function each(objects, func, context) {
    for (var prop in objects) {
        if (objects.hasOwnProperty(prop)) {
            func.apply(context, [objects[prop], prop]);
        }
    }
}

function clobber(obj, key, value) {
    exports.replaceHookForTesting(obj, key);
    var needsProperty = false;
    try {
        obj[key] = value;
    } catch (e) {
        needsProperty = true;
    }
    // Getters can only be overridden by getters.
    if (needsProperty || obj[key] !== value) {
        utils.defineGetter(obj, key, function() {
            return value;
        });
    }
}

function assignOrWrapInDeprecateGetter(obj, key, value, message) {
    if (message) {
        utils.defineGetter(obj, key, function() {
            console.log(message);
            delete obj[key];
            clobber(obj, key, value);
            return value;
        });
    } else {
        clobber(obj, key, value);
    }
}

function include(parent, objects, clobber, merge) {
    each(objects, function (obj, key) {
        try {
            var result = obj.path ? require(obj.path) : {};

            if (clobber) {
                // Clobber if it doesn't exist.
                if (typeof parent[key] === 'undefined') {
                    assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
                } else if (typeof obj.path !== 'undefined') {
                    // If merging, merge properties onto parent, otherwise, clobber.
                    if (merge) {
                        recursiveMerge(parent[key], result);
                    } else {
                        assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
                    }
                }
                result = parent[key];
            } else {
                // Overwrite if not currently defined.
                if (typeof parent[key] == 'undefined') {
                    assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
                } else {
                    // Set result to what already exists, so we can build children into it if they exist.
                    result = parent[key];
                }
            }

            if (obj.children) {
                include(result, obj.children, clobber, merge);
            }
        } catch(e) {
            utils.alert('Exception building Cordova JS globals: ' + e + ' for key "' + key + '"');
        }
    });
}

/**
 * Merge properties from one object onto another recursively.  Properties from
 * the src object will overwrite existing target property.
 *
 * @param target Object to merge properties into.
 * @param src Object to merge properties from.
 */
function recursiveMerge(target, src) {
    for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
            if (target.prototype && target.prototype.constructor === target) {
                // If the target object is a constructor override off prototype.
                clobber(target.prototype, prop, src[prop]);
            } else {
                if (typeof src[prop] === 'object' && typeof target[prop] === 'object') {
                    recursiveMerge(target[prop], src[prop]);
                } else {
                    clobber(target, prop, src[prop]);
                }
            }
        }
    }
}

exports.buildIntoButDoNotClobber = function(objects, target) {
    include(target, objects, false, false);
};
exports.buildIntoAndClobber = function(objects, target) {
    include(target, objects, true, false);
};
exports.buildIntoAndMerge = function(objects, target) {
    include(target, objects, true, true);
};
exports.recursiveMerge = recursiveMerge;
exports.assignOrWrapInDeprecateGetter = assignOrWrapInDeprecateGetter;
exports.replaceHookForTesting = function() {};

});

// file: src/common/channel.js
define("cordova/channel", function(require, exports, module) {

var utils = require('cordova/utils'),
    nextGuid = 1;

/**
 * Custom pub-sub "channel" that can have functions subscribed to it
 * This object is used to define and control firing of events for
 * cordova initialization, as well as for custom events thereafter.
 *
 * The order of events during page load and Cordova startup is as follows:
 *
 * onDOMContentLoaded*         Internal event that is received when the web page is loaded and parsed.
 * onNativeReady*              Internal event that indicates the Cordova native side is ready.
 * onCordovaReady*             Internal event fired when all Cordova JavaScript objects have been created.
 * onDeviceReady*              User event fired to indicate that Cordova is ready
 * onResume                    User event fired to indicate a start/resume lifecycle event
 * onPause                     User event fired to indicate a pause lifecycle event
 *
 * The events marked with an * are sticky. Once they have fired, they will stay in the fired state.
 * All listeners that subscribe after the event is fired will be executed right away.
 *
 * The only Cordova events that user code should register for are:
 *      deviceready           Cordova native code is initialized and Cordova APIs can be called from JavaScript
 *      pause                 App has moved to background
 *      resume                App has returned to foreground
 *
 * Listeners can be registered as:
 *      document.addEventListener("deviceready", myDeviceReadyListener, false);
 *      document.addEventListener("resume", myResumeListener, false);
 *      document.addEventListener("pause", myPauseListener, false);
 *
 * The DOM lifecycle events should be used for saving and restoring state
 *      window.onload
 *      window.onunload
 *
 */

/**
 * Channel
 * @constructor
 * @param type  String the channel name
 */
var Channel = function(type, sticky) {
    this.type = type;
    // Map of guid -> function.
    this.handlers = {};
    // 0 = Non-sticky, 1 = Sticky non-fired, 2 = Sticky fired.
    this.state = sticky ? 1 : 0;
    // Used in sticky mode to remember args passed to fire().
    this.fireArgs = null;
    // Used by onHasSubscribersChange to know if there are any listeners.
    this.numHandlers = 0;
    // Function that is called when the first listener is subscribed, or when
    // the last listener is unsubscribed.
    this.onHasSubscribersChange = null;
},
    channel = {
        /**
         * Calls the provided function only after all of the channels specified
         * have been fired. All channels must be sticky channels.
         */
        join: function(h, c) {
            var len = c.length,
                i = len,
                f = function() {
                    if (!(--i)) h();
                };
            for (var j=0; j<len; j++) {
                if (c[j].state === 0) {
                    throw Error('Can only use join with sticky channels.');
                }
                c[j].subscribe(f);
            }
            if (!len) h();
        },
        create: function(type) {
            return channel[type] = new Channel(type, false);
        },
        createSticky: function(type) {
            return channel[type] = new Channel(type, true);
        },

        /**
         * cordova Channels that must fire before "deviceready" is fired.
         */
        deviceReadyChannelsArray: [],
        deviceReadyChannelsMap: {},

        /**
         * Indicate that a feature needs to be initialized before it is ready to be used.
         * This holds up Cordova's "deviceready" event until the feature has been initialized
         * and Cordova.initComplete(feature) is called.
         *
         * @param feature {String}     The unique feature name
         */
        waitForInitialization: function(feature) {
            if (feature) {
                var c = channel[feature] || this.createSticky(feature);
                this.deviceReadyChannelsMap[feature] = c;
                this.deviceReadyChannelsArray.push(c);
            }
        },

        /**
         * Indicate that initialization code has completed and the feature is ready to be used.
         *
         * @param feature {String}     The unique feature name
         */
        initializationComplete: function(feature) {
            var c = this.deviceReadyChannelsMap[feature];
            if (c) {
                c.fire();
            }
        }
    };

function forceFunction(f) {
    if (typeof f != 'function') throw "Function required as first argument!";
}

/**
 * Subscribes the given function to the channel. Any time that
 * Channel.fire is called so too will the function.
 * Optionally specify an execution context for the function
 * and a guid that can be used to stop subscribing to the channel.
 * Returns the guid.
 */
Channel.prototype.subscribe = function(f, c) {
    // need a function to call
    forceFunction(f);
    if (this.state == 2) {
        f.apply(c || this, this.fireArgs);
        return;
    }

    var func = f,
        guid = f.observer_guid;
    if (typeof c == "object") { func = utils.close(c, f); }

    if (!guid) {
        // first time any channel has seen this subscriber
        guid = '' + nextGuid++;
    }
    func.observer_guid = guid;
    f.observer_guid = guid;

    // Don't add the same handler more than once.
    if (!this.handlers[guid]) {
        this.handlers[guid] = func;
        this.numHandlers++;
        if (this.numHandlers == 1) {
            this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
    }
};

/**
 * Unsubscribes the function with the given guid from the channel.
 */
Channel.prototype.unsubscribe = function(f) {
    // need a function to unsubscribe
    forceFunction(f);

    var guid = f.observer_guid,
        handler = this.handlers[guid];
    if (handler) {
        delete this.handlers[guid];
        this.numHandlers--;
        if (this.numHandlers === 0) {
            this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
    }
};

/**
 * Calls all functions subscribed to this channel.
 */
Channel.prototype.fire = function(e) {
    var fail = false,
        fireArgs = Array.prototype.slice.call(arguments);
    // Apply stickiness.
    if (this.state == 1) {
        this.state = 2;
        this.fireArgs = fireArgs;
    }
    if (this.numHandlers) {
        // Copy the values first so that it is safe to modify it from within
        // callbacks.
        var toCall = [];
        for (var item in this.handlers) {
            toCall.push(this.handlers[item]);
        }
        for (var i = 0; i < toCall.length; ++i) {
            toCall[i].apply(this, fireArgs);
        }
        if (this.state == 2 && this.numHandlers) {
            this.numHandlers = 0;
            this.handlers = {};
            this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
    }
};


// defining them here so they are ready super fast!
// DOM event that is received when the web page is loaded and parsed.
channel.createSticky('onDOMContentLoaded');

// Event to indicate the Cordova native side is ready.
channel.createSticky('onNativeReady');

// Event to indicate that all Cordova JavaScript objects have been created
// and it's time to run plugin constructors.
channel.createSticky('onCordovaReady');

// Event to indicate that all automatically loaded JS plugins are loaded and ready.
// FIXME remove this
channel.createSticky('onPluginsReady');

// Event to indicate that Cordova is ready
channel.createSticky('onDeviceReady');

// Event to indicate a resume lifecycle event
channel.create('onResume');

// Event to indicate a pause lifecycle event
channel.create('onPause');

// Channels that must fire before "deviceready" is fired.
channel.waitForInitialization('onCordovaReady');
channel.waitForInitialization('onDOMContentLoaded');

module.exports = channel;

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/exec.js
define("cordova/exec", function(require, exports, module) {

var cordova = require('cordova');
var execProxy = require('cordova/exec/proxy');

module.exports = function(success, fail, service, action, args) {

    var proxy = execProxy.get(service, action);

    if (proxy) {
        var callbackId = service + cordova.callbackId++;

        if (typeof success == 'function' || typeof fail == 'function') {
            cordova.callbacks[callbackId] = {success: success, fail: fail};
        }

        try {
            proxy(success, fail, args);
        }
        catch(e) {
            var msg = 'Exception calling :: ' + service + ' :: ' + action + ' ::exception=' + e;
            console.log(msg);
        }
    }
    else {
        fail && fail('Missing Command Error');
    }
};

});

// file: src/common/exec/proxy.js
define("cordova/exec/proxy", function(require, exports, module) {


// internal map of proxy function
var CommandProxyMap = {};

module.exports = {

    // example: cordova.commandProxy.add("Accelerometer",{getCurrentAcceleration: function(successCallback, errorCallback, options) {...},...);
    add:function(id,proxyObj) {
        console.log("adding proxy for " + id);
        CommandProxyMap[id] = proxyObj;
        return proxyObj;
    },

    // cordova.commandProxy.remove("Accelerometer");
    remove:function(id) {
        var proxy = CommandProxyMap[id];
        delete CommandProxyMap[id];
        CommandProxyMap[id] = null;
        return proxy;
    },

    get:function(service,action) {
        return ( CommandProxyMap[service] ? CommandProxyMap[service][action] : null );
    }
};
});

// file: src/common/init.js
define("cordova/init", function(require, exports, module) {

var channel = require('cordova/channel');
var cordova = require('cordova');
var modulemapper = require('cordova/modulemapper');
var platform = require('cordova/platform');
var pluginloader = require('cordova/pluginloader');
var utils = require('cordova/utils');

var platformInitChannelsArray = [channel.onNativeReady, channel.onPluginsReady];

function logUnfiredChannels(arr) {
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i].state != 2) {
            console.log('Channel not fired: ' + arr[i].type);
        }
    }
}

window.setTimeout(function() {
    if (channel.onDeviceReady.state != 2) {
        console.log('deviceready has not fired after 5 seconds.');
        logUnfiredChannels(platformInitChannelsArray);
        logUnfiredChannels(channel.deviceReadyChannelsArray);
    }
}, 5000);

// Replace navigator before any modules are required(), to ensure it happens as soon as possible.
// We replace it so that properties that can't be clobbered can instead be overridden.
function replaceNavigator(origNavigator) {
    var CordovaNavigator = function() {};
    CordovaNavigator.prototype = origNavigator;
    var newNavigator = new CordovaNavigator();
    // This work-around really only applies to new APIs that are newer than Function.bind.
    // Without it, APIs such as getGamepads() break.
    if (CordovaNavigator.bind) {
        for (var key in origNavigator) {
            if (typeof origNavigator[key] == 'function') {
                newNavigator[key] = origNavigator[key].bind(origNavigator);
            }
            else {
                (function(k) {
                    utils.defineGetterSetter(newNavigator,key,function() {
                        return origNavigator[k];
                    });
                })(key);
            }
        }
    }
    return newNavigator;
}

if (window.navigator) {
    window.navigator = replaceNavigator(window.navigator);
}

if (!window.console) {
    window.console = {
        log: function(){}
    };
}
if (!window.console.warn) {
    window.console.warn = function(msg) {
        this.log("warn: " + msg);
    };
}

// Register pause, resume and deviceready channels as events on document.
channel.onPause = cordova.addDocumentEventHandler('pause');
channel.onResume = cordova.addDocumentEventHandler('resume');
channel.onActivated = cordova.addDocumentEventHandler('activated');
channel.onDeviceReady = cordova.addStickyDocumentEventHandler('deviceready');

// Listen for DOMContentLoaded and notify our channel subscribers.
if (document.readyState == 'complete' || document.readyState == 'interactive') {
    channel.onDOMContentLoaded.fire();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        channel.onDOMContentLoaded.fire();
    }, false);
}

// _nativeReady is global variable that the native side can set
// to signify that the native code is ready. It is a global since
// it may be called before any cordova JS is ready.
if (window._nativeReady) {
    channel.onNativeReady.fire();
}

modulemapper.clobbers('cordova', 'cordova');
modulemapper.clobbers('cordova/exec', 'cordova.exec');
modulemapper.clobbers('cordova/exec', 'Cordova.exec');

// Call the platform-specific initialization.
platform.bootstrap && platform.bootstrap();

// Wrap in a setTimeout to support the use-case of having plugin JS appended to cordova.js.
// The delay allows the attached modules to be defined before the plugin loader looks for them.
setTimeout(function() {
    pluginloader.load(function() {
        channel.onPluginsReady.fire();
    });
}, 0);

/**
 * Create all cordova objects once native side is ready.
 */
channel.join(function() {
    modulemapper.mapModules(window);

    platform.initialize && platform.initialize();

    // Fire event to notify that all objects are created
    channel.onCordovaReady.fire();

    // Fire onDeviceReady event once page has fully loaded, all
    // constructors have run and cordova info has been received from native
    // side.
    channel.join(function() {
        require('cordova').fireDocumentEvent('deviceready');
    }, channel.deviceReadyChannelsArray);

}, platformInitChannelsArray);


});

// file: src/common/init_b.js
define("cordova/init_b", function(require, exports, module) {

var channel = require('cordova/channel');
var cordova = require('cordova');
var modulemapper = require('cordova/modulemapper');
var platform = require('cordova/platform');
var pluginloader = require('cordova/pluginloader');
var utils = require('cordova/utils');

var platformInitChannelsArray = [channel.onDOMContentLoaded, channel.onNativeReady, channel.onPluginsReady];

// setting exec
cordova.exec = require('cordova/exec');

function logUnfiredChannels(arr) {
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i].state != 2) {
            console.log('Channel not fired: ' + arr[i].type);
        }
    }
}

window.setTimeout(function() {
    if (channel.onDeviceReady.state != 2) {
        console.log('deviceready has not fired after 5 seconds.');
        logUnfiredChannels(platformInitChannelsArray);
        logUnfiredChannels(channel.deviceReadyChannelsArray);
    }
}, 5000);

// Replace navigator before any modules are required(), to ensure it happens as soon as possible.
// We replace it so that properties that can't be clobbered can instead be overridden.
function replaceNavigator(origNavigator) {
    var CordovaNavigator = function() {};
    CordovaNavigator.prototype = origNavigator;
    var newNavigator = new CordovaNavigator();
    // This work-around really only applies to new APIs that are newer than Function.bind.
    // Without it, APIs such as getGamepads() break.
    if (CordovaNavigator.bind) {
        for (var key in origNavigator) {
            if (typeof origNavigator[key] == 'function') {
                newNavigator[key] = origNavigator[key].bind(origNavigator);
            }
            else {
                (function(k) {
                    utils.defineGetterSetter(newNavigator,key,function() {
                        return origNavigator[k];
                    });
                })(key);
            }
        }
    }
    return newNavigator;
}
if (window.navigator) {
    window.navigator = replaceNavigator(window.navigator);
}

if (!window.console) {
    window.console = {
        log: function(){}
    };
}
if (!window.console.warn) {
    window.console.warn = function(msg) {
        this.log("warn: " + msg);
    };
}

// Register pause, resume and deviceready channels as events on document.
channel.onPause = cordova.addDocumentEventHandler('pause');
channel.onResume = cordova.addDocumentEventHandler('resume');
channel.onActivated = cordova.addDocumentEventHandler('activated');
channel.onDeviceReady = cordova.addStickyDocumentEventHandler('deviceready');

// Listen for DOMContentLoaded and notify our channel subscribers.
if (document.readyState == 'complete' || document.readyState == 'interactive') {
    channel.onDOMContentLoaded.fire();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        channel.onDOMContentLoaded.fire();
    }, false);
}

// _nativeReady is global variable that the native side can set
// to signify that the native code is ready. It is a global since
// it may be called before any cordova JS is ready.
if (window._nativeReady) {
    channel.onNativeReady.fire();
}

// Call the platform-specific initialization.
platform.bootstrap && platform.bootstrap();

// Wrap in a setTimeout to support the use-case of having plugin JS appended to cordova.js.
// The delay allows the attached modules to be defined before the plugin loader looks for them.
setTimeout(function() {
    pluginloader.load(function() {
        channel.onPluginsReady.fire();
    });
}, 0);

/**
 * Create all cordova objects once native side is ready.
 */
channel.join(function() {
    modulemapper.mapModules(window);

    platform.initialize && platform.initialize();

    // Fire event to notify that all objects are created
    channel.onCordovaReady.fire();

    // Fire onDeviceReady event once page has fully loaded, all
    // constructors have run and cordova info has been received from native
    // side.
    channel.join(function() {
        require('cordova').fireDocumentEvent('deviceready');
    }, channel.deviceReadyChannelsArray);

}, platformInitChannelsArray);

});

// file: src/common/modulemapper.js
define("cordova/modulemapper", function(require, exports, module) {

var builder = require('cordova/builder'),
    moduleMap = define.moduleMap,
    symbolList,
    deprecationMap;

exports.reset = function() {
    symbolList = [];
    deprecationMap = {};
};

function addEntry(strategy, moduleName, symbolPath, opt_deprecationMessage) {
    if (!(moduleName in moduleMap)) {
        throw new Error('Module ' + moduleName + ' does not exist.');
    }
    symbolList.push(strategy, moduleName, symbolPath);
    if (opt_deprecationMessage) {
        deprecationMap[symbolPath] = opt_deprecationMessage;
    }
}

// Note: Android 2.3 does have Function.bind().
exports.clobbers = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('c', moduleName, symbolPath, opt_deprecationMessage);
};

exports.merges = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('m', moduleName, symbolPath, opt_deprecationMessage);
};

exports.defaults = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('d', moduleName, symbolPath, opt_deprecationMessage);
};

exports.runs = function(moduleName) {
    addEntry('r', moduleName, null);
};

function prepareNamespace(symbolPath, context) {
    if (!symbolPath) {
        return context;
    }
    var parts = symbolPath.split('.');
    var cur = context;
    for (var i = 0, part; part = parts[i]; ++i) {
        cur = cur[part] = cur[part] || {};
    }
    return cur;
}

exports.mapModules = function(context) {
    var origSymbols = {};
    context.CDV_origSymbols = origSymbols;
    for (var i = 0, len = symbolList.length; i < len; i += 3) {
        var strategy = symbolList[i];
        var moduleName = symbolList[i + 1];
        var module = require(moduleName);
        // <runs/>
        if (strategy == 'r') {
            continue;
        }
        var symbolPath = symbolList[i + 2];
        var lastDot = symbolPath.lastIndexOf('.');
        var namespace = symbolPath.substr(0, lastDot);
        var lastName = symbolPath.substr(lastDot + 1);

        var deprecationMsg = symbolPath in deprecationMap ? 'Access made to deprecated symbol: ' + symbolPath + '. ' + deprecationMsg : null;
        var parentObj = prepareNamespace(namespace, context);
        var target = parentObj[lastName];

        if (strategy == 'm' && target) {
            builder.recursiveMerge(target, module);
        } else if ((strategy == 'd' && !target) || (strategy != 'd')) {
            if (!(symbolPath in origSymbols)) {
                origSymbols[symbolPath] = target;
            }
            builder.assignOrWrapInDeprecateGetter(parentObj, lastName, module, deprecationMsg);
        }
    }
};

exports.getOriginalSymbol = function(context, symbolPath) {
    var origSymbols = context.CDV_origSymbols;
    if (origSymbols && (symbolPath in origSymbols)) {
        return origSymbols[symbolPath];
    }
    var parts = symbolPath.split('.');
    var obj = context;
    for (var i = 0; i < parts.length; ++i) {
        obj = obj && obj[parts[i]];
    }
    return obj;
};

exports.reset();


});

// file: src/common/modulemapper_b.js
define("cordova/modulemapper_b", function(require, exports, module) {

var builder = require('cordova/builder'),
    symbolList = [],
    deprecationMap;

exports.reset = function() {
    symbolList = [];
    deprecationMap = {};
};

function addEntry(strategy, moduleName, symbolPath, opt_deprecationMessage) {
    symbolList.push(strategy, moduleName, symbolPath);
    if (opt_deprecationMessage) {
        deprecationMap[symbolPath] = opt_deprecationMessage;
    }
}

// Note: Android 2.3 does have Function.bind().
exports.clobbers = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('c', moduleName, symbolPath, opt_deprecationMessage);
};

exports.merges = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('m', moduleName, symbolPath, opt_deprecationMessage);
};

exports.defaults = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('d', moduleName, symbolPath, opt_deprecationMessage);
};

exports.runs = function(moduleName) {
    addEntry('r', moduleName, null);
};

function prepareNamespace(symbolPath, context) {
    if (!symbolPath) {
        return context;
    }
    var parts = symbolPath.split('.');
    var cur = context;
    for (var i = 0, part; part = parts[i]; ++i) {
        cur = cur[part] = cur[part] || {};
    }
    return cur;
}

exports.mapModules = function(context) {
    var origSymbols = {};
    context.CDV_origSymbols = origSymbols;
    for (var i = 0, len = symbolList.length; i < len; i += 3) {
        var strategy = symbolList[i];
        var moduleName = symbolList[i + 1];
        var module = require(moduleName);
        // <runs/>
        if (strategy == 'r') {
            continue;
        }
        var symbolPath = symbolList[i + 2];
        var lastDot = symbolPath.lastIndexOf('.');
        var namespace = symbolPath.substr(0, lastDot);
        var lastName = symbolPath.substr(lastDot + 1);

        var deprecationMsg = symbolPath in deprecationMap ? 'Access made to deprecated symbol: ' + symbolPath + '. ' + deprecationMsg : null;
        var parentObj = prepareNamespace(namespace, context);
        var target = parentObj[lastName];

        if (strategy == 'm' && target) {
            builder.recursiveMerge(target, module);
        } else if ((strategy == 'd' && !target) || (strategy != 'd')) {
            if (!(symbolPath in origSymbols)) {
                origSymbols[symbolPath] = target;
            }
            builder.assignOrWrapInDeprecateGetter(parentObj, lastName, module, deprecationMsg);
        }
    }
};

exports.getOriginalSymbol = function(context, symbolPath) {
    var origSymbols = context.CDV_origSymbols;
    if (origSymbols && (symbolPath in origSymbols)) {
        return origSymbols[symbolPath];
    }
    var parts = symbolPath.split('.');
    var obj = context;
    for (var i = 0; i < parts.length; ++i) {
        obj = obj && obj[parts[i]];
    }
    return obj;
};

exports.reset();


});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/platform.js
define("cordova/platform", function(require, exports, module) {

module.exports = {
    id: 'sectv-orsay',
    cordovaVersion: '3.4.0',

    bootstrap: function() {
        console.log('cordova/platform: orsay bootstrap BEGIN');

        var modulemapper = require('cordova/modulemapper');
        var channel = require('cordova/channel');
        var SEF = require('cordova/plugin/SEF');
        var isWebapisLoaded = false;
        var isOnShowEventFire = false;

        modulemapper.clobbers('cordova/exec/proxy', 'cordova.commandProxy');

        var fireNativeReadyEvent = function() {
            if(isWebapisLoaded && isOnShowEventFire) {
                channel.onNativeReady.fire();
            }
        };

        for (var k in define.moduleMap) {
            if (/cordova.*\/proxy/.exec(k)) {
                require(k);
            }
            if (/cordova.*\/symbols/.exec(k)) {
                require(k);
            }
        }

        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '$MANAGER_WIDGET/Common/webapi/1.0/webapis.js';
        script.onload = function() {
            isWebapisLoaded = true;
            fireNativeReadyEvent();
            require('cordova/plugin/ime-via-input');
        };
        head.appendChild(script);

        window.onPause = function () {
            channel.onPause.fire();
        };
        window.onResume = function () {
            channel.onResume.fire();
        };
        window.addEventListener('load', function () {
            var AppCommonPlugin = null;
            var NNaviPlugin = null;
            window.onShow = function () {
                try {
                    AppCommonPlugin = SEF.get('AppCommon');
                }
                catch(e) {
                    Error(e);
                }
                AppCommonPlugin.Execute('UnregisterAllKey');
                AppCommonPlugin.Execute('RegisterKey',29460); //up
                AppCommonPlugin.Execute('RegisterKey',29461); //down
                AppCommonPlugin.Execute('RegisterKey',4); //left
                AppCommonPlugin.Execute('RegisterKey',5); //right
                AppCommonPlugin.Execute('RegisterKey',29443); //enter
                AppCommonPlugin.Execute('RegisterKey',88); // return

                try {
                    NNaviPlugin = SEF.get('NNavi');
                }
                catch(e) {
                    Error(e);
                }

                NNaviPlugin.Execute('SetBannerState',2);
                isOnShowEventFire = true;
                fireNativeReadyEvent();
            };

            if(window.curWidget && typeof window.curWidget.setPreference == 'function') {
                window.curWidget.setPreference('ready', 'true');
            }
        });

        window.addEventListener('unload', function () {
            SEF.close();
        });

        window.addEventListener('keydown', function (e) {
            switch(e.keyCode) {
                case 88: // RETURN key
                    // default action disabled.
                    // Calling 'setPreference('return', 'true')' is needed explicitly to exit the application
                    e.preventDefault();
                    break;
                case 45: // EXIT key
                    // NOTHING to prevent.
                    break;
            }
        });

        // End of bootstrap
        console.log('cordova/platform: orsay bootstrap END');
    }
};

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/Connection.js
define("cordova/plugin/Connection", function(require, exports, module) {

/**
 * Network status
 */
module.exports = {
    UNKNOWN: 'unknown',
    ETHERNET: 'ethernet',
    WIFI: 'wifi',
    CELL_2G: '2g',
    CELL_3G: '3g',
    CELL_4G: '4g',
    CELL: 'cellular',
    NONE: 'none'
};

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/GlobalizationError.js
define("cordova/plugin/GlobalizationError", function(require, exports, module) {

/**
 * Globalization error object
 *
 * @constructor
 * @param code
 * @param message
 */
var GlobalizationError = function(code, message) {
    this.code = code || null;
    this.message = message || '';
};

// Globalization error codes
GlobalizationError.UNKNOWN_ERROR = 0;
GlobalizationError.FORMATTING_ERROR = 1;
GlobalizationError.PARSING_ERROR = 2;
GlobalizationError.PATTERN_ERROR = 3;

module.exports = GlobalizationError;

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/SEF.js
define("cordova/plugin/SEF", function(require, exports, module) {

var SEF = {
    pluginName: ['TV', 'TVMW', 'NNavi', 'Audio', 'AppCommon', 'FrontPanel', 'ImageViewer', 'Player', 'AUI',
                     'Storage', 'Network', 'Download', 'Screen', 'Time', 'Video', 'Window',
                     'ExternalWidgetInterface', 'FileSystem', 'Gamepad', 'Michrophone',
                     'CustomDevice', 'MIDIDevice','RECOG', 'AllShare'],
    insertPluginList: {}
};

var pluginPrefix = 'cordova_plugin_SEF_';
SEF.get = function(name) {
    if(__checkPluginName.apply(this,arguments)) {
        if(!this.insertPluginList.hasOwnProperty(name)) {
            var containerDiv = document.createElement('div');
            containerDiv.style.position = 'absolute';
            containerDiv.style.left = '0px';
            containerDiv.style.top = '0px';
            document.body.appendChild(containerDiv);
            containerDiv.innerHTML += '<OBJECT id="'+ pluginPrefix + name + '" classid="clsid:SAMSUNG-INFOLINK-SEF" style="display:block;position:absolute;width:0px;height:0px;"></OBJECT>';
        }

        var currentPlugin = document.getElementById(pluginPrefix + name);
        currentPlugin.Close();
        if(currentPlugin.Open(name,'1.000',name) === 1) {
            this.insertPluginList[name] = currentPlugin;
            return currentPlugin;
        }
        else {
            console.log('Failed to open SEF Plugin');
            throw Error('Failed to open SEF Plugin');
        }
    }
    else {
        console.log('This SEF Plugin name is not supported');
        throw Error('This SEF Plugin name is not supported');
    }
};

SEF.close = function(name) {
    var plugin = null;
    if(!name) {
        for(var key in this.insertPluginList) {
            plugin = document.getElementById(this.insertPluginList[key].id);
            plugin.Close();
            delete this.insertPluginList[key];
        }
    }
    else if(name && this.insertPluginList.hasOwnProperty(name)) {
        plugin = document.getElementById(this.insertPluginList[name].id);
        plugin.Close();
        delete this.insertPluginList[name];
    }
};

function __checkPluginName(name) {
    for(var i=0; i<this.pluginName.length; i++) {
        if(this.pluginName[i].toUpperCase() == name.toUpperCase()) {
            console.log('\treturn '+this.pluginName[i]);
            return this.pluginName[i];
        }
    }
    return null;
}

module.exports = SEF;

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/connection/proxy.js
define("cordova/plugin/connection/proxy", function(require, exports, module) {

var Connection = require('cordova/plugin/Connection');
var SEF = require('cordova/plugin/SEF');
var OrsayActiveConnectionType = {
    WIFI: 0,
    ETHERNET: 1
};
var OrsayConnectionState = {
    OFFLINE: '0',
    ONLINE: '1'
};

module.exports = {
    getConnectionInfo: function(successCallback, errorCallback) {
        var networkType = Connection.NONE;
        var NetworkPlugin = SEF.get('Network');

        try {
            NetworkPlugin.OnEvent = function(event, data1, data2) {
                var networkEvent = document.createEvent('Event');

                if(event == OrsayActiveConnectionType.WIFI || event == OrsayActiveConnectionType.ETHERNET) {
                    checkNetworkType();
                    switch(data1) {
                    case OrsayConnectionState.OFFLINE:
                        setTimeout(function() {
                            if(!navigator.onLine) { // When network state changed in short time.
                                networkEvent.initEvent('offline', true, true);
                                window.dispatchEvent(networkEvent);
                            }
                        }, 0);
                        break;
                    case OrsayConnectionState.ONLINE:
                        setTimeout(function() {
                            if(navigator.onLine) { // When network state changed in short time.
                                networkEvent.initEvent('online', true, true);
                                window.dispatchEvent(networkEvent);
                            }
                        }, 0);
                        break;
                    }
                }
            };
            checkNetworkType();

            setTimeout(function() {
                successCallback(networkType);
            }, 0);
        }
        catch (e) {
            setTimeout(function() {
                errorCallback(e);
            }, 0);
        }

        function isActive(type) {
            if( webapis._plugin('NETWORK', 'CheckDNS', type) == 1 && webapis._plugin('NETWORK', 'CheckGateway', type) == 1 && webapis._plugin('NETWORK', 'CheckHTTP', type) == 1 && webapis._plugin('NETWORK', 'CheckPhysicalConnection', type) == 1 ) {
                return true;
            }
            else {
                return false;
            }
        }

        function checkNetworkType() {
            if(isActive(OrsayActiveConnectionType.ETHERNET)) {
                console.log('connection network type is Ethernet');
                networkType = Connection.ETHERNET;
            }
            else if(isActive(OrsayActiveConnectionType.WIFI)) {
                console.log('connection network type is Wifi');
                networkType = Connection.WIFI;
            }
            else {
                console.log('network disconnected');
                networkType = Connection.NONE;
            }
            if(navigator.connection) {
                navigator.connection.type = networkType;
            }
        }
    }
};

require('cordova/exec/proxy').add('NetworkStatus', module.exports);

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/connection/symbols.js
define("cordova/plugin/connection/symbols", function(require, exports, module) {

var modulemapper = require('cordova/modulemapper');

modulemapper.clobbers('cordova/plugin/network', 'navigator.connection');
modulemapper.clobbers('cordova/plugin/network', 'navigator.network.connection');
modulemapper.clobbers('cordova/plugin/Connection', 'Connection');

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/console-via-logger.js
define("cordova/plugin/console-via-logger", function(require, exports, module) {
// Retrieved from: https://github.com/apache/cordova-plugin-console/blob/master/www/console-via-logger.js
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

//------------------------------------------------------------------------------

//var logger = require("./logger");
// kookheon.kim: Modified from original to be absolute module id.
// The cordova module's separator is "/" and cordova plugin's separator is ".".
// When a plugin requests a module to "require" with relative path, the "require" find and reassemble the requested id with dot(.) Separator.
// In the sectv-orsay and sectv-tizen, all the cordova plugin implementation is merged to cordova.js. This is done by cordova-js and plugin modules are merged with "/" separator instead of ".".
// This makes error because the "require" searches the "." separator from the plugin module's id to make the absolute path.
// To use absolute id will suppress this error.
var logger = require('cordova/plugin/logger');
/* jshint -W098 */
var utils = require('cordova/utils');

//------------------------------------------------------------------------------
// object that we're exporting
//------------------------------------------------------------------------------
/* jshint -W079 */
var console = module.exports;

//------------------------------------------------------------------------------
// copy of the original console object
//------------------------------------------------------------------------------
var WinConsole = window.console;

//------------------------------------------------------------------------------
// whether to use the logger
//------------------------------------------------------------------------------
var UseLogger = false;

//------------------------------------------------------------------------------
// Timers
//------------------------------------------------------------------------------
var Timers = {};

//------------------------------------------------------------------------------
// used for unimplemented methods
//------------------------------------------------------------------------------
function noop() {}

//------------------------------------------------------------------------------
// used for unimplemented methods
//------------------------------------------------------------------------------
console.useLogger = function (value) {
    if (arguments.length) {
        UseLogger = !!value;
    }

    if (UseLogger) {
        if (logger.useConsole()) {
            throw new Error('console and logger are too intertwingly');
        }
    }

    return UseLogger;
};

//------------------------------------------------------------------------------
console.log = function() {
    if (logger.useConsole()) {
        return;
    }
    logger.log.apply(logger, [].slice.call(arguments));
};

//------------------------------------------------------------------------------
console.error = function() {
    if (logger.useConsole()) {
        return;
    }
    logger.error.apply(logger, [].slice.call(arguments));
};

//------------------------------------------------------------------------------
console.warn = function() {
    if (logger.useConsole()) {
        return;
    }
    logger.warn.apply(logger, [].slice.call(arguments));
};

//------------------------------------------------------------------------------
console.info = function() {
    if (logger.useConsole()) {
        return;
    }
    logger.info.apply(logger, [].slice.call(arguments));
};

//------------------------------------------------------------------------------
console.debug = function() {
    if (logger.useConsole()) {
        return;
    }
    logger.debug.apply(logger, [].slice.call(arguments));
};

//------------------------------------------------------------------------------
console.assert = function(expression) {
    if (expression) {
        return;
    }

    var message = logger.format.apply(logger.format, [].slice.call(arguments, 1));
    console.log('ASSERT: ' + message);
};

//------------------------------------------------------------------------------
console.clear = function() {};

//------------------------------------------------------------------------------
console.dir = function(object) {
    console.log('%o', object);
};

//------------------------------------------------------------------------------
console.dirxml = function(node) {
    console.log(node.innerHTML);
};

//------------------------------------------------------------------------------
console.trace = noop;

//------------------------------------------------------------------------------
console.group = console.log;

//------------------------------------------------------------------------------
console.groupCollapsed = console.log;

//------------------------------------------------------------------------------
console.groupEnd = noop;

//------------------------------------------------------------------------------
console.time = function(name) {
    Timers[name] = new Date().valueOf();
};

//------------------------------------------------------------------------------
console.timeEnd = function(name) {
    var timeStart = Timers[name];
    if (!timeStart) {
        console.warn('unknown timer: ' + name);
        return;
    }

    var timeElapsed = new Date().valueOf() - timeStart;
    console.log(name + ': ' + timeElapsed + 'ms');
};

//------------------------------------------------------------------------------
console.timeStamp = noop;

//------------------------------------------------------------------------------
console.profile = noop;

//------------------------------------------------------------------------------
console.profileEnd = noop;

//------------------------------------------------------------------------------
console.count = noop;

//------------------------------------------------------------------------------
console.exception = console.log;

//------------------------------------------------------------------------------
console.table = function(data, columns) {
    console.log('%o', data);
};

//------------------------------------------------------------------------------
// return a new function that calls both functions passed as args
//------------------------------------------------------------------------------
function wrappedOrigCall(orgFunc, newFunc) {
    return function() {
        var args = [].slice.call(arguments);
        try {
            orgFunc.apply(WinConsole, args);
        }
        catch (e) {}
        try {
            newFunc.apply(console, args);
        }
        catch (e) {}
    };
}

//------------------------------------------------------------------------------
// For every function that exists in the original console object, that
// also exists in the new console object, wrap the new console method
// with one that calls both
//------------------------------------------------------------------------------
for (var key in console) {
    if (typeof WinConsole[key] == 'function') {
        console[key] = wrappedOrigCall(WinConsole[key], console[key]);
    }
}

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/console/proxy.js
define("cordova/plugin/console/proxy", function(require, exports, module) {

var logger = require('cordova/plugin/logger');

var logLvAlertMap = {};
logLvAlertMap[logger.LOG] = 1;
logLvAlertMap[logger.ERROR] = 2;
logLvAlertMap[logger.WARN] = 3;
logLvAlertMap[logger.INFO] = 4;
logLvAlertMap[logger.DEBUG] = 5;
var levelNameMap = {};
var levelNames = ['LOG', 'ERROR', 'WARN', 'INFO', 'DEBUG'];
for(var i=0; i<levelNames.length; i++) {
    levelNameMap[logger[levelNames[i]]] = levelNames[i];
}

var winAlert = window.alert;

module.exports = {
    logLevel: function (success, fail, args) {	// args contains [level, message]
        winAlert && winAlert('[cordova-plugin-console][' + (levelNameMap[args[0]] || args[0]) + '] ' + args[1], logLvAlertMap[args[0]] || 5);
    }
};

require('cordova/exec/proxy').add('Console',module.exports);

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/console/symbols.js
define("cordova/plugin/console/symbols", function(require, exports, module) {

var modulemapper = require('cordova/modulemapper');

modulemapper.clobbers('cordova/plugin/logger', 'cordova.logger');
modulemapper.clobbers('cordova/plugin/console-via-logger', 'console');

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/device.js
define("cordova/plugin/device", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    cordova = require('cordova');

channel.createSticky('onCordovaInfoReady');

// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

/**
 * This represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
function Device() {
    this.available = false;
    this.platform = null;
    this.version = null;
    this.uuid = null;
    this.cordova = null;
    this.model = null;
    this.manufacturer = null;

    var me = this;

    channel.onCordovaReady.subscribe(function() {
        me.getInfo(function(info) {
            //ignoring info.cordova returning from native, we should use value from cordova.version defined in cordova.js
            //TODO: CB-5105 native implementations should not return info.cordova
            var buildLabel = cordova.version;
            me.available = true;
            me.platform = info.platform;
            me.version = info.version;
            me.uuid = info.uuid;
            me.cordova = buildLabel;
            me.model = info.model;
            me.manufacturer = info.manufacturer || 'unknown';
            channel.onCordovaInfoReady.fire();
        },function(e) {
            me.available = false;
            utils.alert('[ERROR] Error initializing Cordova: ' + e);
        });
    });
}

/**
 * Get device info
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 */
Device.prototype.getInfo = function(successCallback, errorCallback) {
    argscheck.checkArgs('fF', 'Device.getInfo', arguments);
    exec(successCallback, errorCallback, 'Device', 'getDeviceInfo', []);
};

module.exports = new Device();

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/device/proxy.js
define("cordova/plugin/device/proxy", function(require, exports, module) {

var orsay = require('cordova/platform');

module.exports = {
    getDeviceInfo: function(success, error) {
        try {
            setTimeout(function() {
                success({
                    cordova: orsay.cordovaVersion,
                    platform: 'sectv-orsay',
                    model: webapis.tv.info.getModel(), // "15_HAWKP_UHD"
                    version: webapis.tv.info.getFirmware(), // "T-HKPAKUC-0017.10"
                    uuid: webapis.tv.info.getDeviceID(), // "U7CJYBPYKOKD6"
                    manufacturer: 'Samsung Orsay TV'
                });
            }, 0);
        }
        catch (e) {
            setTimeout(function() {
                error(e);
            }, 0);
        }
    }
};

require('cordova/exec/proxy').add('Device', module.exports);

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/device/symbols.js
define("cordova/plugin/device/symbols", function(require, exports, module) {

var modulemapper = require('cordova/modulemapper');

modulemapper.clobbers('cordova/plugin/device', 'device');

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/globalization.js
define("cordova/plugin/globalization", function(require, exports, module) {
// Retrieved from: https://github.com/apache/cordova-plugin-globalization/blob/master/www/globalization.js
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

var globalization = {

    /**
     * Returns the string identifier for the client's current language.
     * It returns the language identifier string to the successCB callback with a
     * properties object as a parameter. If there is an error getting the language,
     * then the errorCB callback is invoked.
     *
     * @param {Function} successCB
     * @param {Function} errorCB
     *
     * @return Object.value {String}: The language identifier
     *
     * @error GlobalizationError.UNKNOWN_ERROR
     *
     * Example
     *    globalization.getPreferredLanguage(function (language) {alert('language:' + language.value + '\n');},
     *                                function () {});
     */
    getPreferredLanguage: function(successCB, failureCB) {
        argscheck.checkArgs('fF', 'Globalization.getPreferredLanguage', arguments);
        exec(successCB, failureCB, 'Globalization', 'getPreferredLanguage', []);
    },

    /**
     * Returns the string identifier for the client's current locale setting.
     * It returns the locale identifier string to the successCB callback with a
     * properties object as a parameter. If there is an error getting the locale,
     * then the errorCB callback is invoked.
     *
     * @param {Function} successCB
     * @param {Function} errorCB
     *
     * @return Object.value {String}: The locale identifier
     *
     * @error GlobalizationError.UNKNOWN_ERROR
     *
     * Example
     *    globalization.getLocaleName(function (locale) {alert('locale:' + locale.value + '\n');},
     *                                function () {});
     */
    getLocaleName: function(successCB, failureCB) {
        argscheck.checkArgs('fF', 'Globalization.getLocaleName', arguments);
        exec(successCB, failureCB, 'Globalization', 'getLocaleName', []);
    }
};

module.exports = globalization;

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/globalization/proxy.js
define("cordova/plugin/globalization/proxy", function(require, exports, module) {

var appParams;
var GlobalizationError = require('cordova/plugin/GlobalizationError');

function parseAppParams() {
    // Example: ?country=US&samsung_country=US&language=1&lang=en&modelid=13_FOXP&server=development&remocon=2_35_259_12&area=USA&product=0&mgrver=5.014&totalMemory=1744830464&webbrowser=true&sourcetype=0&preload=true
    var query = window.location.search || '';
    query = query.split('?');
    query = query.length >= 2 ? query[1] : '';
    var data = query.split('&');
    appParams = {};
    for(var i=0; i<data.length; i++) {
        var tmp = data[i].split('=');
        if(tmp.length >= 2) {
            appParams[tmp[0]] = decodeURIComponent(tmp.slice(1).join(''));
        }
    }
}

module.exports = {
    getPreferredLanguage: function(success, error) {
        if(!appParams) {
            parseAppParams();
        }
        if(appParams && typeof appParams.lang === 'string' && appParams.lang.length > 0) {
            success && setTimeout(function () {
                success({
                    value: appParams.lang
                });
            }, 0);
        }
        else {
            error && setTimeout(function () {
                error(new GlobalizationError(GlobalizationError.UNKNOWN_ERROR));
            }, 0);
        }
    },
    getLocaleName: function(success, error) {
        if(!appParams) {
            parseAppParams();
        }
        if(appParams && typeof appParams.country === 'string' && appParams.country.length > 0) {
            success && setTimeout(function () {
                success({
                    value: appParams.country
                });
            }, 0);
        }
        else {
            error && setTimeout(function () {
                error(new GlobalizationError(GlobalizationError.UNKNOWN_ERROR));
            }, 0);
        }
    }
};

require('cordova/exec/proxy').add('Globalization', module.exports);

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/globalization/symbols.js
define("cordova/plugin/globalization/symbols", function(require, exports, module) {

var modulemapper = require('cordova/modulemapper');

modulemapper.clobbers('cordova/plugin/globalization', 'navigator.globalization');

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/ime-via-input.js
define("cordova/plugin/ime-via-input", function(require, exports, module) {

var focusFlag = true;
var elInput = null;
document.body.addEventListener('focus', function (e) {
    if(document.activeElement && document.activeElement.tagName.toUpperCase() === 'INPUT' &&
        (document.activeElement.type === 'text' || document.activeElement.type === 'password')) {
        if(focusFlag) {
            elInput = document.activeElement;
            onFocus();
            focusFlag = false;
        }
        else {
            focusFlag = true;
        }
    }
}, true);

var imeInstance = null;
function onFocus(context) {
    if(!bIMEJSInserted) {
        insertIMEJS(this);
        return;
    }

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    /*jshint camelcase: false */
    /*jshint undef: false */
    if(imeInstance === null) {
        imeInstance = new IMEShell_Common();

        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        /*jshint camelcase: true */
        elInput.id = elInput.id || ('ime_'+Date.now());
        imeInstance.inputboxID = elInput.id;
        var title = elInput.getAttribute('data-ime-title') || '';
        imeInstance.inputTitle = title;

        if(context) {
            imeInstance.context = context;
        }
        else {
            imeInstance.context = this;
        }

        if(elInput.type === 'password') {
            imeInstance.setPasswordMode(false);
            if(elInput.getAttribute('data-ime-show-password') === 'true') {
                imeInstance.setUseShowHidePasswordMenu(true);
            }
        }

        imeInstance.setBlockSpace(true);
        imeInstance.onKeyPressFunc = onKeyCallback;

        elInput.setAttribute('data-ime-show', 'true');
        imeInstance.onShow();
    }
}

window.onHide = function () {
    onBlur();
};

/*jshint unused: false */
function onKeyCallback(key, str, id) {
    var e = document.createEvent('Event');

    switch(key){
        case 29443: // Orsay ENTER
            e.initEvent('submit', true, true);
            elInput.dispatchEvent(e);
            onBlur();
            break;
        case 88: // Orsay RETURN
        case 45: // Orsay EXIT
            e.initEvent('cancel', true, true);
            elInput.dispatchEvent(e);
            onBlur();
            break;
    }
}

function onBlur() {
    if(imeInstance) {
        imeInstance.onClose();

        elInput.setAttribute('data-ime-show', 'false');
        elInput.blur();

        imeInstance = null;
    }
}

var bIMEJSInserted = false;
function insertIMEJS(context) {
    if(bIMEJSInserted) {
        return;
    }
    var count = 0;
    var scriptIme = document.createElement('script');
    scriptIme.src = '$MANAGER_WIDGET/Common/IME_XT9/ime.js';
    scriptIme.onload = checkLoaded;
    document.body.appendChild(scriptIme);
    var scriptImeInput = document.createElement('script');
    scriptImeInput.src = '$MANAGER_WIDGET/Common/IME_XT9/inputCommon/ime_input.js';
    scriptImeInput.onload = checkLoaded;
    document.body.appendChild(scriptImeInput);

    function checkLoaded() {
        count++;
        if(count >= 2) {
            bIMEJSInserted = true;
            setTimeout(function() { //This timer is for 2012 year common IME UI rendering because Orsay platform performance.
                onFocus && onFocus.call(this,context);
            },2000);
        }
    }
}

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/logger.js
define("cordova/plugin/logger", function(require, exports, module) {
// Retrieved from: https://github.com/apache/cordova-plugin-console/blob/master/www/logger.js
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

//------------------------------------------------------------------------------
// The logger module exports the following properties/functions:
//
// LOG                          - constant for the level LOG
// ERROR                        - constant for the level ERROR
// WARN                         - constant for the level WARN
// INFO                         - constant for the level INFO
// DEBUG                        - constant for the level DEBUG
// logLevel()                   - returns current log level
// logLevel(value)              - sets and returns a new log level
// useConsole()                 - returns whether logger is using console
// useConsole(value)            - sets and returns whether logger is using console
// log(message,...)             - logs a message at level LOG
// error(message,...)           - logs a message at level ERROR
// warn(message,...)            - logs a message at level WARN
// info(message,...)            - logs a message at level INFO
// debug(message,...)           - logs a message at level DEBUG
// logLevel(level,message,...)  - logs a message specified level
//
//------------------------------------------------------------------------------

var logger = exports;

var exec = require('cordova/exec');
/* jshint -W098 */
var utils = require('cordova/utils');

var UseConsole = false;
var UseLogger = true;
var Queued = [];
var DeviceReady = false;
var CurrentLevel;

var originalConsole = console;

/**
 * Logging levels
 */

var Levels = [
    'LOG',
    'ERROR',
    'WARN',
    'INFO',
    'DEBUG'
];

/*
 * add the logging levels to the logger object and
 * to a separate levelsMap object for testing
 */

var LevelsMap = {};
for (var i=0; i<Levels.length; i++) {
    var level = Levels[i];
    LevelsMap[level] = i;
    logger[level] = level;
}

CurrentLevel = LevelsMap.WARN;

/**
 * Getter/Setter for the logging level
 *
 * Returns the current logging level.
 *
 * When a value is passed, sets the logging level to that value.
 * The values should be one of the following constants:
 *    logger.LOG
 *    logger.ERROR
 *    logger.WARN
 *    logger.INFO
 *    logger.DEBUG
 *
 * The value used determines which messages get printed.  The logging
 * values above are in order, and only messages logged at the logging
 * level or above will actually be displayed to the user.  E.g., the
 * default level is WARN, so only messages logged with LOG, ERROR, or
 * WARN will be displayed; INFO and DEBUG messages will be ignored.
 */
logger.level = function (value) {
    if (arguments.length) {
        if (LevelsMap[value] === null) {
            throw new Error('invalid logging level: ' + value);
        }
        CurrentLevel = LevelsMap[value];
    }

    return Levels[CurrentLevel];
};

/**
 * Getter/Setter for the useConsole functionality
 *
 * When useConsole is true, the logger will log via the
 * browser 'console' object.
 */
logger.useConsole = function (value) {
    if (arguments.length) {
        UseConsole = !!value;
    }

    if (UseConsole) {
        if (typeof console == 'undefined') {
            throw new Error('global console object is not defined');
        }

        if (typeof console.log != 'function') {
            throw new Error('global console object does not have a log function');
        }

        if (typeof console.useLogger == 'function') {
            if (console.useLogger()) {
                throw new Error('console and logger are too intertwingly');
            }
        }
    }

    return UseConsole;
};

/**
 * Getter/Setter for the useLogger functionality
 *
 * When useLogger is true, the logger will log via the
 * native Logger plugin.
 */
logger.useLogger = function (value) {
    // Enforce boolean
    if (arguments.length) {
        UseLogger = !!value;
    }
    return UseLogger;
};

/**
 * Logs a message at the LOG level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.log = function(message) { logWithArgs('LOG', arguments); };

/**
 * Logs a message at the ERROR level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.error = function(message) { logWithArgs('ERROR', arguments); };

/**
 * Logs a message at the WARN level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.warn = function(message) { logWithArgs('WARN', arguments); };

/**
 * Logs a message at the INFO level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.info = function(message) { logWithArgs('INFO', arguments); };

/**
 * Logs a message at the DEBUG level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.debug = function(message) { logWithArgs('DEBUG', arguments); };

// log at the specified level with args
function logWithArgs(level, args) {
    args = [level].concat([].slice.call(args));
    logger.logLevel.apply(logger, args);
}

// return the correct formatString for an object
function formatStringForMessage(message) {
    return (typeof message === 'string') ? '' : '%o';
}

/**
 * Logs a message at the specified level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.logLevel = function(level /* , ... */) {
    // format the message with the parameters
    var formatArgs = [].slice.call(arguments, 1);
    var fmtString = formatStringForMessage(formatArgs[0]);
    if (fmtString.length > 0) {
        formatArgs.unshift(fmtString); // add formatString
    }

    var message = logger.format.apply(logger.format, formatArgs);

    if (LevelsMap[level] === null) {
        throw new Error('invalid logging level: ' + level);
    }

    if (LevelsMap[level] > CurrentLevel) {
        return;
    }

    // queue the message if not yet at deviceready
    if (!DeviceReady && !UseConsole) {
        Queued.push([level, message]);
        return;
    }

    // Log using the native logger if that is enabled
    if (UseLogger) {
        exec(null, null, 'Console', 'logLevel', [level, message]);
    }

    // Log using the console if that is enabled
    if (UseConsole) {
        // make sure console is not using logger
        if (console.useLogger()) {
            throw new Error('console and logger are too intertwingly');
        }

        // log to the console
        switch (level) {
            case logger.LOG: originalConsole.log(message); break;
            case logger.ERROR: originalConsole.log('ERROR: ' + message); break;
            case logger.WARN: originalConsole.log('WARN: ' + message); break;
            case logger.INFO: originalConsole.log('INFO: ' + message); break;
            case logger.DEBUG: originalConsole.log('DEBUG: ' + message); break;
        }
    }
};

/**
 * Formats a string and arguments following it ala console.log()
 *
 * Any remaining arguments will be appended to the formatted string.
 *
 * for rationale, see FireBug's Console API:
 *    http://getfirebug.com/wiki/index.php/Console_API
 */
logger.format = function(formatString, args) {
    return __format(arguments[0], [].slice.call(arguments,1)).join(' ');
};

//------------------------------------------------------------------------------
/**
 * Formats a string and arguments following it ala vsprintf()
 *
 * format chars:
 *   %j - format arg as JSON
 *   %o - format arg as JSON
 *   %c - format arg as ''
 *   %% - replace with '%'
 * any other char following % will format it's
 * arg via toString().
 *
 * Returns an array containing the formatted string and any remaining
 * arguments.
 */
function __format(formatString, args) {
    if (formatString === null || formatString === undefined) {
        return [''];
    }
    if (arguments.length == 1) {
        return [formatString.toString()];
    }

    if (typeof formatString != 'string') {
        formatString = formatString.toString();
    }

    var pattern = /(.*?)%(.)(.*)/;
    var rest = formatString;
    var result = [];

    while (args.length) {
        var match = pattern.exec(rest);
        if (!match) {
            break;
        }

        var arg = args.shift();
        rest = match[3];
        result.push(match[1]);

        if (match[2] == '%') {
            result.push('%');
            args.unshift(arg);
            continue;
        }

        result.push(__formatted(arg, match[2]));
    }

    result.push(rest);

    var remainingArgs = [].slice.call(args);
    remainingArgs.unshift(result.join(''));
    return remainingArgs;
}

function __formatted(object, formatChar) {

    try {
        switch(formatChar) {
            case 'j':
            case 'o': return JSON.stringify(object);
            case 'c': return '';
        }
    }
    catch (e) {
        return 'error JSON.stringify()ing argument: ' + e;
    }

    if ((object === null) || (object === undefined)) {
        return Object.prototype.toString.call(object);
    }

    return object.toString();
}

//------------------------------------------------------------------------------
// when deviceready fires, log queued messages
logger.__onDeviceReady = function() {
    if (DeviceReady) {
        return;
    }

    DeviceReady = true;

    for (var i=0; i<Queued.length; i++) {
        var messageArgs = Queued[i];
        logger.logLevel(messageArgs[0], messageArgs[1]);
    }

    Queued = null;
};

// add a deviceready event to log queued messages
document.addEventListener('deviceready', logger.__onDeviceReady, false);

});

// file: D:/toast-prj/cordova-sectv-orsay/cordova-js-src/plugin/network.js
define("cordova/plugin/network", function(require, exports, module) {

var exec = require('cordova/exec'),
    cordova = require('cordova'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils');

// Link the onLine property with the Cordova-supplied network info.
// This works because we clobber the navigator object with our own
// object in bootstrap.js.
// Browser platform do not need to define this property, because
// it is already supported by modern browsers
if (cordova.platformId !== 'browser' && typeof navigator != 'undefined') {
    utils.defineGetter(navigator, 'onLine', function() {
        return this.connection.type != 'none';
    });
}

function NetworkConnection() {
    this.type = 'unknown';
}

/**
 * Get connection info
 *
 * @param {Function} successCallback The function to call when the Connection data is available
 * @param {Function} errorCallback The function to call when there is an error getting the Connection data. (OPTIONAL)
 */
NetworkConnection.prototype.getInfo = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, 'NetworkStatus', 'getConnectionInfo', []);
};

var me = new NetworkConnection();
var timerId = null;
var timeout = 500;

channel.createSticky('onCordovaConnectionReady');
channel.waitForInitialization('onCordovaConnectionReady');

channel.onCordovaReady.subscribe(function() {
    me.getInfo(function(info) {
        me.type = info;
        if (info === 'none') {
            // set a timer if still offline at the end of timer send the offline event
            timerId = setTimeout(function() {
                cordova.fireDocumentEvent('offline');
                timerId = null;
            }, timeout);
        }
        else {
            // If there is a current offline event pending clear it
            if (timerId !== null) {
                clearTimeout(timerId);
                timerId = null;
            }
            cordova.fireDocumentEvent('online');
        }

        // should only fire this once
        if (channel.onCordovaConnectionReady.state !== 2) {
            channel.onCordovaConnectionReady.fire();
        }
    },
    function (e) {
        // If we can't get the network info we should still tell Cordova
        // to fire the deviceready event.
        if (channel.onCordovaConnectionReady.state !== 2) {
            channel.onCordovaConnectionReady.fire();
        }
        console.log('Error initializing Network Connection: ' + e);
    });
});

module.exports = me;

});

// file: src/common/pluginloader.js
define("cordova/pluginloader", function(require, exports, module) {

var modulemapper = require('cordova/modulemapper');
var urlutil = require('cordova/urlutil');

// Helper function to inject a <script> tag.
// Exported for testing.
exports.injectScript = function(url, onload, onerror) {
    var script = document.createElement("script");
    // onload fires even when script fails loads with an error.
    script.onload = onload;
    // onerror fires for malformed URLs.
    script.onerror = onerror;
    script.src = url;
    document.head.appendChild(script);
};

function injectIfNecessary(id, url, onload, onerror) {
    onerror = onerror || onload;
    if (id in define.moduleMap) {
        onload();
    } else {
        exports.injectScript(url, function() {
            if (id in define.moduleMap) {
                onload();
            } else {
                onerror();
            }
        }, onerror);
    }
}

function onScriptLoadingComplete(moduleList, finishPluginLoading) {
    // Loop through all the plugins and then through their clobbers and merges.
    for (var i = 0, module; module = moduleList[i]; i++) {
        if (module.clobbers && module.clobbers.length) {
            for (var j = 0; j < module.clobbers.length; j++) {
                modulemapper.clobbers(module.id, module.clobbers[j]);
            }
        }

        if (module.merges && module.merges.length) {
            for (var k = 0; k < module.merges.length; k++) {
                modulemapper.merges(module.id, module.merges[k]);
            }
        }

        // Finally, if runs is truthy we want to simply require() the module.
        if (module.runs) {
            modulemapper.runs(module.id);
        }
    }

    finishPluginLoading();
}

// Handler for the cordova_plugins.js content.
// See plugman's plugin_loader.js for the details of this object.
// This function is only called if the really is a plugins array that isn't empty.
// Otherwise the onerror response handler will just call finishPluginLoading().
function handlePluginsObject(path, moduleList, finishPluginLoading) {
    // Now inject the scripts.
    var scriptCounter = moduleList.length;

    if (!scriptCounter) {
        finishPluginLoading();
        return;
    }
    function scriptLoadedCallback() {
        if (!--scriptCounter) {
            onScriptLoadingComplete(moduleList, finishPluginLoading);
        }
    }

    for (var i = 0; i < moduleList.length; i++) {
        injectIfNecessary(moduleList[i].id, path + moduleList[i].file, scriptLoadedCallback);
    }
}

function findCordovaPath() {
    var path = null;
    var scripts = document.getElementsByTagName('script');
    var term = '/cordova.js';
    for (var n = scripts.length-1; n>-1; n--) {
        var src = scripts[n].src.replace(/\?.*$/, ''); // Strip any query param (CB-6007).
        if (src.indexOf(term) == (src.length - term.length)) {
            path = src.substring(0, src.length - term.length) + '/';
            break;
        }
    }
    return path;
}

// Tries to load all plugins' js-modules.
// This is an async process, but onDeviceReady is blocked on onPluginsReady.
// onPluginsReady is fired when there are no plugins to load, or they are all done.
exports.load = function(callback) {
    var pathPrefix = findCordovaPath();
    if (pathPrefix === null) {
        console.log('Could not find cordova.js script tag. Plugin loading may fail.');
        pathPrefix = '';
    }
    injectIfNecessary('cordova/plugin_list', pathPrefix + 'cordova_plugins.js', function() {
        var moduleList = require("cordova/plugin_list");
        handlePluginsObject(pathPrefix, moduleList, callback);
    }, callback);
};


});

// file: src/common/pluginloader_b.js
define("cordova/pluginloader_b", function(require, exports, module) {

var modulemapper = require('cordova/modulemapper');

// Handler for the cordova_plugins.js content.
// See plugman's plugin_loader.js for the details of this object.
function handlePluginsObject(moduleList) {
    // if moduleList is not defined or empty, we've nothing to do
    if (!moduleList || !moduleList.length) {
        return;
    }

    // Loop through all the modules and then through their clobbers and merges.
    for (var i = 0, module; module = moduleList[i]; i++) {
        if (module.clobbers && module.clobbers.length) {
            for (var j = 0; j < module.clobbers.length; j++) {
                modulemapper.clobbers(module.id, module.clobbers[j]);
            }
        }

        if (module.merges && module.merges.length) {
            for (var k = 0; k < module.merges.length; k++) {
                modulemapper.merges(module.id, module.merges[k]);
            }
        }

        // Finally, if runs is truthy we want to simply require() the module.
        if (module.runs) {
            modulemapper.runs(module.id);
        }
    }
}

// Loads all plugins' js-modules. Plugin loading is syncronous in browserified bundle
// but the method accepts callback to be compatible with non-browserify flow.
// onDeviceReady is blocked on onPluginsReady. onPluginsReady is fired when there are
// no plugins to load, or they are all done.
exports.load = function(callback) {
    var moduleList = require("cordova/plugin_list");
    handlePluginsObject(moduleList);

    callback();
};


});

// file: src/common/urlutil.js
define("cordova/urlutil", function(require, exports, module) {


/**
 * For already absolute URLs, returns what is passed in.
 * For relative URLs, converts them to absolute ones.
 */
exports.makeAbsolute = function makeAbsolute(url) {
    var anchorEl = document.createElement('a');
    anchorEl.href = url;
    return anchorEl.href;
};


});

// file: src/common/utils.js
define("cordova/utils", function(require, exports, module) {

var utils = exports;

/**
 * Defines a property getter / setter for obj[key].
 */
utils.defineGetterSetter = function(obj, key, getFunc, opt_setFunc) {
    if (Object.defineProperty) {
        var desc = {
            get: getFunc,
            configurable: true
        };
        if (opt_setFunc) {
            desc.set = opt_setFunc;
        }
        Object.defineProperty(obj, key, desc);
    } else {
        obj.__defineGetter__(key, getFunc);
        if (opt_setFunc) {
            obj.__defineSetter__(key, opt_setFunc);
        }
    }
};

/**
 * Defines a property getter for obj[key].
 */
utils.defineGetter = utils.defineGetterSetter;

utils.arrayIndexOf = function(a, item) {
    if (a.indexOf) {
        return a.indexOf(item);
    }
    var len = a.length;
    for (var i = 0; i < len; ++i) {
        if (a[i] == item) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns whether the item was found in the array.
 */
utils.arrayRemove = function(a, item) {
    var index = utils.arrayIndexOf(a, item);
    if (index != -1) {
        a.splice(index, 1);
    }
    return index != -1;
};

utils.typeName = function(val) {
    return Object.prototype.toString.call(val).slice(8, -1);
};

/**
 * Returns an indication of whether the argument is an array or not
 */
utils.isArray = Array.isArray ||
                function(a) {return utils.typeName(a) == 'Array';};

/**
 * Returns an indication of whether the argument is a Date or not
 */
utils.isDate = function(d) {
    return (d instanceof Date);
};

/**
 * Does a deep clone of the object.
 */
utils.clone = function(obj) {
    if(!obj || typeof obj == 'function' || utils.isDate(obj) || typeof obj != 'object') {
        return obj;
    }

    var retVal, i;

    if(utils.isArray(obj)){
        retVal = [];
        for(i = 0; i < obj.length; ++i){
            retVal.push(utils.clone(obj[i]));
        }
        return retVal;
    }

    retVal = {};
    for(i in obj){
        if(!(i in retVal) || retVal[i] != obj[i]) {
            retVal[i] = utils.clone(obj[i]);
        }
    }
    return retVal;
};

/**
 * Returns a wrapped version of the function
 */
utils.close = function(context, func, params) {
    return function() {
        var args = params || arguments;
        return func.apply(context, args);
    };
};

//------------------------------------------------------------------------------
function UUIDcreatePart(length) {
    var uuidpart = "";
    for (var i=0; i<length; i++) {
        var uuidchar = parseInt((Math.random() * 256), 10).toString(16);
        if (uuidchar.length == 1) {
            uuidchar = "0" + uuidchar;
        }
        uuidpart += uuidchar;
    }
    return uuidpart;
}

/**
 * Create a UUID
 */
utils.createUUID = function() {
    return UUIDcreatePart(4) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(6);
};


/**
 * Extends a child object from a parent object using classical inheritance
 * pattern.
 */
utils.extend = (function() {
    // proxy used to establish prototype chain
    var F = function() {};
    // extend Child from Parent
    return function(Child, Parent) {

        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.__super__ = Parent.prototype;
        Child.prototype.constructor = Child;
    };
}());

/**
 * Alerts a message in any available way: alert or console.log.
 */
utils.alert = function(msg) {
    if (window.alert) {
        window.alert(msg);
    } else if (console && console.log) {
        console.log(msg);
    }
};





});

window.cordova = require('cordova');
// file: src/scripts/bootstrap.js

require('cordova/init');

})();