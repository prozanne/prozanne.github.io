function showADPopup() {
    // window.open("./popup.html", "_blank", "width=300, height=500, toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=no, left=0, top=0");
}

function allowNotification() {
    Notification.requestPermission().then(function(result) {
        // 알람 권한 받기
        if(result === 'granted') {
            setTimeout(function() {
                var currentTime = new Date();
                var notifTitle = 'TOAST PWA';
                var notifBody = 'This is for TOAST Notification ! Current time is ' + currentTime;
                var notifImg = 'assets/icon-128x128.png';
                var options = {
                    body: notifBody,
                    icon: notifImg
                }
                var notif = new Notification(notifTitle, options);
            }, 30000);
        }
    });
}