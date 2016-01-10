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
    self.elemChat.prepend($('<p>').addClass('chatRow')
        .html('<span class="userName">'+userName+'</span><span class="chatText">' +message+'</span>'));
    console.log(userName + ':' + message);
  }

  self.init();
  return self;
};