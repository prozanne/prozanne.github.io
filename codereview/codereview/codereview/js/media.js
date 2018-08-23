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

var mediaDiv = -1;
var media = -1;
var mediaContainer = -1;

var loadingDiv = -1;

var mediaInx = 1;
var mediaLeng = 7;

var fullResolution = ['0%', '0%', '100%', '100%'];

function playMedia() {
    console.log('[sk08.lee] playMedia');

    mediaDiv = document.createElement('div');
    mediaDiv.id = 'playerDiv';
    document.body.appendChild(mediaDiv);

    loadingDiv = document.createElement('img');
    loadingDiv.id = 'loadingBar';
    document.getElementById('playerDiv').appendChild(loadingDiv);
    document.getElementById('loadingBar').src = 'http://168.219.241.233/~sk08.lee/contents/image/loading.png';

    media = toast.Media.getInstance();
    media.open('http://168.219.241.233/~sk08.lee/contents/media/' + mediaChange() + '.mp4');

    mediaContainer = media.getContainerElement();
    mediaContainer.style.position = 'fixed';
    mediaContainer.style.left = fullResolution[0];
    mediaContainer.style.top = fullResolution[1];
    mediaContainer.style.width = fullResolution[2];
    mediaContainer.style.height = fullResolution[3];
    document.body.appendChild(mediaContainer);

    media.syncVideoRect(); //for supporting 2013's sectv-orsay

    media.setListener({
        onevent: function(evt) {
            switch(evt.type) {
                case 'STATE':
                    if(evt.data.state == 'IDLE' || evt.data.state == 'PAUSED') {
                    }
                    else if(evt.data.state == 'PLAYING') {
                        document.getElementById('loadingBar').style.visibility  = 'hidden';
                    }

                    break;
                case 'DURATION':
                    break;
                case 'POSITION':
                    break;
                case 'BUFFERINGPROGRESS':
                    break;
                case 'ENDED':
                    document.getElementById('loadingBar').style.visibility  = 'visible';
                    nextMedia();
                    break;
            }
        },
        onerror: function(err) {
            console.error('[sk08.lee] mediaError is occured: ' + JSON.stringify(err));
        }
    });

    media.play();
    //You don't have to call setScreenSaver Method. It is configurated by toast.avplay.
}

function stopMedia() {
    console.log('[sk08.lee] stopMedia');

    media.stop();
    media = -1;
    document.body.removeChild(mediaDiv);
    document.body.removeChild(mediaContainer);
}

function nextMedia() {
    console.log('[sk08.lee] nextMedia');

    media.stop();

    media.open('http://168.219.241.233/~sk08.lee/contents/media/' + mediaChange() + '.mp4');
    media.play();
    //You don't have to call setScreenSaver Method. It is configurated by toast.avplay.
}

function mediaChange() {
    console.log('[sk08.lee] mediaChange');
    
    mediaInx = Math.floor((Math.random() * mediaLeng) + 1);

    return mediaInx;
}
