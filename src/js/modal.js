(function( global, factory ) {

  global.bsModal = factory();

}(bsGlobal, function( ) {

  var global = bsGlobal || {};

  var _Modal = Backbone.View.extend({
    tagName: 'div',
    className: 'modal fade',
    initialize: function(options) {
      var self = this;

      var labelledby = 'ModalLabel_' + this.cid;

      var defaults = {
        title: 'Dialog Title',
        message: '',
        type: global.textType.DEFAULT,
        buttons: [{
          label: 'Close',
          type: global.buttonType.DEFAULT,
          action: function(self, context) {
            context.close();
          }
        }],
        backdrop: true,
        keyboard: true,
        autodestroy: true,
        width: '',
        cssClass: '',
        onShow: null,
        onShown: null,
        onHide: null,
        onHidden: null,
        onLoaded: null
      };

      global.modalOptions = _.extend({}, defaults, options);

      var template = {
        main: '<div class="modal-dialog" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="<%-labelledby%>"><div class="modal-content"></div></div>',
        header: '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="<%-labelledby%>"><%-title%></h4></div>',
        body: '<div class="modal-body"></div>',
        footer: '<div class="modal-footer"></div>'
      };

      var me = $(this.el);
      var modalDialog = $(_.template(template.main)({
        labelledby: labelledby
      })).addClass(global.modalOptions.cssClass).appendTo(me);

      if(global.modalOptions.width) {
        modalDialog.css({
          'width': global.modalOptions.width,
          'margin-left': 'auto',
          'margin-right': 'auto'
        });
      }

      var modalContent = me.find('.modal-content').css({
        'border': '0'
      });

      this._header = $(_.template(template.header)({
        labelledby: labelledby,
        title: global.modalOptions.title
      })).addClass(global.modalOptions.type).css({
        'border-radius': '5px 5px 0 0'
      }).appendTo(modalContent);

      this._title = this._header.find('.modal-title');

      this._body = $(template.body).html(global.modalOptions.message).appendTo(modalContent);

      this._footer = $(template.footer).appendTo(modalContent);

      this._buttons = [];

      _.each(global.modalOptions.buttons, function(value) {
        value.context = self;
        var button = global.bsButton.create(value);
        self._footer.append(button.el);
        self._buttons.push(button);
      });

    },
    events: {
      'show.bs.modal': '_onShow',
      'shown.bs.modal': '_onShown',
      'hide.bs.modal': '_onHide',
      'hidden.bs.modal': '_onHidden',
      'loaded.bs.modal': '_onLoaded'
    },
    _onShow: function() {
      if(_.isFunction(global.modalOptions.onShow)) global.modalOptions.onShow(this);
    },
    _onShown: function() {
      if(_.isFunction(global.modalOptions.onShown)) global.modalOptions.onShown(this);
    },
    _onHide: function() {
      if(_.isFunction(global.modalOptions.onHide)) global.modalOptions.onHide(this);
    },
    _onHidden: function() {
      if(_.isFunction(global.modalOptions.onHidden)) global.modalOptions.onHidden(this);
      if(global.modalOptions.autodestroy === true) {
        this.remove();
      }
    },
    _onLoaded: function() {
      if(_.isFunction(global.modalOptions.onLoaded)) global.modalOptions.onLoaded(this);
    },
    open: function() {
      $('body').append(this.el);
      $(this.el).modal({
        show: true,
        backdrop: global.modalOptions.backdrop===true ? true : 'static',
        keyboard: global.modalOptions.keyboard
      });
      return this;
    },
    close: function() {
      $(this.el).modal('hide');
      return this;
    },
    setTitle: function(title) {
      this._title.text(title);
      return this;
    },
    getTitle: function() {
      return this._title.text();
    },
    setMessage: function(message) {
      this._body.html(message);
      return this;
    },
    getModalTitle: function() {
      return this._title;
    },
    getModalHeader: function() {
      return this._header;
    },
    getModalBody: function() {
      return this._body;
    },
    getModalFooter: function() {
      return this._footer;
    },
    getButtonList: function() {
      return this._buttons;
    }
  });

  return {
    create: function(options) {
      return (new _Modal(options));
    },
    extend: function(options) {
      return _Modal.extend(options);
    }
  };
}));