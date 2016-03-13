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
                                            , 'restangular']);

mainApp.run(['Restangular'
                , '$localStorage'
                , '$ionicPlatform'
                , '$cordovaDevice'
                , '$http'
                , function(Restangular
                            , $localStorage
                            , $ionicPlatform
                            , $cordovaDevice
                            , $http)
                            {
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
        console.log("Inside the ready function in mainapp run")

        if ($localStorage.userToken == null) {
            var baseDevice = Restangular.all('device'); 
            var deviceRec = {};
            /*
            if ($cordovaDevice) {
                deviceRec["uuid"] = $cordovaDevice.getUUID();
                deviceRec["model_name"] = $cordovaDevice.getModel();
                deviceRec["os_platform"]  = $cordovaDevice.getPlatform();
                deviceRec["version"] = $cordovaDevice.getVersion();
            }
            if (window.plugins.sim) {
                window.plugins.sim.getSimInfo(function(result){
                    deviceRec["country_code"] = result.countryCode;
                    deviceRec["mcc"] = result.mcc;
                    deviceRec["mnc"] = result.mnc;
                    deviceRec["phone_number"] = result.phoneNumber;
                    deviceRec["device_id"] = result.deviceId;
                }, function(errResult){
                    console.log(errResult);
                });
            }
            */
            if (deviceRec["uuid"] == null) {
                deviceRec["uuid"] = "tempDevice2";
            }
            if (deviceRec["device_id"] == null) {
                deviceRec["device_id"] = "tempDevice_ID";
            }
            
            $http.post('https://moneybee-20151115.herokuapp.com/restful/device/'
                        , deviceRec).then(function(response){
               console.log("Successful $http");
               console.log(response.data.auth_token);
               $localStorage.userToken = response.data.auth_token;
            }, function(error){
                console.log(error.statusText);
                console.log("Error for $http");
            });
            
            
            baseDevice.post("device", deviceRec).then(function(response){
               console.log("POST successa");
               //$localStorage.userToken = auth_token;
            }, function(error){
                console.log(error.statusText);
                console.log("There was an error while getting token");
            });
            console.log(baseDevice);
        }
    });
    /*
     * set the header to contain authorisation code.
     * If the auth code is not present, send the details of the device     * 
     */
    
    if ($localStorage.userToken) {
        // set default header "token"
        authTokenValue = "Token " + $localStorage.userToken;
        Restangular.setDefaultHeaders({Authorization: authTokenValue});
    }
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
