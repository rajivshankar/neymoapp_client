// File: controllers.js
var controllers = angular.module('moneyProApp.controllers', []);

controllers.controller('AppCtrl', ['$scope'
                                    , '$ionicPlatform'
                                    , '$localStorage'
                                    , '$cordovaDevice'
                                    , '$http'
                                    , 'Restangular'
                                    , 'AppUtils'
                                    , function ($scope
                                                , $ionicPlatform
                                                , $localStorage
                                                , $cordovaDevice
                                                , $http
                                                , Restangular
                                                , AppUtils
                                    ) {
    /*
     * Define the Login Modal
     * clean up the login modal once the destroy event occurs
     */
    var deviceRecStr = '{';
    var deviceRec = {};
    var authTokenValue = '';
    var baseDevice = Restangular.all();

    delete $localStorage.device;
    delete $localStorage.deviceRecStr;
    delete $localStorage.uuid;
    delete $localStorage.myErr;
    delete $localStorage.error;

    $ionicPlatform.ready(function() {
        if (!$localStorage.userToken) {
            if ($cordovaDevice) {
                deviceRecStr += '"uuid": "' + $cordovaDevice.getUUID() + '"';
                deviceRecStr += ', "model_name": "' + $cordovaDevice.getModel() + '"';
                deviceRecStr += ', "os_platform": "' + $cordovaDevice.getPlatform() + '"';
                deviceRecStr += ', "version": "' + $cordovaDevice.getVersion() + '"';
            }
            if (window.plugins.sim) {
                window.plugins.sim.getSimInfo(function(result) {
                deviceRecStr += ', "country_code": "' + result.countryCode + '"';
                deviceRecStr += ', "mcc": ' + ((result.mcc && AppUtils.isNumber(result.mcc))? result.mcc: 'null');
                deviceRecStr += ', "mnc": ' + ((result.mnc && AppUtils.isNumber(result.mnc))? result.mnc: 'null');
                deviceRecStr += ', "phone_number": ' + ((result.phoneNumber && AppUtils.isNumber(result.phoneNumber))? result.phoneNumber.slice(-10) : 'null');
                deviceRecStr += ', "device_id": "' + result.deviceId + '"';
                deviceRecStr += '}';

                $localStorage.deviceRecStr = deviceRecStr;//                deviceRecStr += $localStorage.device;
                deviceRec = JSON.parse(deviceRecStr)
                $localStorage.deviceRec = JSON.stringify(deviceRec);//                deviceRecStr += $localStorage.device;
                $localStorage.uuid = deviceRec.uuid;
                $localStorage.device = deviceRec.device_id;
//                baseDevice.post("device", deviceRec).then(function(response){
//                   console.log("POST successa");
//                   $localStorage.error = response.data.auth_token;
//                   $localStorage.error = "Success device setup";
//                   
//                   //$localStorage.userToken = auth_token;
//                }, function(error){
//                   $localStorage.error = error.statusText;
//                    console.log("There was an error while getting token" + error.statusText);
//                });
//                console.log(baseDevice);
                
                $http.post('https://moneybee-20151115.herokuapp.com/restful/device.json'
                // $http.post('http://localhost:8000/restful/device/'
                            , deviceRec).then(function(response){
                    console.log("Successful $http. Auth Token: " + response.data.auth_token);
                    $localStorage.myErr = "Auth Token: " + response.data.auth_token;
                    $localStorage.userToken = response.data.auth_token;
                    $localStorage.userID = response.data.user_id;
                    $localStorage.devicePK = response.data.id;

                    if ($localStorage.userToken) {
                        // set default header "token"
                        authTokenValue = "Token " + $localStorage.userToken;
                        Restangular.setDefaultHeaders({Authorization: authTokenValue});
                    }
                }, function(error){
                    $localStorage.myErr = "Error for $http:" + error.statusText + deviceRec;
                    console.log("Error for $http: " + error.statusText);
                });

                }, function(errResult){
                        console.log(errResult);
                        $localStorage.error = "Sim read err:" + errResult.statusText;
                });
            }
        }
    });
}]);
