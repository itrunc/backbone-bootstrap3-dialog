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
            width: '200px',
            type: Dialog.BG_TYPE.PRIMARY
          }).open();
        }
      }).el);
    }
  });
  new App;
  Backbone.history.start();
});