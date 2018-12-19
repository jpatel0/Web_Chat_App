const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 4444;
var {generateMessage, generateLocationMessage} = require('./utils/message');
var {isRealString} = require('./utils/validation');

var app = express();
const server = http.createServer(app);
var io = socketIO(server);


io.on('connection', (socket) => {
  console.log('A new user connected');

  socket.on('join', (param, callback) => {
    if (!isRealString(param.name) || !isRealString(param.room)){
      callback('Invalid name or room');
    }
    callback();
  });

  socket.emit('newMessage',generateMessage('Admin','Welcome to the Chat App'));

  socket.broadcast.emit('newMessage',generateMessage('Admin','A new user has joined'));

  socket.on('createMessage',(message) => {
    io.emit('newMessage',generateMessage(message.from,message.text));
  });

  socket.on('createLocationMessage', (location) => {
    console.log(location);
    io.emit('newLocationMessage',generateLocationMessage('Admin', location.latitude, location.longitude));
  });

  socket.on('disconnect',() => {
    console.log('A client disconnected');
  });

});
//console.log(publicPath);

/*app.get('/', (req,res) => {
  res.send(`${publicPath}\\index.html`);
});*/

app.use(express.static(publicPath));
server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
