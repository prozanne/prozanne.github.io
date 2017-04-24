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

var timeout0 = -1;
var timeout1 = -1;
var timeout2 = -1;
var timeout3 = -1;
var timeout4 = -1;
var timeout5 = -1;

var photoInx = 1;
var photoLeng = 124;

var photoDiv;

var music = -1;

function showPhoto() {
    console.log('[sk08.lee] showPhoto');

    photoDiv = document.createElement('div');
    photoDiv.id = 'photoDiv';
    document.body.appendChild(photoDiv);

    var slide0 = document.createElement('img');
    slide0.id = 'slide0';
    slide0.src = 'http://168.219.241.233/~sk08.lee/contents/photo/' + photoChange() + '.png';
    photoDiv.appendChild(slide0);

    var slide1 = document.createElement('img');
    slide1.id = 'slide1';
    slide1.src = 'http://168.219.241.233/~sk08.lee/contents/photo/' + photoChange() + '.png';
    photoDiv.appendChild(slide1);

    var slide2 = document.createElement('img');
    slide2.src = 'http://168.219.241.233/~sk08.lee/contents/photo/' + photoChange() + '.png';
    slide2.id = 'slide2';
    photoDiv.appendChild(slide2);
    document.getElementById('slide2').style.visibility  = 'hidden';
    //
    // let _slide = null;
    // for(let i = 1; i <= 3; ++i){
    //   _slide = document.createElement('img');
    //   _slide.id = 'slide' + i;
    //   _slide.src = 'http://168.219.241.233/~sk08.lee/contents/photo/' + photoChange() + '.png';
    //   photoDiv.appendChild(_slide);
    // }
    //_slide.getElementById('slide2').style.visibility = 'hidden';

    timeout0 = setTimeout(function () {
        playMusic();

        document.getElementById('slide0').style.left  = '0px';
        document.getElementById('slide1').style.left  = '1920px';
        document.getElementById('slide2').style.left  = '3840px';

        sliding(1);
    }, 3000);
}

function sliding (order) {
    console.log('[sk08.lee] sliding');



    if (order == 0) {
        timeout0 = setTimeout(function () {
            document.getElementById('slide2').src  = 'http://168.219.241.233/~sk08.lee/contents/photo/' + photoChange() + '.png';
            document.getElementById('slide2').style.visibility  = 'hidden';
            document.getElementById('slide1').style.visibility  = 'visible';
        }, 2000);

        timeout1 = setTimeout(function () {
            document.getElementById('slide0').style.left  = '0px';
            document.getElementById('slide1').style.left  = '1920px';
            document.getElementById('slide2').style.left  = '3840px';

            sliding(1);
        }, 5000);
    }
    else if (order == 1) {
        timeout2 = setTimeout(function () {
            document.getElementById('slide0').src  = 'http://168.219.241.233/~sk08.lee/contents/photo/' + photoChange() + '.png';
            document.getElementById('slide0').style.visibility  = 'hidden';
            document.getElementById('slide2').style.visibility  = 'visible';
        }, 2000);

        timeout3 = setTimeout(function () {
            document.getElementById('slide0').style.left  = '3840px';
            document.getElementById('slide1').style.left  = '0px';
            document.getElementById('slide2').style.left  = '1920px';
            sliding(2);
            console.log("hi", timeout3);
            clearTimeout(timeout3);
        }, 5000);
    }
    else if (order == 2) {
        timeout4 = setTimeout(function () {
            document.getElementById('slide1').src  = 'http://168.219.241.233/~sk08.lee/contents/photo/' + photoChange() + '.png';
            document.getElementById('slide1').style.visibility  = 'hidden';
            document.getElementById('slide0').style.visibility  = 'visible';
        }, 2000);

        timeout5 = setTimeout(function () {
            document.getElementById('slide0').style.left  = '1920px';
            document.getElementById('slide1').style.left  = '3840px';
            document.getElementById('slide2').style.left  = '0px';
            sliding(0);
            console.log("end", timeout3);
        }, 5000);
    }
    // timeout0 = setTimeout(function() {
    //   let _index = order + 1 > 2 ? 0 : order + 1;
    //   photoDiv.children[(_index + 1)%3].src = 'http://168.219.241.233/~sk08.lee/contents/photo/' + photoChange() + '.png';
    //   photoDiv.children[(_index + 1)%3].style.visibility  = 'hidden';
    //   photoDiv.children[_index].style.visibility  = 'hidden';
    // }, 2000);
    //
    // timeout1 = setTimeout(function() {
    //   photoDiv.children[0].style.left = ((order + 1) % 3) * 1920) + "px";
    //   photoDiv.children[1].style.left = ((order + 2) % 3) * 1920) + "px";
    //   photoDiv.children[1].style.left = ((order + 3) % 3) * 1920) + "px";
    //   sliding((order + 1) % 3);
    // }, 5000);
}

function hidePhoto() {
    console.log('[sk08.lee] hidePhoto');

    stopMusic();

    if (timeout0 != -1) {
        clearTimeout(timeout0);
        timeout0 = -1;
    }
    if (timeout1 != -1) {
        clearTimeout(timeout1);
        timeout1 = -1;
    }
    if (timeout2 != -1) {
        clearTimeout(timeout2);
        timeout2 = -1;
    }
    // if (timeout3 != -1) {
    //     clearTimeout(timeout3);
    //     timeout3 = -1;
    // }
    if (timeout4 != -1) {
        clearTimeout(timeout4);
        timeout4 = -1;
    }
    if (timeout5 != -1) {
        clearTimeout(timeout5);
        timeout6 = -1;
    }

    document.body.removeChild(photoDiv);
}

function photoChange() {
    console.log('[sk08.lee] photoChange');

    photoInx = Math.floor((Math.random() * photoLeng) + 1);

    return photoInx;
}

function playMusic() {
    console.log('[sk08.lee] playMusic');

    music = toast.Media.getInstance();
    music.open('http://168.219.241.233/~sk08.lee/contents/media/' + mediaChange() + '.mp4');

    music.setListener({
        onevent: function(evt) {
            switch(evt.type) {
                case 'STATE':
                    break;
                case 'DURATION':
                    break;
                case 'POSITION':
                    break;
                case 'BUFFERINGPROGRESS':
                    break;
                case 'ENDED':
                    nextMusic();
                    break;
            }
        },
        onerror: function(err) {
            console.error('[sk08.lee] musicError is occured: ' + JSON.stringify(err));
        }
    });

    music.play();
    //You don't have to call setScreenSaver Method. It is configurated by toast.avplay.
}

function stopMusic() {
    console.log('[sk08.lee] stopMusic');

    music.stop();
    music = -1;
}

function nextMusic() {
    console.log('[sk08.lee] nextMusic');

    music.stop();

    music.open('http://168.219.241.233/~sk08.lee/contents/media/' + mediaChange() + '.mp4');
    music.play();
    //You don't have to call setScreenSaver Method. It is configurated by toast.avplay.
}
