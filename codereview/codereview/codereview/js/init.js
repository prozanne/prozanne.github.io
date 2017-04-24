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

var pageIndex = 'main';
var contentIndex = 1;
var tvKeyCode = [];

function registerKey() {
    console.log('[sk08.lee] registerKey');

    toast.inputdevice.getSupportedKeys(function(keys) {
        for(var i = 0, len = keys.length; i < len; i++) {
            tvKeyCode[keys[i].name] = keys[i].code;
        }
    });

    window.addEventListener('keydown', function(e) {
        switch(e.keyCode) {
            case tvKeyCode.ArrowUp:
                if(pageIndex == 'main' && contentIndex != 1) {
                    contentIndex = contentIndex - 1;
                    changeFocus();
                }

                break;
            case tvKeyCode.ArrowDown:
                if(pageIndex == 'main' && contentIndex != 3) {
                    contentIndex = contentIndex + 1;
                    changeFocus();
                }

            break;
            case tvKeyCode.Enter:
                if(pageIndex == 'main') {
                    doAction();
                } else {
                    jumpBrowser();
                }

            break;
            case tvKeyCode.Return:
                returnAction();

                break;
            default:

                break;
        }
    });
}

function addMouseEvent() {
    console.log('[sk08.lee] addMouseEvent');

    document.getElementById('description').addEventListener('click', function() {
        doAction();
    });
    document.getElementById('logo').addEventListener('click', function() {
        jumpBrowser();
    });
    document.getElementById('return').addEventListener('click', function() {
        returnAction();
    });

    document.getElementById('musicVideo').addEventListener('mouseover', function() {
        contentIndex = 1;
        changeFocus();
    });
    document.getElementById('PhotoSlide').addEventListener('mouseover', function() {
        contentIndex = 2;
        changeFocus();
    });
    document.getElementById('goToToast').addEventListener('mouseover', function() {
        contentIndex = 3;
        changeFocus();
    });
}

function addvisibilitychangeListener() {
    console.log('[sk08.lee] addvisibilitychangeListener');

    document.addEventListener('visibilitychange', function() {
        console.log('[sk08.lee] visibilitychange');

        if(media != -1 || music != -1) {
            if(document.hidden){
                console.log('[sk08.lee] document.hidden');

                webapis.avplay.suspend();
            } else {
                console.log('[sk08.lee] document.visible');

                webapis.avplay.restore();
            }
        }
    });
}

function changeFocus() {
    console.log('[sk08.lee] changeFocus');

    if(contentIndex == 1) {
        document.getElementById('musicVideo').style.color = '#00a9ef';
        document.getElementById('PhotoSlide').style.color = '#ffffff';
        document.getElementById('goToToast').style.color = '#ffffff';
    } else if(contentIndex == 2) {
        document.getElementById('musicVideo').style.color = '#ffffff';
        document.getElementById('PhotoSlide').style.color = '#00a9ef';
        document.getElementById('goToToast').style.color = '#ffffff';
    } else if(contentIndex == 3) {
        document.getElementById('musicVideo').style.color = '#ffffff';
        document.getElementById('PhotoSlide').style.color = '#ffffff';
        document.getElementById('goToToast').style.color = '#00a9ef';
    }

    // tk
    // let _container = document.getElementById('description');
    // for(let i = 0; i < _container.children.length; ++i){
    //   if(i == contentIndex - 1){
    //     _container.children[i].style.color = '#00a9ef'
    //   }
    //   else
    //     _container.children[i].style.color = '#ffffff'
    // }

    // let _container = document.getElementById('description');
    // for(let _child of _container.children){
    //   _child.style.color = '#ffffff';
    // }
    // _container.children[contentIndex - 1].style.color = '#00a9ef';
}

function doAction() {
    console.log('[sk08.lee] doAction');

    if(contentIndex == 1) {
        document.getElementById('logo').src  = 'http://168.219.241.233/~sk08.lee/contents/image/toastLogo_hover.png';

        pageIndex = 'media';
        playMedia();
    } else if(contentIndex == 2) {
        document.getElementById('logo').src  = 'http://168.219.241.233/~sk08.lee/contents/image/toastLogo_hover.png';

        pageIndex = 'photo';
        showPhoto();
    } else if(contentIndex == 3) {
        jumpBrowser();
    }
}

function returnAction() {
    console.log('[sk08.lee] returnAction');

    if(pageIndex == 'main') {
        toast.application.exit();
    }
    else if(pageIndex == 'media') {
        document.getElementById('logo').src  = 'http://168.219.241.233/~sk08.lee/contents/image/toastLogo.png';

        stopMedia();
        pageIndex = 'main';
    }
    else if(pageIndex == 'photo') {
        document.getElementById('logo').src  = 'http://168.219.241.233/~sk08.lee/contents/image/toastLogo.png';

        hidePhoto();
        pageIndex = 'main';
    }
}
