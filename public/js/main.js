var socket = io();

socket.on('connect', function () {
    var param = jQuery.deparam(window.location.search);
    console.log(param);
    socket.emit('join', param, function(error) {
        if (error){
            alert(error);
            //window.location.href = '/';
        }else { 
            console.log('Welcome');
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

function scrollToBottom() {
    var messages = jQuery('#messageList');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var lastMessageHeight = newMessage.prev().innerHeight();
    var newMessageHeight = newMessage.innerHeight();
    
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight ){
        messages.scrollTop(scrollHeight);
    }
}

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
    scrollToBottom();
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
    scrollToBottom();
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
    sendLocationButtton.attr('disabled','disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        sendLocationButtton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        sendLocationButtton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});
