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
      this.currentApp && this.currentApp.undelegateEvents();
      this.currentApp = require('app/index')();
    }
  });
  new App;
  Backbone.history.start();
});