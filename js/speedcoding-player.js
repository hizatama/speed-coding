window.SpeedCodingPlayer = function(mine, playerData){

  playerData = playerData || {
    id: undefined,
    name: undefined,
    observe: undefined,
    editorSetting: undefined,
  };

  var self = new function SpeedCodingPlayer(){};

  self.id = undefined;
  self.name = undefined;
  self.observe = undefined;
  self.editor = undefined;
  self.editorId = undefined;
  self.editorWrapperId = undefined;
  // self.stream = undefined;
  // self.elemStream = undefined;

  // status
  self.finished = false;
  self.success = false;

  self.init = function(mine, playerData) {

    self.id = playerData.id;
    self.name = playerData.name;
    self.observe = playerData.observe;
    if(!self.observe){
      // self.streamId = 'stream_'+playerData.id;
      self.editorId = 'editor_'+playerData.id;
      self.editorWrapperId = 'editorWrapper_'+playerData.id;

      $('<div>').attr({
        'id': self.editorWrapperId,
        'class': 'editorWrapper'
      }).append($('<div>').attr({
        'id': self.editorId,
        'class': 'editor'
      }))
      .appendTo('#editorWrapper');

      $('<div>').attr({
        'class': 'editorResult'
      }).hide().appendTo('#'+self.editorId);

      self.editor = new SpeedCodingEditor(self.editorId);

      if(mine){
        self.editor.setEnable();
        self.setPlayerData();
      }

      self.setEventHandlers();
    }else if(mine){
      self.setPlayerData();
    }

  }

  self.setEventHandlers = function() {

    if(mine){
      self.editor.editor.getSession().on('change', function(){
        $(self.editor.elemEditor).trigger('sc.player-editor-change');
      });
    }
  }

  self.setPlayerData = function() {
    // プレイヤー名
    if(! (self.name = Cookies.get('playerName'))){
      while(! (self.name = prompt('input your name')));
      Cookies.set('playerName', self.name);
    }

    // エディタ設定
    var editorSetting = Cookies.getJSON('editorSetting');
    if(typeof editorSetting == "object"){
      self.editor.setEditorSetting(editorSetting);
    }
  }

  self.updateEditorText = function(editorText){
    self.editor && self.editor.editor.setValue(editorText);
  }

  self.getEditorText = function(){
    return self.editor.editor.getValue();
  }

  self.fail = function(){
    $('.editorResult',"#"+self.editorWrapperId).addClass('fail').fadeIn(500);
    self.editor.setDisable();
  }

  self.success = function(){
    $('.editorResult',"#"+self.editorWrapperId).addClass('success').fadeIn(500);
    self.editor.setDisable();
  }

  self.destroy = function(){
    self.editor && self.editor.elemEditor.remove();
  }

  self.init(mine, playerData);
  return self;
};