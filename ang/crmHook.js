(function(angular, $, _) {
  angular
    .module('crmHookPolyfill', [
      'crmUtil'
    ]);
  angular.module('crmUtil').factory('crmHook', [
    function($q) {
      var listeners = {};
      return {
        runHook: function(hookName, args, type) {
          if (listeners.hasOwnProperty(hookName)) {
            var value;
            listeners[hookName].forEach(function (listener) {
              switch (type) {
                case "first":
                  return listener.callback(args);
                case "last":
                  value = listener.callback(args);
                  break;
                case "all":
                  value.push(listener.callback(args));
                  break;
                default:
                  listener.callback(args);
              }
            });
            return value;
          }
          return false;
        },
        //type: void, first, last, all
        promiseHook: function(hookName, args, type, failOnNoHooks) {
          var deferred = $q.defer();
          var that = this;
          setTimeout(function() {
          if (listeners.hasOwnProperty(hookName)) {
            deferred.resolve(that.runHook(hookName, args, type));
          } else {
            if(failOnNoHooks) {
              deferred.reject("No Hooks Registered");
            } else {
              deferred.resolve();
            }
          }
          }, 25);

          return deferred.promise;
        },
        register: function(hookName, callback, weight) {
          if (!listeners.hasOwnProperty(hookName)) {
            listeners[hookName] = [];
          }
          weight = parseInt(weight) || 100 + listeners[hookName].length;

          listeners[hookName].push({"callback": callback, "weight": weight});
          if(listeners[hookName].length > 1) {
            //Sort listeners by weight.
            listeners[hookName].sort(function(a, b) {
              return a.weight - b.weight;
            });

          }
        }
      };
    }
  ]);
})(angular, CRM.$, CRM._);