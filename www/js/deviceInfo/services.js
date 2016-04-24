/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

services.factory('DeviceInfoService', ['$localStorage'
                                , '$ionicPlatform'
                                , '$cordovaDevice'
                                , '$cordovaGeolocation'
                                , '$q'
                                , 'AppUtils'
                                , function ($localStorage
                                            , $ionicPlatform
                                            , $cordovaDevice
                                            , $cordovaGeolocation
                                            , $q
                                            , AppUtils
                                            ) {
    return {
        deviceInfo: function() {
            var deviceRecStr = '';
            var deviceRec = {};
            var deferred = $q.defer();
            $ionicPlatform.ready(function() {
                if (window.plugins.sim) {
                    window.plugins.sim.getSimInfo(function(result) {
                        deviceRecStr = '{';
                        if ($cordovaDevice) {
                            deviceRecStr += '"uuid": "' + $cordovaDevice.getUUID() + '"';
                            deviceRecStr += ', "model_name": "' + $cordovaDevice.getModel() + '"';
                            deviceRecStr += ', "os_platform": "' + $cordovaDevice.getPlatform() + '"';
                            deviceRecStr += ', "version": "' + $cordovaDevice.getVersion() + '"';
                        }
                        deviceRecStr += ', "country_code": "' + result.countryCode + '"';
                        deviceRecStr += ', "mcc": ' + ((result.mcc && AppUtils.isNumber(result.mcc))? result.mcc: 'null');
                        deviceRecStr += ', "mnc": ' + ((result.mnc && AppUtils.isNumber(result.mnc))? result.mnc: 'null');
                        deviceRecStr += ', "phone_number": ' + ((result.phoneNumber && AppUtils.isNumber(result.phoneNumber))? result.phoneNumber.slice(-10) : 'null');
                        deviceRecStr += ', "device_id": "' + result.deviceId + '"';
                        deviceRecStr += '}';

                        deviceRec = JSON.parse(deviceRecStr);
                        deferred.resolve(deviceRec);
                    }, function(errResult){
                        console.log(errResult);
                        $localStorage.error = "Sim read err:" + errResult.statusText;
                        deferred.reject(errResult);
                    });
                } else {
                    deferred.resolve(null);
                }
            });
            return deferred.promise;
        },
        geoLocation : function () {
            var deferred = $q.defer();
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation.getCurrentPosition(posOptions)
            .then(function (position) {
                deferred.resolve(position.coords);
            }, function(err) {
                deferred.resolve({
                                latitude: null,
                                longitude: null
                                });
            });
            return deferred.promise;
        }
    };
}]);