cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/browser/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "id": "cordova-plugin-network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "id": "cordova-plugin-network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/src/browser/network.js",
        "id": "cordova-plugin-network-information.NetworkInfoProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
        "id": "cordova-plugin-globalization.GlobalizationError",
        "clobbers": [
            "window.GlobalizationError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/globalization.js",
        "id": "cordova-plugin-globalization.globalization",
        "clobbers": [
            "navigator.globalization"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/browser/moment.js",
        "id": "cordova-plugin-globalization.moment",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-globalization/src/browser/GlobalizationProxy.js",
        "id": "cordova-plugin-globalization.GlobalizationProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-toast/www/inputdevice.js",
        "id": "cordova-plugin-toast.inputdevice",
        "clobbers": [
            "toast.inputdevice"
        ]
    },
    {
        "file": "plugins/cordova-plugin-toast/www/tvchannel.js",
        "id": "cordova-plugin-toast.tvchannel",
        "clobbers": [
            "toast.tvchannel"
        ]
    },
    {
        "file": "plugins/cordova-plugin-toast/www/tvwindow.js",
        "id": "cordova-plugin-toast.tvwindow",
        "clobbers": [
            "toast.tvwindow"
        ]
    },
    {
        "file": "plugins/cordova-plugin-toast/www/tvaudiocontrol.js",
        "id": "cordova-plugin-toast.tvaudiocontrol",
        "clobbers": [
            "toast.tvaudiocontrol"
        ]
    },
    {
        "file": "plugins/cordova-plugin-toast/www/drminfo.js",
        "id": "cordova-plugin-toast.drminfo",
        "clobbers": [
            "toast.drminfo"
        ]
    },
    {
        "file": "plugins/cordova-plugin-toast/www/application.js",
        "id": "cordova-plugin-toast.application",
        "clobbers": [
            "toast.application"
        ]
    },
    {
        "file": "plugins/cordova-plugin-toast/www/Media.js",
        "id": "cordova-plugin-toast.Media",
        "clobbers": [
            "toast.Media"
        ]
    },
    {
        "file": "plugins/cordova-plugin-toast/www/MediaPlugin.js",
        "id": "cordova-plugin-toast.MediaPlugin",
        "clobbers": [
            "toast.MediaPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-toast/www/util.js",
        "id": "cordova-plugin-toast.util"
    },
    {
        "file": "plugins/cordova-plugin-toast/src/browser/inputdeviceProxy.js",
        "id": "cordova-plugin-toast.inputdeviceProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-toast/src/browser/tvwindowProxy.js",
        "id": "cordova-plugin-toast.tvwindowProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-toast/src/browser/tvchannelProxy.js",
        "id": "cordova-plugin-toast.tvchannelProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-toast/src/browser/sampleEPG.js",
        "id": "cordova-plugin-toast.sampleEPG"
    },
    {
        "file": "plugins/cordova-plugin-toast/src/browser/tvaudiocontrolProxy.js",
        "id": "cordova-plugin-toast.tvaudiocontrolProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-toast/src/browser/drminfoProxy.js",
        "id": "cordova-plugin-toast.drminfoProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-toast/src/browser/applicationProxy.js",
        "id": "cordova-plugin-toast.applicationProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-toast/src/browser/mediaProxy.js",
        "id": "cordova-plugin-toast.mediaProxy",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.1",
    "cordova-plugin-device": "1.1.1",
    "cordova-plugin-network-information": "1.2.0",
    "cordova-plugin-globalization": "1.0.2",
    "cordova-plugin-toast": "0.1.0"
}
// BOTTOM OF METADATA
});