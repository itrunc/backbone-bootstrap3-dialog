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

  var bsGlobal = {
    textType: _.extend({
      DEFAULT: '',
      MUTED: 'text-muted'
    }, _.mapObject(_.pick(TYPE, ['INFO','PRIMARY','SUCCESS','WARNING','DANGER']), function(val, key) {
      return 'text-' + val;
    })),

    bgType: _.extend({
      DEFAULT: ''
    }, _.mapObject(_.pick(TYPE, ['INFO','PRIMARY','SUCCESS','WARNING','DANGER']), function(val, key) {
      return 'bg-' + val;
    })),

    buttonType: _.extend({
      LINK: 'btn-link'
    }, _.mapObject(_.pick(TYPE, ['DEFAULT','INFO','PRIMARY','SUCCESS','WARNING','DANGER']), function(val, key) {
      return 'btn-' + val;
    })),

    buttonCategory: {
      BUTTON: 'button',
      SUBMIT: 'submit',
      RESET: 'reset'
    },

    buttonSize: {
      DEFAULT: '',
      LARGE: 'btn-lg',
      SMALL: 'btn-sm',
      MINI: 'btn-xs'
    }
  };

  //= include button.js

  //= include modal.js

  return {
    BUTTON_TYPE: bsGlobal.buttonType,
    TEXT_TYPE: bsGlobal.textType,
    BG_TYPE: bsGlobal.bgType,
    TYPE: bsGlobal.textType,
    create: bsGlobal.bsModal.create,
    extend: bsGlobal.bsModal.extend,
    createButton: bsGlobal.bsButton.create
  };

}));