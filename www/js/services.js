// File: services.js

var services = angular.module('moneyProApp.services', []);

services.factory('AppUtils',['$q'
                              , '$sessionStorage'
                              , '$rootScope'
                              , 'AUTH_EVENTS'
                              , 'AppParamService'
                              , function ($q
                                          , $sessionStorage
                                          , $rootScope
                                          , AUTH_EVENTS
                                          , AppParamService)
                                    {
    service = {
        isNumber: function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        getAppParams: function () {
            var deferredAppParams = $q.defer();
            var appParams = AppParamService.get(function () {
                console.log("App Params read success: " 
                                + JSON.stringify(appParams.results));
                for (paramsIndex in appParams.results) {
                    params = appParams.results[paramsIndex]
                    if (params.bool_value == null){
                        $sessionStorage[params.key] = params.value;
                    }
                    else{
                        $sessionStorage[params.key] = params.bool_value;
                    }
                }
                console.log("sessionStorage: " + JSON.stringify($sessionStorage));
                deferredAppParams.resolve(true);
            }, function (err) {
                console.log("Failed App Params Read: " + JSON.stringify(err));
                deferredAppParams.resolve(false);
            });
            return deferredAppParams.promise;
        },
        refreshData : function () {
            $rootScope.$broadcast(AUTH_EVENTS.refreshData);
        }
    };
    return service;
}]);
