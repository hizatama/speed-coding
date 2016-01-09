window.SpeedCoding = function(){

  var self = new function SpeedCoding(){};
  
  self.players = {};
  self.myPlayer = undefined;
  self.loader = undefined;
  self.peer = undefined;
  self.chat = undefined

  self.init = function() {

    self.myPlayer = new SpeedCodingPlayer(true);
    self.chat = new SpeedCodingChat();

    // initialize game
    self.setEventHandlers();

    // connect skyway
    self.joinRoom();
  }

  self.setEventHandlers = function(){
    $(window).on('load', function(){
      self.endLoading();
    });

  }

  self.playerJoin = function(playerData){
      // プレイヤー追加

      /* 
      playerData = {
        id: '',
        name: '',
        editorSetting,
        peer,
        stream
      }
      */

      // すでに追加済みの場合はupdateする
      if(self.players[playerData.id]) {
        self.players[playerData.id].update();
        return;
      }

      self.players[playerData.id] = new SpeedCodingPlayer(false, playerData);
      self.chat.add(playerData.name + 'が入室しました');
  }

  self.playerFail = function(id){
    // プレイヤーの窓にFail表示
    self.chat.add(self.players[id].name + 'はfailに終わりました。');
    self.players[id].fail();
  }

  self.playerSuccess = function(id){
    // プレイヤーの窓にSuccess表示
    self.chat.add(self.players[id].name + 'がSuccess！！');
    self.players[id].success();
  }

  self.playerUpdate = function(player){
    // プレイヤーの状況を更新
    self.players[player.id] = player;
    self.updatePlayer();
  }

  self.playerEditorChanged = function(id, editorText){
    self.players[id].updateEditor(editorText);
  }

  self.start = function(){
    self.editor.setEnable();
  }

  self.end = function(){
    self.editor.setDisable();
  }




  self.endLoading = function(){
    $("#loading").slideUp(300);
  }
  self.beginLoading = function(){
    $("#loading").slideDown(300);
  }

  self.joinRoom = function(){
    self.peer = new MultiParty( {
      "key": "1868c327-4c09-4182-95aa-12913c96f374" ,
      "reliable": true,
      "room": "speed-coding"
    });

    self.peer.send({
      event: 'player-join',
      playerData: {
        id: self.peer.id,
        name: self.myPlayer.name
      }
    });

    self.peer.on('my_ms', function(video){

    }).on('peer_ms', function(video){

    }).on('peer_close', function(peerId){

    }).on('data', function(data){
      if(!data.event)return;

      switch(data.event){
        case 'player-join':
          self.playerJoin(data.playerData);
          break;
        case 'player-success':
          self.playerSuccess(data.id);
          break;
        case 'player-fail':
          self.playerFail(data.id);
          break;
        case 'player-update':
          self.playerUpdate(data.playerData);
          break;
        case 'player-editor-change':
          self.playerEditorChange(data.id, data.editorText);
          break;
      }
    });
  }

  self.init();
  return self;
};

$(function(){
  window.speedCoding = new SpeedCoding();
});
