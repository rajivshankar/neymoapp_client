// File: controllers.js
var controllers = angular.module('moneyProApp.controllers', []);

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
        $scope.device_id = $localStorage.device;
        $scope.uuid = $localStorage.uuid;
        $scope.myErr = $localStorage.myErr;

        if ($localStorage.userToken) {
            $scope.userToken = $localStorage.userToken;
            $scope.userID = $localStorage.userID;
            $scope.devicePK = $localStorage.devicePK;
        } else {
            $scope.userToken = "Undefined"
        }
   });

    $scope.clearUserToken = function() {
        delete $localStorage.userToken;
        console.log("userToken deleted... " + $localStorage);
    };
}]);
