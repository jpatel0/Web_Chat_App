var socket = io();

socket.on('connect', function () {
    console.log('Connected to the server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from : message.from,
        createdAt : formattedTime,
        text : message.text
    });
    // console.log('New ,Email logged:', message);
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    jQuery('#messageList').append(html);
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-location-template').html();
    var html = Mustache.render(template, {
        from : message.from,
        createdAt : formattedTime,
        url : message.url
    });
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My Current Location</a>');
    // a.attr('href', message.url);
    // li.text(`${message.from}: `);
    // li.append(a);
    jQuery('#messageList').append(html);
});

jQuery('#messageForm').on('submit', function (event) {
    event.preventDefault();
    var messageSelector = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'user',
        text: messageSelector.val()
    });
    messageSelector.val('');
});

var sendLocationButtton = jQuery('#sendLocation');

sendLocationButtton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Your browser doesn\'t support Location');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        alert('Unable to fetch location');
    });
});
