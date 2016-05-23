(function(angular, $, _) {
  angular
    .module('crmHookPolyfill', [
      'crmUtil'
    ]);
  angular.module('crmUtil').factory('crmHook', [
    function() {
      var listeners = {};
      return {
        runHook: function(hookName, args) {
          if (listeners.hasOwnProperty(hookName)) {
            listeners[hookName].forEach(function (cb) {
              cb(args);
            });
          }
        },
        register: function(hookName, callback) {
          if (!listeners.hasOwnProperty(hookName)) {
            listeners[hookName] = [];
          }
          listeners[hookName].push(callback);
        }
      };
    }
  ]);
})(angular, CRM.$, CRM._);