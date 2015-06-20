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
      DEFAULT: '',
      LARGE: 'btn-lg',
      SMALL: 'btn-sm',
      MINI: 'btn-xs'
    }
  };

  //= include button.js

  //= include modal.js

  return {
    TYPE: bsGlobal.type,
    create: bsGlobal.bsModal.create,
    extend: bsGlobal.bsModal.extend,
    alert: bsGlobal.bsModal.alert,
    confirm: bsGlobal.bsModal.confirm,
    prompt: bsGlobal.bsModal.prompt,
    createButton: bsGlobal.bsButton.create
  };

}));