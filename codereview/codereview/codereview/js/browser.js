/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function jumpBrowser() {
    console.log('[sk08.lee] jumpBrowser');

    var userAgent = navigator.userAgent;
    var browserId;

    if(userAgent.match('Chrome')) {
        window.location.href='https://github.com/Samsung/cordova-plugin-toast';
    } else if(userAgent.match('Tizen')) {
        browserId = 'org.tizen.browser';

        toast.application.launchApp({
            appId: browserId,
            data: {
                url: 'https://github.com/Samsung/cordova-plugin-toast',
                info: 'This is github url for TOAST.'
            }
        }, function() {
            console.log('success');
        }, function(err) {
            console.log('fail' + err.message);
        });
    } else {
        browserId = '29_fullbrowser';

        toast.application.launchApp({
            appId: browserId,
            data: {
                url: 'https://github.com/Samsung/cordova-plugin-toast',
                info: 'This is github url for TOAST.'
            }
        }, function() {
            console.log('success');
        }, function(err) {
            console.log('fail' + err.message);
        });
    }
}
