/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// File: /js/deviceInfo/controllers.js

controllers.controller('DevInfoCtrl', ['$scope'
                                        , '$ionicPlatform'
                                        , '$localStorage'
                                        , '$cordovaDevice'
                                        , function($scope
                                                    , $ionicPlatform
                                                    , $localStorage
                                                    , $cordovaDevice
                                        ) {
    var self = this;
    
    $ionicPlatform.ready(function() {
        
        if ($cordovaDevice) {
            $scope.cordova = $cordovaDevice.getCordova();
            $scope.model = $cordovaDevice.getModel();
            $scope.platform = $cordovaDevice.getPlatform();
            $scope.UUID = $cordovaDevice.getUUID();
            $scope.version = $cordovaDevice.getVersion();
        }
        if (device) {
            $scope.checkDevice = "Got Inside";
            $scope.deviceModel = device.model
        } else {
            $scope.checkDevice = "Never Inside";
        }
        if (window.plugins.sim) {
            $scope.checkSim = "Got Inside";
            window.plugins.sim.getSimInfo(function(result){
                $scope.carrierName = result.carrierName;
                $scope.countryCode = result.countryCode;
                $scope.mobileCountryCode = result.mcc;
                $scope.mobileNetworkCode = result.mnc;
                $scope.phoneNumber = result.phoneNumber;
                $scope.deviceId = result.deviceId;
            }, function(errResult){
                console.log(errResult);
            });
        } else {
            $scope.checkSim = "Never Inside";
        }
   });

    $scope.clearUserToken = function() {
//        delete $localStorage.userToken;
        console.log("userToken deleted... " + $localStorage);
    };
    
}]);
