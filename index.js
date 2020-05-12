var express = require('express');
var app = express();

var expressHbs = require('express-handlebars');
var hbs = require('hbs');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + 'views/partials');
app.engine('hbs', expressHbs(
    {
        layoutsDir: 'views/layouts',
        defaultLayout: 'layout',
        extname: 'hbs'
    }
))

app.get('/', (req, res) => {
    res.render('home.hbs', {title: 'Home'});
});
app.get('/chat', (req, res) => {
res.render('chat.hbs', {title: 'Our Chat'});
});

connections = [];
io.sockets.on('connection', function(socket) {
    console.log("Connection");
    connections.push(socket);

    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnect");
    });

    socket.on('send mess', function(data) {
        io.sockets.emit('add mess', {mess: data.mess, name: data.name, className: data.className});
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {title: 'About Us'});
});