define(function(require, exports, module) {

  var BootstrapDialog = require('BootstrapDialog');

  var View = Backbone.View.extend({
    el: '#main',
    template: require('app/tpl/index.html'),
    initialize: function(options) {
      this.$el.html(_.template(this.template)({
        exports: require('app/tpl/en/body-properties.html'),
        buttonOption: require('app/tpl/en/body-button.html'),
        alert: require('app/tpl/en/body-alert.html'),
        confirm: require('app/tpl/en/body-confirm.html'),
        prompt: require('app/tpl/en/body-prompt.html'),
        dialog: require('app/tpl/en/body-dialog.html')
      })).find('.body:odd').addClass('bg-transparent');
    },
    events: {
      'click .open-dialog': 'onOpenDialog',
      'click .open-typed-dialog': 'onOpenTypedDialog',
      'click .open-alert': 'onOpenAlert',
      'click .open-confirm': 'onOpenConfirm',
      'click .open-prompt': 'onOpenPrompt'
    },
    onOpenDialog: function(e) {
      var me = $(e.target);
      switch(me.data('name')) {
        case 'simple':
          BootstrapDialog.show();
          break;
        case 'with-option':
          BootstrapDialog.show({
            title: 'Hello Dialog',
            message: '<div class="alert alert-info">I am a dialog</div>'
          });
          break;
        case 'with-type':
          BootstrapDialog.show({
            title: 'Hello Dialog',
            message: 'I am a dialog',
            type: BootstrapDialog.TYPE.INFO
          });
          break;
        case 'with-backdrop':
          BootstrapDialog.show({
            title: 'Hello Dialog',
            message: 'I am a dialog',
            backdrop: false
          });
          break;
        case 'with-width':
          BootstrapDialog.show({
            title: 'Hello Dialog',
            message: 'I am a dialog',
            width: '60%'
          });
          break;
        case 'with-buttons':
          BootstrapDialog.show({
            title: 'Please Choose',
            message: 'What is your sex?',
            type: BootstrapDialog.TYPE.PRIMARY,
            buttons: [{
              label: 'MALE',
              action: function(self, dialog) {
                BootstrapDialog.alert('You are male', function() {
                  dialog.close();
                });
              }
            }, {
              label: 'FEMALE',
              type: BootstrapDialog.TYPE.DEFAULT,
              action: function(self, dialog) {
                BootstrapDialog.alert('You are female', function() {
                  dialog.close();
                });
              }
            }, {
              label: 'UNKNOWN',
              type: BootstrapDialog.TYPE.DANGER,
              action: function(self, dialog) {
                dialog.close();
              }
            }]
          });
          break;
        case 'with-event':
          BootstrapDialog.show({
            title: 'Hello Dialog',
            message: '<div class="alert alert-info"></div>',
            onShow: function(dialog) {
              dialog.getModalBody().find('.alert').append('<p>show</p>');
            },
            onShown: function(dialog) {
              dialog.getModalBody().find('.alert').append('<p>shown</p>');
            }
          });
          break;
        default:
          break;
      }
    },
    onOpenTypedDialog: function(e) {
      var that = this;
      var me = $(e.target);
      BootstrapDialog.show({
        title: me.data('type').toUpperCase() + ' Dialog',
        message: '<h3>Hello Typed Dialog</h3>',
        type: me.data('type'),
        buttons: [{
          label: 'OK',
          action: function(self, dialog) {
            dialog.close();
          }
        }]
      });
    },
    onOpenAlert: function(e) {
      var me = $(e.target);
      switch(me.data('name')) {
        case 'simple':
          BootstrapDialog.alert('The message...');
          break;
        case 'with-callback':
          BootstrapDialog.alert('The message...', function(){
            BootstrapDialog.alert('callback message')
          });
          break;
        case 'with-option':
          BootstrapDialog.alert({
            title: 'Error',
            message: '<p>404 - Page Not Found</p>',
            type: BootstrapDialog.TYPE.DANGER,
            buttonLabel: 'Sure',
            callback: function() {
              BootstrapDialog.alert('callback message');
            }
          });
          break;
        default:
          break;
      }
    },
    onOpenConfirm: function(e) {
      var me = $(e.target);
      switch(me.data('name')) {
        case 'simple':
          BootstrapDialog.confirm('Are you sure delete the guys?', function(isTrue) {
            isTrue ? BootstrapDialog.alert('Yes') : BootstrapDialog.alert('No');
          });
          break;
        case 'with-option':
          BootstrapDialog.confirm({
            title: 'It\'s danger',
            message: 'Are you sure delete the guys?',
            type: BootstrapDialog.TYPE.DANGER,
            okLabel: 'Delete It',
            cancelLabel: 'Cancel',
            callback: function(isTrue) {
              isTrue
                ? BootstrapDialog.alert('It has been deleted')
                : BootstrapDialog.alert('You cancel the deletion');
            }
          });
          break;
        default:
          break;
      }
    },
    onOpenPrompt: function(e) {
      var me = $(e.target);
      switch(me.data('name')) {
        case 'simple':
          BootstrapDialog.prompt(function(content) {
            BootstrapDialog.alert(content);
          });
          break;
        case 'with-content':
          BootstrapDialog.prompt('My name is panben', function(content) {
            BootstrapDialog.alert(content);
          });
          break;
        case 'with-option':
          BootstrapDialog.prompt({
            title: 'Input your name',
            type: BootstrapDialog.TYPE.INFO,
            content: 'panben',
            okLabel: 'Completed',
            cancelLabel: 'Close',
            callback: function(content) {
              BootstrapDialog.alert('Hello '+content);
            }
          });
          break;
        default:
          break;
      }
    }
  });

  return function(options) {
    return (new View(options));
  }
});