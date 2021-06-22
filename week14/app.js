const express = require('express');
const path = require('path');
const morgan = require('morgan');

const SocketIO = require('socket.io');

const app = express();
app.set('port', process.env.PORT || 8005);

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});

const io = SocketIO(server);

io.on('connection', (socket) => {
    console.log('새로운 클라이언트 접속!', socket.id);

    io.to(socket.id).emit('welcome', '(From Server) welcome! ' + socket.id);

    socket.on('disconnect', () => {
        console.log('클라이언트 접속 해제', socket.id);
    });

    socket.on('echopush', (msg) => {
        socket.broadcast.emit('echo', msg);
        io.emit('echo', msg);
        socket.emit('echo', msg);
    })
})