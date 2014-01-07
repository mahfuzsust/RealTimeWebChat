/**
 * Created by mahfuzur.rahman on 1/2/14.
 */

var socket = null;

function run() {

    var messages = [];
    //var socket = io.connect('http://quiet-harbor-7798.herokuapp.com/');
    var recipeintname = document.getElementById("recipeintname");
    var register = document.getElementById("register");
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");

    console.log("inside run");

    socket.on('message', function (data) {
        if (data.message) {
            messages.push(data);
            var html = '';
            for (var i = 0; i < messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.onclick = function () {

        var text = field.value;
        var recipeint = recipeintname.value;
        //alert(recipeint);
        socket.emit('send', { message: text, username: name.value, recipient: recipeint });

    };


}
function writeCookie(value, days) {
    // days indicates how long the user's session should last
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = "chat=" + btoa(value) + expires + "; path=/";
}


function RegisterUser() {
    var namevalue = document.getElementById("name").value;
    var register = document.getElementById("register");
    //alert(namevalue);
    //var namevalue = "mahfuz";
    if (namevalue == "") {
        alert("Please type your name!");
    }
    else {

        writeCookie(namevalue, 1);
        socket = io.connect('http://quiet-harbor-7798.herokuapp.com/');
        //socket = io.connect('http://localhost:3700');

        socket.on('connect', function() {
            console.log('connected');
        });
        register.disabled = true;

        run();

    }
}
