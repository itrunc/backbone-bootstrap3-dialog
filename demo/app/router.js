define(function(require) {
  var setTitle = function(title) {
    $(document).find('title').text(title);
  };

  var App = Backbone.Router.extend({
    routes: {
      '': 'indexPage'
    },
    initialize: function() {},
    indexPage: function() {
      var Dialog = require('BootstrapDialog');
      $('#main').append(Dialog.createButton({
        type: Dialog.BUTTON_TYPE.PRIMARY,
        action: function() {
          Dialog.create({
            backdrop: true,
            keyboard: false,
            type: Dialog.BG_TYPE.PRIMARY,
            buttons: [{
              action: function(self, dialog) {
                console.log(self);
                console.log(dialog);
                var _dialog = Dialog.create({
                  width: '200px'
                }).open();
                console.log(_dialog);
              }
            }]
          }).open();
        }
      }).el);
    }
  });
  new App;
  Backbone.history.start();
});