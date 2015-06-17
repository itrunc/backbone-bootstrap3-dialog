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

  var BUTTON_STATIC = {
    CATETORY: {
      BUTTON: 'button',
      SUBMIT: 'submit',
      RESET: 'reset'
    },
    SIZE: {
      LARGE: 'btn-lg',
      SMALL: 'btn-sm',
      MINI: 'btn-xs'
    },
    TYPE: {
      DEFAULT: 'btn-' + TYPE.DEFAULT,
      PRIMARY: 'btn-' + TYPE.PRIMARY,
      INFO: 'btn-' + TYPE.INFO,
      SUCCESS: 'btn-' + TYPE.SUCCESS,
      WARNING: 'btn-' + TYPE.WARNING,
      DANGER: 'btn-' + TYPE.DANGER,
      LINK: 'btn-link'
    }
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
        type: BUTTON_STATIC.TYPE.DEFAULT,
        category: BUTTON_STATIC.CATETORY.BUTTON,
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
    TYPE: BUTTON_STATIC.TYPE,
    CATEGORY: BUTTON_STATIC.CATETORY,
    SIZE: BUTTON_STATIC.SIZE,
    create: function(options) {
      return (new _Button(options));
    },
    extend: function(options) {
      return _Button.extend(options);
    }
  };

  var ModalHeader = Backbone.View.extend({
    tagName: 'div',
    className: 'modal-header',
    template: '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="<%-labelledby%>"><%-title%></h4>',
    initialize: function(options) {
      this.labelledby = options.labelledby;
      this.title = options.title;
      $(this.el).html(_.template(this.template)({
        labelledby: this.labelledby,
        title: this.title
      }))
    },
    setTitle: function(title) {
      this.title = title;
      $(this.el).find('.modal-title').text(this.title);
      return this;
    }
  });

  var ModalBody = Backbone.View.extend({
    tagName: 'div',
    className: 'modal-body',
    initialize: function(options) {
      this.content = options.content;
      $(this.el).html(this.content);
    },
    setContent: function(content) {
      this.content = content;
      $(this.el).html(this.content);
      return this;
    }
  });

  var ModalFooter = Backbone.View.extend({
    tagName: 'div',
    className: 'modal-footer',
    buttons: [],
    initialize: function(options) {
      var that = this;
      var me = $(that.el);
      var buttons = options.buttons;
      var modal = options.modal;
      _.each(buttons, function(value) {
        value.context = modal;
        var button = Button.create(value);
        me.append(button.el);
        that.buttons.push(button);
      });
    }
  });



  var Modal = Backbone.View.extend({
    tagName: 'div',
    className: 'modal fade',
    labelledby: _.uniqueId('ModalLabel'),
    template: '<div class="modal-dialog"><div class="modal-content"></div></div>',
    initialize: function(options) {
      var defaults = {
        title: 'Dialog Title',
        message: '',
        buttons: [{
          label: 'Close',
          category: 'btn-default',
          action: function(self, context) {
            context.close();
          }
        }],
        backdrop: true,
        autodestroy: true,
        onShow: null,
        onShown: null,
        onHide: null,
        onHidden: null,
        onLoaded: null
      };

      options = _.extend({}, defaults, options);

      var me = $(this.el);
      me.html(this.template).attr('tabindex', '-1').attr('role','dialog').attr('aria-hidden','true').attr('aria-labelledby',this.labelledby);

      me.data('backdrop', (options.backdrop===true ? 'true' : 'static'));

      this.modalHeader = new ModalHeader({
        labelledby: this.labelledby,
        title: options.title
      });

      this.modalBody = new ModalBody({
        content: options.message
      });

      this.modalFooter = options.buttons.length > 0 ? new ModalFooter({
        buttons: options.buttons,
        modal: this
      }) : null;

      me.find('.modal-content').html(this.modalHeader.el).append(this.modalBody.el).append(this.modalFooter ? this.modalFooter.el : '');

      this.autodestroy = options.autodestroy;

      this.onShown = options.onShown;
      this.onShow = options.onShow;
      this.onHidden = options.onHidden;
      this.onHide = options.onHide;
      this.onLoaded = options.onLoaded;

    },
    events: {
      'show.bs.modal': '_onShow',
      'shown.bs.modal': '_onShown',
      'hide.bs.modal': '_onHide',
      'hidden.bs.modal': '_onHidden',
      'loaded.bs.modal': '_onLoaded'
    },
    _onShow: function() {
      if(_.isFunction(this.onShow)) this.onShow(this);
    },
    _onShown: function() {
      if(_.isFunction(this.onShown)) this.onShown(this);
    },
    _onHide: function() {
      if(_.isFunction(this.onHide)) this.onHide(this);
    },
    _onHidden: function() {
      if(_.isFunction(this.onHidden)) this.onHidden(this);
      if(this.autodestroy === true) {
        this.modalFooter || this.modalFooter.remove();
        this.modalBody.remove();
        this.modalHeader.remove();
        this.remove();
      }
    },
    _onLoaded: function() {
      if(_.isFunction(this.onLoaded)) this.onLoaded(this);
    },
    open: function() {
      $('body').append(this.el);
      $(this.el).modal('show');
      return this;
    },
    close: function() {
      $(this.el).modal('hide');
      return this;
    },
    setTitle: function(title) {
      this.modalHeader.setTitle(title);
      return this;
    },
    setMessage: function(message) {
      this.modalBody.setContent(message);
      return this;
    },
    getModalHeader: function() {
      return this.modalHeader.$el;
    },
    getModalBody: function() {
      return this.modalBody.$el;
    },
    getModalFooter: function() {
      return this.modalFooter ? this.modalFooter.$el : null;
    }
  });

  var Dialog = {
    create: function(options) {
      return (new Modal(options));
    },
    extend: function(options) {
      return Modal.extend(options);
    }
  };



  return {
    Button: Button,
    Dialog: Dialog
  };
}));