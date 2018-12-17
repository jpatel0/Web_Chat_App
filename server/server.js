const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 4444;


var app = express();
const http = require('http');
const server = http.createServer(app);
var io = socketIO(server);


io.on('connection', (socket) => {
  console.log('A new user connected');
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
