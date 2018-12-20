const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 4444;
var {generateMessage, generateLocationMessage} = require('./utils/message');
var {isRealString} = require('./utils/validation');
var {Users} = require('./utils/users');

var app = express();
const server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

io.on('connection', (socket) => {
  console.log('A new user connected');

  socket.on('join', (param, callback) => {
    if (!isRealString(param.name) || !isRealString(param.room)){
      callback('Invalid name or room');
    }
    socket.join(param.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,param.name,param.room);

    io.to(param.room).emit('updateUserList', users.getUserList(param.room));
    socket.emit('newMessage',generateMessage('Admin','Welcome to the Chat App'));
    socket.broadcast.to(param.room).emit('newMessage',generateMessage('Admin',`${param.name} has joined`));
    callback();

  });

  socket.on('createMessage',(message) => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage',generateMessage(user.name,message.text)); 
    }
  });

  socket.on('createLocationMessage', (location) => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name, location.latitude, location.longitude));
    }
  });

  socket.on('disconnect',() => {
    var user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
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
