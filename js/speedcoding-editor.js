window.SpeedCodingEditor = function(editorId){
  
  var self = new function SpeedCodingEditor(){};

  self.editor = undefined,
  self.editorSetting = {
    theme: 'ace/theme/monokai',
    mode: 'ace/mode/javascript'
  };

  self.elemEditor = undefined;
  self.elemEditorTheme = undefined;
  self.elemEditorMode = undefined;

  self.init = function(editorId) {
    // initialize editor
    self._initEditor(editorId);
  }

  /** 
   * エディタ回りの初期化
   */
  self._initEditor = function(editorId) {

    self.elemEditorTheme = $('#editorTheme').val(self.editorSetting.theme);
    self.elemEditorMode = $('#editorMode').val(self.editorSetting.mode);
    self.elemEditor = $('#'+editorId);

    self.editor = ace.edit(editorId);
    self.setEditorTheme(self.editorSetting.theme);
    self.setEditorMode(self.editorSetting.mode);
    self.setDisable();
    self.editor.$blockScrolling = Infinity;

    self.setEventHandlers();
  }

  self.setEventHandlers = function () {

    // エディタの配色変更
    self.elemEditorTheme.on('change', function(){
      self.setEditorTheme($(this).val());
    });

    // シンタックスハイライトの種別変更
    self.elemEditorMode.on('change', function(){
      self.setEditorMode($(this).val());
    });

  }

  self.setEditorTheme = function(theme){
    self.editor.setTheme(theme);
    self.editorSetting.theme = theme;
  }

  self.setEditorMode = function(mode){
    self.editor.getSession().setMode(mode);
    self.editorSetting.mode = mode;
  }

  self.setEditorSetting = function(setting){
    self.editorSetting = $.extend(self.editorSetting, setting);
  }

  self.setEnable = function(){
    self.editor.setReadOnly(false);
  }

  self.setDisable = function(){
    self.editor.setReadOnly(true);
  }

  self.init(editorId);
  return self;
};