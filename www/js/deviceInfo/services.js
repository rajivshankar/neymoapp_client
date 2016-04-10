/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

services.factory('DeviceInfoService', ['$localStorage'
                                , '$ionicPlatform'
                                , '$cordovaDevice'
                                , function ($localStorage
                                            , $ionicPlatform
                                            , $cordovaDevice
                                            ) {
    return {
        deviceInfo: function() {
            var deviceRecStr = '';
            var deviceRec = {};
//            $ionicPlatform.ready(function() {
//                deviceRecStr = '{';
//                if ($cordovaDevice) {
//                    deviceRecStr += '"uuid": "' + $cordovaDevice.getUUID() + '"';
//                    deviceRecStr += ', "model_name": "' + $cordovaDevice.getModel() + '"';
//                    deviceRecStr += ', "os_platform": "' + $cordovaDevice.getPlatform() + '"';
//                    deviceRecStr += ', "version": "' + $cordovaDevice.getVersion() + '"';
//                }
//                if (window.plugins.sim) {
//                    window.plugins.sim.getSimInfo(function(result) {
//                        deviceRecStr += ', "country_code": "' + result.countryCode + '"';
//                        deviceRecStr += ', "mcc": ' + (result.mcc? result.mcc: 'null');
//                        deviceRecStr += ', "mnc": ' + (result.mnc? result.mnc: 'null');
//                        deviceRecStr += ', "phone_number": ' + (result.phoneNumber? result.phoneNumber.slice(-10) : 'null');
//                        deviceRecStr += ', "device_id": "' + result.deviceId + '"';
//                        deviceRecStr += '}';
//
//                        deviceRec = JSON.parse(deviceRecStr);
//                    }, function(errResult){
//                        console.log(errResult);
//                        $localStorage.error = "Sim read err:" + errResult.statusText;
//                    });
//                }
//            });
            return deviceRec;
        }
    };
}]);