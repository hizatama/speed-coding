window.SpeedCodingChat = function(){

  var self = new function SpeedCodingChat(){};

  self.elemChat = undefined;

  self.init = function() {
    self.elemChat = $('#chat');
    self.clear();

    self.setEventHandlers();
  }

  self.setEventHandlers = function () {

  }

  self.clear = function() {
    self.elemChat.text('');
  }

  self.add = function(userName, message){
    self.elemChat.append($('div').text(userName + ':' + message));
  }

  self.init();
  return self;
};