(function( global, factory ) {

  if ( typeof module === "object" && typeof module.exports === "object" ) {
    module.exports = factory()
  } else {
    global.BootstrapDialog = factory();
  }

}(typeof window !== "undefined" ? window : this, function( ) {

  var bsGlobal = {
    type: {
      DEFAULT: 'default',
      PRIMARY: 'primary',
      INFO: 'info',
      SUCCESS: 'success',
      WARNING: 'warning',
      DANGER: 'danger',
      LINK: 'link',
      MUTED: 'muted'
    },
    buttonCategory: {
      BUTTON: 'button',
      SUBMIT: 'submit',
      RESET: 'reset'
    },

    buttonSize: {
      NORMAL: '',
      LARGE: 'btn-lg',
      SMALL: 'btn-sm',
      MINI: 'btn-xs'
    }
  };
  (function( global, factory ) {
  
      global.bsButton = factory();
  
  }(bsGlobal, function( ) {
  
    var global = bsGlobal || {};
  
    var _Button = Backbone.View.extend({
      tagName: 'button',
      className: 'btn',
      iconTemplate: function(icon) {
        if(_.isEmpty(icon)) return '';
        return _.template('<i class="<%-cls%>" aria-hidden="true"></i> ')({
          cls: icon
        });
      },
      initialize: function(options) {
  
        var defaults = {
          cssClass: '',
          label: 'OK',
          icon: '',
          type: global.type.DEFAULT,
          category: global.buttonCategory.BUTTON,
          size: global.buttonSize.NORMAL,
          block: false,
          disabled: false,
          preventDefault: false,
          state: {
            loading: 'loading...'
          },
          context: null, //例如：当被添加到modal中时，可传modal对象进来
          action: null
        };
  
        options = _.extend({}, defaults, options);
  
        var me = $(this.el);
  
        me.attr('type', options.category).append(this.iconTemplate(options.icon)).append(options.label).addClass([
          'btn-'+options.type,
          options.size,
          options.cssClass,
          (options.block?'btn-block':''),
          (options.disabled?'disabled':'')
        ].join(' '));
  
        _.each(options.state, function(value, key){
          me.data(key+'-text', value);
        });
  
        this.context = options.context;
        this.onClick = options.action;
        this.preventDefault = options.preventDefault;
        this.state = options.state;
      },
      events: {
        'click': '_onClick'
      },
      _onClick: function(e) {
        if(_.isFunction(this.onClick)) this.onClick(this, this.context);
        if(this.preventDefault) return false;
      },
      active: function(isActive) {
        var me = $(this.el);
        if(isActive===true) {
          me.addClass('active');
        } else {
          me.removeClass('active');
        }
        return this;
      },
      disable: function() {
        var d = 'disabled';
        $(this.el).addClass(d).attr(d,d);
        return this;
      },
      enable: function() {
        var d = 'disabled';
        $(this.el).removeClass(d).removeAttr(d);
        return this;
      },
      setState: function(type) {
        if(_.isEmpty(type) || type!='loading' && !_.has(this.state, type.toLowerCase())) type = 'reset';
        $(this.el).button(type);
        return this;
      },
      loading: function() {
        return this.setState('loading');
      },
      reset: function() {
        return this.setState('reset');
      }
    });
  
    return {
      create: function(options) {
        return (new _Button(options));
      },
      extend: function(options) {
        return _Button.extend(options);
      }
    };
  }));
  

  (function( global, factory ) {
  
    global.bsModal = factory();
  
  }(bsGlobal, function( ) {
  
    var global = bsGlobal || {};
  
    var _Modal = Backbone.View.extend({
      tagName: 'div',
      className: 'modal fade',
      _isOpened: false,
      initialize: function(options) {
        var self = this;
  
        var labelledby = 'ModalLabel_' + this.cid;
  
        var defaults = {
          title: 'Title',
          message: '',
          type: global.type.DEFAULT,
          buttons: [{
            label: 'Close',
            type: global.type.DEFAULT,
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
        })).addClass('bg-'+global.modalOptions.type).css({
          'border-radius': '5px 5px 0 0'
        }).appendTo(modalContent);
  
        this._title = this._header.find('.modal-title');
  
        this._body = $(template.body).css({
          'overflow': 'hidden'
        }).html(global.modalOptions.message).appendTo(modalContent);
  
        this._footer = $(template.footer).appendTo(modalContent);
  
        this._buttons = [];
  
        _.each(global.modalOptions.buttons, function(value) {
          value.context = self;
          value.type = value.type || global.modalOptions.type;
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
        if(!this._isOpened) {
          $('body').append(this.el);
          $(this.el).modal({
            show: true,
            backdrop: global.modalOptions.backdrop===true ? true : 'static',
            keyboard: global.modalOptions.keyboard
          });
          this._isOpened = true;
        }
        return this;
      },
      close: function() {
        $(this.el).modal('hide');
        this._isOpened = false;
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
      },
      alert: function() {
        var defaults = {
          title: 'Alert',
          message: '',
          type: global.type.PRIMARY,
          buttonLabel: 'OK',
          callback: null
        };
  
        var options = _.isObject(arguments[0]) ? arguments[0] : {};
  
        options = _.isString(arguments[0]) ? {
          message: arguments[0],
          title: _.isString(arguments[1]) ? arguments[1] : defaults.title,
          callback: _.isFunction(arguments[1]) ? arguments[1] : (_.isFunction(arguments[2]) ? arguments[2] : null)
        } : options;
  
        var settings = _.extend({}, defaults, options);
  
        return this.create({
          title: settings.title,
          message: settings.message,
          type: settings.type,
          backdrop: false,
          width: '360px',
          buttons: [{
            label: settings.buttonLabel,
            action: function(self, context) {
              if(_.isFunction(settings.callback)) settings.callback();
              context.close();
            }
          }]
        }).open();
      },
      confirm: function() {
        var defaults = {
          title: 'Confirm',
          message: '',
          type: global.type.PRIMARY,
          okLabel: 'Yes',
          cancelLabel: 'No',
          callback: null
        };
  
        var options = _.isObject(arguments[0]) ? arguments[0] : {};
  
        options = _.isString(arguments[0]) ? {
          message: arguments[0],
          title: _.isString(arguments[1]) ? arguments[1] : defaults.title,
          callback: _.isFunction(arguments[1]) ? arguments[1] : (_.isFunction(arguments[2]) ? arguments[2] : null)
        } : options;
  
        var settings = _.extend({}, defaults, options);
  
        return this.create({
          title: settings.title,
          message: settings.message,
          type: settings.type,
          width: '360px',
          buttons: [{
            label: settings.okLabel,
            action: function(self, context) {
              if(_.isFunction(settings.callback)) settings.callback(true);
              context.close();
            }
          }, {
            label: settings.cancelLabel,
            type: global.type.DEFAULT,
            action: function(self, context) {
              if(_.isFunction(settings.callback)) settings.callback(false);
              context.close();
            }
          }]
        }).open();
      },
      prompt: function() {
        var defaults = {
          title: 'Input Content',
          type: global.type.PRIMARY,
          content: '',
          okLabel: 'OK',
          cancelLabel: 'CANCEL',
          callback: null
        };
  
        var options = _.isFunction(arguments[0]) ? {
          callback: arguments[0]
        } : (_.isObject(arguments[0]) ? arguments[0] : {});
  
        options = _.isString(arguments[0]) ? {
          content: arguments[0],
          title: _.isString(arguments[1]) ? arguments[1] : defaults.title,
          callback: _.isFunction(arguments[1]) ? arguments[1] : (_.isFunction(arguments[2]) ? arguments[2] : null)
        } : options;
  
        var settings = _.extend({}, defaults, options);
  
        return this.create({
          title: settings.title,
          message: '<textarea class="form-control" rows="3" style="resize:vertical">'+settings.content+'</textarea>',
          type: settings.type,
          buttons: [{
            label: settings.okLabel,
            action: function(self, context) {
              var content = context.getModalBody().find('textarea').val();
              if(_.isFunction(settings.callback)) settings.callback(content);
              context.close();
            }
          }, {
            label: settings.cancelLabel,
            type: global.type.DEFAULT,
            action: function(self, context) {
              context.close();
            }
          }]
        }).open();
      }
    };
  }));


  return {
    TYPE: bsGlobal.type,
    BUTTON_CATEGORY: bsGlobal.buttonCategory,
    BUTTON_SIZE: bsGlobal.buttonSize,
    create: bsGlobal.bsModal.create,
    extend: bsGlobal.bsModal.extend,
    alert: bsGlobal.bsModal.alert,
    confirm: bsGlobal.bsModal.confirm,
    prompt: bsGlobal.bsModal.prompt,
    show: function(options) {
      return bsGlobal.bsModal.create(options).open();
    }
  };

}));