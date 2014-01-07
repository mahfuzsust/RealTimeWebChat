/**
 * Created by mahfuzur.rahman on 1/2/14.
 */
(function () {
    "use strict";


    var express = require("express");
    var app = express();

    var users = [];
    var name_of_user;

    app.configure(function () {
        app.use(express.cookieParser());
        app.use(express.session({secret: 'secret', key: 'express.sid'}));
    });

    var port = process.env.PORT || 3700;
    console.log("port:" + port);

    var io = require('socket.io').listen(app.listen(port));


    io.set('authorization', function (handshake, accept) {

        if (handshake.headers.cookie) {

            console.log(handshake);
            var x = getCookie("chat", handshake);
            name_of_user = new Buffer(x, 'base64').toString('ascii');
            console.log("xyz: " + name_of_user);

        } else {
            return accept('No cookie transmitted.', false);
        }

        accept(null, true);
    });



    io.sockets.on('connection', function (socket) {

        console.log("data of " + name_of_user);
        users.push({"data": name_of_user, "socket": socket});
        socket.emit('message', { message: 'welcome to the chat' });
        socket.on('send', function (data) {
            console.log(users);
            for (var i = 0; i < users.length; i++) {
                if (users[i].data == data.username || users[i].data == data.recipient) {
                    var socket = users[i].socket;
                    socket.emit('message', data);
                }
            }
        });

    });

    app.set('views', __dirname + '/tpl');
    app.engine('html', require('ejs').renderFile);

    app.get('/', function (req, res) {
        res.render('page.html');
    });

    app.use(express.static(__dirname + '/tpl'));


    function getCookie(cname, handshake) {
        var name = cname + "=";
        var ca = handshake.headers.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }


}());

