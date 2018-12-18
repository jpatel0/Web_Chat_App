var generateMessage = (from,text) => {
  var message = {
    from,
    text,
    createdAt : new Date().getTime()
  };
  return message;
};

var generateLocationMessage = (from,latitude,longitude) => {
  var message = {
    from,
    url : `https://www.google.com/maps?q=${latitude},${longitude}`
  };
  return message;
};

module.exports = {generateMessage, generateLocationMessage};
