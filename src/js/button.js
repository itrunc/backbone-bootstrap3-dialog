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
