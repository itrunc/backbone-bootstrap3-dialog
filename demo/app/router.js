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
      console.log(Dialog);
      $('#main').append(Dialog.Button.create({
        action: function() {
          Dialog.Dialog.create().open();
        }
      }).el);
    }
  });
  new App;
  Backbone.history.start();
});