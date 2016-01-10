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
  self.mine = undefined;
  // self.stream = undefined;
  // self.elemStream = undefined;

  // status
  self.finished = false;
  self.successed = false;

  self.init = function(mine, playerData) {

    self.id = playerData.id;
    self.name = playerData.name;
    self.observe = playerData.observe;
    self.mine = !!mine;
    if(!self.observe){
      // self.streamId = 'stream_'+playerData.id;
      self.editorId = 'editor_'+playerData.id;
      self.editorWrapperId = 'editorWrapper_'+playerData.id;
      var editorclass = mine ? ' myEditor s12': ' s4';

      var elemEditorWrapper = $('<div>').attr({
        'id': self.editorWrapperId,
        'class': 'editorWrapper col' + editorclass
      });

      var elemEditor = $('<div>').attr({
        'id': self.editorId,
        'class': 'editor'
      }).appendTo(elemEditorWrapper);

      $('#editorWrapper').append(elemEditorWrapper);

      self.editor = new SpeedCodingEditor(self.editorId);

      // 結果表示用要素
      elemEditor.append($('<div>').attr({'class': 'editorResult'}).hide());

      // 名前表示用要素
      elemEditor.append($('<span>').attr({'class': 'playerName'}).text(self.name));


      if(mine){
        self.editor.setEnable();
        self.editor.editor.setValue('// input your code here');
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

  self.checkAnswer = function(){
    if(self.finished)return;

    var result = false,
      usersCode = self.editor.editor.getValue(),
      testCode = `(function(){
        ${usersCode};
        if(func(0,100)!==5050)return false;
        if(func(100,0)!==5050)return false;
        if(func(0,1)!==1)return false;
        if(func(1,0)!==1)return false;
        if(func(-10,5)!==-40)return false;
        if(func(5,-10)!==-40)return false;
        if(func(-102, 18002)!==162039750)return false;
        if(func(18002, -102)!==162039750)return false;
        return true;
        })()`;
    try{
      result = eval(testCode);
    }catch(e){
      //noop
    }
    return result;
  }

  self.fail = function(){
    self.finished = true;
    $('.editorResult',"#"+self.editorWrapperId).addClass('fail').fadeIn(500);
    self.editor.setDisable();
  }

  self.success = function(){
    self.finished = true;
    self.successed = true;
    $('.editorResult',"#"+self.editorWrapperId).addClass('success').fadeIn(500);
    self.editor.setDisable();
  }

  self.reset = function(){
    self.finished = false;
    self.successed = false;
    self.mine && self.editor.setEnable();
    $('.editorResult',"#"+self.editorWrapperId)
    .removeClass('success fail').fadeOut(500);
  }

  self.destroy = function(){
    // self.editor && self.editor.elemEditor.remove();
    $("#"+self.editorWrapperId).remove();
  }

  self.init(mine, playerData);
  return self;
};