var socket = io();

socket.on('connect', function() {
  console.log('Connected to the server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('New ,Email logged:', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from} : ${message.text}`);
  jQuery('#messageList').append(li);
});

jQuery('#messageForm').on('submit', function(event) {
  event.preventDefault();
  var messageSelector = jQuery('[name=message]');
  socket.emit('createMessage',{
    from : 'user',
    text : messageSelector.val()
  });
  messageSelector.val('');
});
