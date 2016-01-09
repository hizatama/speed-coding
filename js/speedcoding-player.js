window.SpeedCodingPlayer = function(mine, playerData){

  playerData = playerData || {
    id: undefined,
    name: undefined,
    editorSetting: undefined,
    peer: undefined,
  };

  var self = new function SpeedCodingPlayer(){};

  self.editor = undefined;
  self.editorId = undefined;
  self.name = undefined;
  self.stream = undefined;
  self.peer = undefined;

  // status
  self.finished = false;
  self.success = false;

  self.init = function() {

    self.editorId = mine ? 'editor': 'editor_'+playerData.id;
    var wrapperSelector = mine ? '#myEditorWrapper': '#otherEditorWrapper';

    $('<div>').attr({
      'id': self.editorId,
      'class': 'editor'
    }).appendTo(wrapperSelector);

    self.editor = new SpeedCodingEditor(self.editorId);
  }

  self.setEventHandlers = function() {

  }

  self.setPlayerData = function() {
    // sessionを確認

    // プレイヤー名
    if(! (self.name = Cookies.get('playerName'))){
      while(! (self.name = prompt('input your name')));
      Cookies.set('playerName', self.name);
    }
    $('#playerName').text(self.name);

    // エディタ設定
    var editorSetting = Cookies.getJSON('editorSetting');
    if(typeof editorSetting == "object"){
      self.editor.setEditorSetting(editorSetting);
    }
  }

  self.updateEditor = function(editorText){
    self.editor.setValue(editorText);
  }

  self.fail = function(){

  }

  self.successs = function(){

  }

  self.destroy = function(){
    self.editor.elem
  }

  self.init();
  return self;
};