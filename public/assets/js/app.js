$(document).ready(function(){
    var auth2; // The Sign-In object.

    var firebaseConfig = {
        apiKey: "AIzaSyBBleE6QyUDi-TM8q8XBU0x7aUolYIE9Xg",
        authDomain: "travelmantics-1234.firebaseapp.com",
        databaseURL: "https://travelmantics-1234.firebaseio.com",
        projectId: "travelmantics-1234",
        storageBucket: "travelmantics-1234.appspot.com",
        messagingSenderId: "560765848921",
        appId: "1:560765848921:web:58fbb678f250108b4f1048"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 150,
        height : 150
    });

    $('#google-button').hide();

    $('#btn-partager').click(signOut);

    function onSuccess(googleUser) {
        var user = googleUser.getBasicProfile();
        $('#name').text(user.getGivenName() + ' ' + user.getFamilyName());
        $('#email').text(user.getEmail());
        $('#image').prop('src', user.getImageUrl());
        writeUserData(user);
        qrcode.makeCode(user.getId());
        $('.content').show();
        $('#google-button').hide();
    }

    function onFailure(error) {
        console.log(error);
    }

    function renderButton() {

        gapi.load('auth2', function(){
           
            auth2 = gapi.auth2.init({
                client_id: '252458884092-m70iueuiq53d7qsecs8v7k6bgagrced6.apps.googleusercontent.com'
            });
    
            if (auth2) {
                gapi.auth2.getAuthInstance().then(function(googleAuth){
                    var isSignedIn = googleAuth.isSignedIn.get();
                    if (!isSignedIn) {
                        $('#google-button').show();
                    }
                }, function(e){
                    console.log('GoogleAuth loading failed ...');
                });
            } else {
                console.log("auth2 not loaded");
            }
        });

        gapi.signin2.render('google-button', {
            'scope': 'profile email',
            'longtitle': true,
            'onsuccess': onSuccess,
            'onfailure': onFailure
        });
    }

    function signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
            location.reload();
        });
    }

    function writeUserData(user) {
        var data = {
            firstname: user.getGivenName() || "",
            lastmame: user.getFamilyName() || "",
            email: user.getEmail() || "",
            image : user.getImageUrl() || ""
        };
        firebase.database().ref('mesinfos/users/' + user.getId()).set(data);
    }

    renderButton();

    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
      scanner.addListener('scan', function (content) {
        alert(content);
      });
      Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
        } else {
          console.error('No cameras found.');
        }
      }).catch(function (e) {
        console.error(e);
      });
});