// File: services.js

var services = angular.module('moneyProApp.services',   ['ngLodash'
                                                        , 'restangular']);

services.config(['RestangularProvider', function(RestangularProvider) {
    _.contains = _.includes // to have lodash to work with Restangular
    // If Restangular ever updates to lodash 4.0 remove this.
    baseUrlStr = 'https://moneybee-20151115.herokuapp.com/restful';
    // baseUrlStr = 'http://localhost:8000/restful';
    RestangularProvider.setBaseUrl(baseUrlStr);
    RestangularProvider.setRequestSuffix('.json');

    // add a response intereceptor
    splitGetList = function(data, operation, what, url, response, deferred) {
        var extractedData;
        // .. to look for getList operations
        if (operation === "getList") {
            // .. and handle the data and meta data
            extractedData = data.results;
            extractedData.count = data.count;
            extractedData.next = data.next;
            extractedData.previous = data.previous;
        } else {
            extractedData = data.results;
        }
        return extractedData;
    };
        RestangularProvider.addResponseInterceptor(splitGetList);
}]);

services.factory('Handshake', ['$localStorage'
                , '$ionicPlatform'
                , '$cordovaDevice'
                , '$scope'
                , function($localStorage
                            , $ionicPlatform
                            , $cordovaDevice
                            , $scope
                            ) {
    return {
        deviceRecStr: function() {
            console.log("Inside the Handshake services");
            $ionicPlatform.ready(function() {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                $scope.deviceRecStr = '{';
                $localStorage.device = "Temp Device 6";

                if ($localStorage.userToken == null) {
                    if ($cordovaDevice) {
                        $scope.deviceRecStr = $scope.deviceRecStr.concat('"uuid": "', $cordovaDevice.getUUID(), '"');
                        $scope.deviceRecStr = $scope.deviceRecStr.concat(', "model_name": "', $cordovaDevice.getModel(), '"');
                        $scope.deviceRecStr = $scope.deviceRecStr.concat(', "os_platform": "', $cordovaDevice.getPlatform(), '"');
                        $scope.deviceRecStr = $scope.deviceRecStr.concat(', "version": "', $cordovaDevice.getVersion(), '"');
                    }
                    var assignSim = function(result) {
                        $scope.deviceRecStr = $scope.deviceRecStr.concat(', "country_code": "', result.countryCode, '"');
                        $scope.deviceRecStr = $scope.deviceRecStr.concat(', "mcc": "', result.mcc, '"');
                        $scope.deviceRecStr = $scope.deviceRecStr.concat(', "mnc": "', result.mnc, '"');
                        $scope.deviceRecStr = $scope.deviceRecStr.concat(', "phone_number": "', result.phoneNumber, '"');
                        $scope.deviceRecStr = $scope.deviceRecStr.concat(', "device_id": "', result.deviceId, '"');
                    };
                    if (window.plugins.sim) {
                        window.plugins.sim.getSimInfo(assignSim
                                                        , function(errResult){
                            console.log(errResult);
                            $localStorage.error = "Sim read err:" + errResult.statusText;
                        });
                    }
                    $scope.deviceRecStr = $scope.deviceRecStr.concat('}');
                    return $scope.deviceRecStr;
                }
            });
        }
    };
}]);

                            

