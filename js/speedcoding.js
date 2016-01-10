/// customize
MultiParty.prototype.sendToPeer = function(peerId, data){
  if(this.peers[peerId] && this.peers[peerId].DCconn)
    this.peers[peerId].DCconn.send(data);
}

window.SpeedCoding = function(){

  var self = new function SpeedCoding(){};
  
  self.players = {};
  self.myPlayer = undefined;
  self.loader = undefined;
  self.peer = undefined;
  self.chat = undefined;

  self.observe = false;

  self.init = function() {

    self.observe = location.search.indexOf('observer') > 0 ;

    self.initUserInterface();

    self.chat = new SpeedCodingChat();

    // initialize game
    self.setEventHandlers();

    // connect skyway
    self.joinRoom();
  }

  self.initUserInterface = function(){

    // オブザーバー
    if(self.observe){
      $('html').addClass('modeObserver');
      $('.players_ui').hide();
      $('.observers_ui').show();
    } else {
      $('html').addClass('modePlayer');
      $('.players_ui').show();
      $('.observers_ui').hide();
    }
  }

  self.setEventHandlers = function(){
    $(window).on('load', function(){
      self.endLoading();
    }).on('unload',function(){});

    $(document).on('sc.player-editor-change', '.editor', function(){
      $(this).parent('#otherEditorWrapper').size() === 0 && 
      self.peer.send({event:'player-editor-change', 
        editorText:self.myPlayer.getEditorText()});
    });

    $('#gameFinish').on('click', function(){
      self.peer.send({event:'player-success'});
      self.playerSuccess(self.peer.peer.id);
    });

    $('#chatSubmit').on('click', self.sendPlayerSpeak);
    $('#chatTextbox').on('keypress', function(e){
      if(e.keyCode == '13'){
        self.sendPlayerSpeak();
      }
    });

  }

  self.sendPlayerSpeak = function(){
    var chatText = $('#chatTextbox').val();
    if(chatText.length){
      self.chat.add(self.myPlayer.name, chatText);
      self.peer.send({event:'player-speak', chatText:chatText});
    }
    $('#chatTextbox').focus().val('');
  }

  self.sendPlayerJoinData = function(peerId){
    var playerData = self.myPlayer;
    console.debug('sendPlayerJoin to '+peerId);
    self.peer.sendToPeer(peerId, {
      event: 'player-join',
      playerData: {
        id: playerData.id,
        name: playerData.name,
        observe: playerData.observe
      } 
    });

    if(!self.players[peerId]){
      self.playerRequest(peerId);
    }
  }

  self.playerJoin = function(playerData){
//    if(self.myPlayer.id == playerData.id)return;
    console.debug('playerJoin:'+playerData.name);
    // プレイヤー追加
    /* 
    playerData = {
      id: '',
      name: '',
      editorSetting,
      peer
    }
    */

    // すでに追加済みの場合はupdateする
    if(!self.players[playerData.id]) {
      self.players[playerData.id] = new SpeedCodingPlayer(false, playerData);
      var observeString = playerData.observe ? '(Observer)' : '';
      self.chat.add(playerData.name, '接続しました' + observeString);
    }

    // 自分のデータを返す
    // if(!reply){
    //   console.debug('reply connection for:'+playerData.name);
    //   self.sendPlayerJoinData(playerData.id, self.myPlayer, true);
    // }
  }

  self.playerRequest = function(id){
    console.debug('playerRequest to '+id);
    self.peer.sendToPeer(id, {
      event: 'player-request'
    });
  }

  self.playerFail = function(id){
    var player = (id == self.peer.peer.id) ? self.myPlayer : self.players[id];
    // プレイヤーの窓にFail表示
    self.chat.add(player.name, 'fail＼(^o^)／');
    player.fail();
  }

  self.playerSuccess = function(id){
    var player = (id == self.peer.peer.id) ? self.myPlayer : self.players[id];
    // プレイヤーの窓にSuccess表示
    self.chat.add(player.name, 'Success(・∀・)!!');
    player.success();
  }

  self.playerUpdate = function(player){
    if(!self.players[id]){
      self.playerRequest(id);
      return;
    }
    // プレイヤーの状況を更新
    self.players[player.id] = player;
    self.updatePlayer();
  }

  self.playerEditorChange = function(id, editorText){
    if(id == self.peer.peer.id)return;
    if(!self.players[id]){
      self.playerRequest(id);
      return ;
    }
    self.players[id].updateEditorText(editorText);
  }

  self.playerSpeak = function(id, chatText){
    self.chat.add(self.players[id].name, chatText);
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

    self.peer = new MultiParty({
      "key": "1868c327-4c09-4182-95aa-12913c96f374" ,
      "reliable": true,
      "room": "speed-coding",
      "video": false,
      "audio": false,
      "polling_interval": 5000,
      "debug": 2
    });

    window.multiparty = self.peer;

    self.peer
    .on('open', function(peerId){
      console.debug('my_id:'+peerId);
      self.myPlayer = new SpeedCodingPlayer(true, {
        id: peerId,
        observe: self.observe
      });
      $('#playerName').text(self.myPlayer.name + '['+peerId+']');
    }).on('dc_open', function(peerId){
      console.debug('dc_open:'+peerId);
      self.playerRequest(peerId);
    }).on('dc_close', function(peerId){
      console.debug('dc_close:'+peerId);
      
      if(!self.players[peerId])return;
      self.chat.add(self.players[peerId].name, '切断しました　(^^)ﾉｼ');
      self.players[peerId].destroy();
      self.players[peerId] = false;
    }).on('message', function(msg){
      var data = msg.data;
      if(!data.event)return;

      console.debug('event '+data.event);

      switch(data.event){
        case 'player-join':
          self.playerJoin(data.playerData);
          break;
        case 'player-request':
          self.sendPlayerJoinData(msg.id);
          break;
        case 'player-success':
          self.playerSuccess(msg.id);
          break;
        case 'player-fail':
          self.playerFail(msg.id);
          break;
        case 'player-update':
          self.playerUpdate(data.playerData);
          break;
        case 'player-editor-change':
          self.playerEditorChange(msg.id, data.editorText);
          break;
        case 'player-speak':
          self.playerSpeak(msg.id, data.chatText);
          break;
      }
    }).on('error', function(error){
      alert('error:'+error.message);
      console.error(error);
      location.reload();
    });

    self.peer.start();
  }

  self.init();
  return self;
};

$(function(){
  window.speedCoding = new SpeedCoding();
});
