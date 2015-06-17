(function( global, factory ) {

  if ( typeof module === "object" && typeof module.exports === "object" ) {
    module.exports = factory()
  } else {
    global.BootstrapDialog = factory();
  }

}(typeof window !== "undefined" ? window : this, function( ) {

  var TYPE = {
    DEFAULT: 'default',
    PRIMARY: 'primary',
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger'
  };

  var TEXT_TYPE = _.extend({
    DEFAULT: '',
    MUTED: 'text-muted'
  }, _.mapObject(_.pick(TYPE, ['INFO','PRIMARY','SUCCESS','WARNING','DANGER']), function(val, key) {
    return 'text-' + val;
  }));

  var BG_TYPE = _.extend({
    DEFAULT: ''
  }, _.mapObject(_.pick(TYPE, ['INFO','PRIMARY','SUCCESS','WARNING','DANGER']), function(val, key) {
    return 'bg-' + val;
  }));

  var BUTTON_TYPE = _.extend({
    LINK: 'btn-link'
  }, _.mapObject(_.pick(TYPE, ['DEFAULT','INFO','PRIMARY','SUCCESS','WARNING','DANGER']), function(val, key) {
    return 'btn-' + val;
  }));

  var BUTTON_CATEGORY = {
    BUTTON: 'button',
    SUBMIT: 'submit',
    RESET: 'reset'
  };

  var BUTTON_SIZE = {
    LARGE: 'btn-lg',
    SMALL: 'btn-sm',
    MINI: 'btn-xs'
  };

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
        type: BUTTON_TYPE.DEFAULT,
        category: BUTTON_CATEGORY.BUTTON,
        size: '',
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
        options.type,
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

  var Button = {
    TYPE: BUTTON_TYPE,
    CATEGORY: BUTTON_CATEGORY,
    SIZE: BUTTON_SIZE,
    create: function(options) {
      return (new _Button(options));
    },
    extend: function(options) {
      return _Button.extend(options);
    }
  };


  var modalOptions = {};
  var _Modal = Backbone.View.extend({
    tagName: 'div',
    className: 'modal fade',
    labelledby: _.uniqueId('ModalLabel'),
    initialize: function(options) {
      var self = this;

      var defaults = {
        title: 'Dialog Title',
        message: '',
        type: TEXT_TYPE.DEFAULT,
        buttons: [{
          label: 'Close',
          type: Button.TYPE.DEFAULT,
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

      modalOptions = _.extend({}, defaults, options);

      var template = {
        main: '<div class="modal-dialog" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="<%-labelledby%>"><div class="modal-content"></div></div>',
        header: '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="<%-labelledby%>"><%-title%></h4></div>',
        body: '<div class="modal-body"></div>',
        footer: '<div class="modal-footer"></div>'
      };

      var me = $(this.el);
      var modalDialog = $(_.template(template.main)({
        labelledby: this.labelledby
      })).addClass(modalOptions.cssClass).appendTo(me);

      if(modalOptions.width) {
        modalDialog.css({
          'width': modalOptions.width,
          'margin-left': 'auto',
          'margin-right': 'auto'
        });
      }

      var modalContent = me.find('.modal-content').css({
        'border': '0'
      });

      this._header = $(_.template(template.header)({
        labelledby: this.labelledby,
        title: modalOptions.title
      })).addClass(modalOptions.type).css({
        'border-radius': '6px 6px 0 0'
      }).appendTo(modalContent);

      this._title = this._header.find('.modal-title');

      this._body = $(template.body).html(modalOptions.message).appendTo(modalContent);

      this._footer = $(template.footer).appendTo(modalContent);

      this._buttons = [];

      _.each(modalOptions.buttons, function(value) {
        value.context = self;
        var button = Button.create(value);
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
      if(_.isFunction(modalOptions.onShow)) modalOptions.onShow(this);
    },
    _onShown: function() {
      if(_.isFunction(modalOptions.onShown)) modalOptions.onShown(this);
    },
    _onHide: function() {
      if(_.isFunction(modalOptions.onHide)) modalOptions.onHide(this);
    },
    _onHidden: function() {
      if(_.isFunction(modalOptions.onHidden)) modalOptions.onHidden(this);
      if(modalOptions.autodestroy === true) {
        this.remove();
      }
    },
    _onLoaded: function() {
      if(_.isFunction(modalOptions.onLoaded)) modalOptions.onLoaded(this);
    },
    open: function() {
      $('body').append(this.el);
      $(this.el).modal({
        show: true,
        backdrop: modalOptions.backdrop===true ? true : 'static',
        keyboard: modalOptions.keyboard
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
    BUTTON_TYPE: BUTTON_TYPE,
    TEXT_TYPE: TEXT_TYPE,
    BG_TYPE: BG_TYPE,
    TYPE: TEXT_TYPE,
    create: function(options) {
      return (new _Modal(options));
    },
    extend: function(options) {
      return _Modal.extend(options);
    },
    createButton: function(options) {
      return Button.create(options);
    }
  };
}));