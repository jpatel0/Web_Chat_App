var generateMessage = (from,text) => {
  var message = {
    from,
    text,
    createdAt : new Date().getTime()
  };
  return message;
};

module.exports = {generateMessage};
