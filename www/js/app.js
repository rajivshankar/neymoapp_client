/* global deviceRec, StatusBar */

// Ionic MoneProApp

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'moneyProApp' is the name of this angular module (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'moneyProApp.services' is found in services.js
// 'moneyProApp.controllers' is found in controllers.js
var mainApp = angular.module('moneyProApp', ['ionic'
                                            , 'moneyProApp.controllers'
                                            , 'moneyProApp.services'
                                            , 'moneyProApp.params'
                                            , 'ngCordova'
                                            , 'ngStorage'
                                            , 'ngAnimate'
                                            , 'restangular']);

mainApp.run(['Restangular'
                , '$localStorage'
                , '$ionicPlatform'
                , '$cordovaDevice'
                , '$http'
                , 'Handshake'
                , function(Restangular
                            , $localStorage
                            , $ionicPlatform
                            , $cordovaDevice
                            , $http
                            , Handshake
                            ) {

    var deviceRecStr = '{';
    var deviceRec = {};
    var baseDevice = Restangular.all();
    delete $localStorage.device;
    delete $localStorage.uuid;
    delete $localStorage.myErr;
    delete $localStorage.error;
    
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
    
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if ($localStorage.userToken == null) {
            if ($cordovaDevice) {
                deviceRecStr += '"uuid": "' + $cordovaDevice.getUUID() + '"';
                deviceRecStr += ', "model_name": "' + $cordovaDevice.getModel() + '"';
                deviceRecStr += ', "os_platform": "' + $cordovaDevice.getPlatform() + '"';
                deviceRecStr += ', "version": "' + $cordovaDevice.getVersion() + '"';

                deviceRec.uuid = $cordovaDevice.getUUID();
                deviceRec.model_name = $cordovaDevice.getModel();
                deviceRec.os_platform = $cordovaDevice.getPlatform();
                deviceRec.version = $cordovaDevice.getVersion();
                
            }
            if (window.plugins.sim) {
                window.plugins.sim.getSimInfo(function(result) {
                deviceRecStr += ', "country_code": "' + result.countryCode + '"';
                deviceRecStr += ', "mcc": ' + (result.mcc? result.mcc: 'null');
                deviceRecStr += ', "mnc": ' + (result.mnc? result.mnc: 'null');
                deviceRecStr += ', "phone_number": ' + (result.phoneNumber? result.phoneNumber : 'null');
                deviceRecStr += ', "device_id": "' + result.deviceId + '"';
                deviceRecStr += '}';

                deviceRec.country_code = result.countryCode;
                deviceRec.mcc = result.mcc;
                deviceRec.mnc = result.mnc;
                deviceRec.phone_number = result.phoneNumber;
                deviceRec.device_id = result.deviceId;

                $localStorage.device = deviceRecStr;
                deviceRec = JSON.parse(deviceRecStr)
//                deviceRecStr += $localStorage.device;
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
    /*
     * set the header to contain authorisation code.
     * If the auth code is not present, send the details of the device     * 
     */
    
}]);

mainApp.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl',
                controllerAs: 'dashCtrl'
          }
        }
    })

    .state('tab.utexts', {
        url: '/utexts',
        views: {
            'tab-utexts': {
                templateUrl: 'templates/tab-utexts.html',
                controller: 'UTextsCtrl',
                controllerAs: 'uTextsCtrl'
            }
        }
      })
    .state('tab.smsList', {
        url: '/sms-list',
        views: {
            'tab-sms-list': {
                templateUrl: 'templates/tab-sms.html',
                controller: 'SMSListCtrl',
                controllerAs: 'smsListCtrl'
          }
        }
    })
    .state('tab.devInfo', {
        url: '/dev-info',
        views: {
            'tab-dev-info': {
                templateUrl: 'templates/tab-dev-info.html',
                controller: 'DevInfoCtrl',
                controllerAs: 'devInfoCtrl'
          }
        }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

