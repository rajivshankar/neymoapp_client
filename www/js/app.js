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
                                            , 'ngResource'
                                            , 'ngSanitize'
                                            , 'googlechart'
                                            , 'ion-floating-menu'
                                            , 'nvd3'
                                        ]);

mainApp.run(['$localStorage'
                , '$ionicPlatform'
                , '$sessionStorage'
                , '$http'
                , 'AppUtils'
                , function($localStorage
                            , $ionicPlatform
                            , $sessionStorage
                            , $http
                            , AppUtils
                            ) {

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
            //Start the backgorund mode for this app
            cordova.plugins.backgroundMode.enable();
        }
        $sessionStorage.isActive = true;
        
        cordova.plugins.backgroundMode.onactivate = function() {
            console.log("Activated background Mode");
            console.log("cordova.plugins.backgroundMode.isEnabled: " + cordova.plugins.backgroundMode.isEnabled());
            console.log("cordova.plugins.backgroundMode.isActive: " + cordova.plugins.backgroundMode.isActive());
            $sessionStorage.isActive = cordova.plugins.backgroundMode.isActive();
        };
        
        cordova.plugins.backgroundMode.ondeactivate = function() {
            console.log("DEactivated background Mode");
            console.log("cordova.plugins.backgroundMode.isEnabled: " + cordova.plugins.backgroundMode.isEnabled());
            console.log("cordova.plugins.backgroundMode.isActive: " + cordova.plugins.backgroundMode.isActive());
            $sessionStorage.isActive = cordova.plugins.backgroundMode.isActive();
        };
        
        cordova.plugins.backgroundMode.configure({
            silent: true
        });

        if(typeof analytics !== undefined) {
            analytics.startTrackerWithId("UA-83953155-1");
            console.log('Tracker started with ID: UA-83953155-1');
        } else {
            console.log("Google Analytics Unavailable");
        }

        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        
    });
    if ($localStorage.userToken) {
        $http.defaults.headers.common.Authorization = "Token " + $localStorage.userToken;
        rekhaToken = "11cd80eb25912f4ac54dea9be4682cdf525259ab"
        kartikToken = "b3046c27a9bbe0c6381751a1224ace31c2e9ce9b"
//        $http.defaults.headers.common.Authorization = "Token " + kartikToken;
    }
    AppUtils.getAppParams()
    .then( function (bool_value) {
        console.log("Successfully set App Params: " + bool_value);
    }, function (err_value) {
        console.log("Failed to set App Params: " + err_value);
    });
//    var appParams = AppParamService.get(function () {
//        console.log("App Params read success: " + JSON.stringify(appParams.results));
//        for (paramsIndex in appParams.results) {
//            params = appParams.results[paramsIndex]
//            if (params.bool_value == null){
//                $sessionStorage[params.key] = params.value;
//            }
//            else{
//                $sessionStorage[params.key] = params.bool_value;
//            }
//        }
//        console.log("sessionStorage: " + JSON.stringify($sessionStorage));
//    }, function (err) {
//        console.log("Failed App Params Read: " + JSON.stringify(err));
//    });
}]);

mainApp.config(function($stateProvider
                        , $urlRouterProvider
                        , $sceDelegateProvider
                                ) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'AppCtrl',
        controllerAs: 'appCtrl'
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
    
    .state('tab.reports', {
        url: '/reports',
        views: {
            'tab-reports': {
                templateUrl: 'templates/tab-reports.html',
                controller: 'ReportsCtrl',
                controllerAs: 'reportsCtrl'
          }
        }
    })

    .state('tab.utexts', {
        url: '/utexts',
        params: {
            urlPath: 'unprocessed_text_data/'
            , listKey: 'unprocessTextList'
        },
        views: {
            'tab-utexts': {
                templateUrl: 'templates/tab-utexts.html',
                controller: 'ListCtrl',
                controllerAs: 'listCtrl',
            }
        }
    })

    .state('tab.smsList', {
        url: '/sms-list',
        params: {
            urlPath: 'text-data/'
            , listKey: 'uploadedSmsList'
        },
        views: {
            'tab-sms-list': {
                templateUrl: 'templates/tab-sms.html',
                controller: 'ListCtrl',
                controllerAs: 'listCtrl',
          }
        }
    })

    .state('tab.activityFeed', {
        url: '/activity-feed',
        views: {
            'tab-activity-feed': {
                templateUrl: 'templates/tab-activity-feed.html',
                controller: 'ActivityFeedCtrl',
                controllerAs: 'activityFeedCtrl',
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
     })

    .state('tab.debugInfo', {
        url: '/debug-info',
        views: {
            'tab-debug-info': {
                templateUrl: 'templates/tab-debug-info.html',
                controller: 'DebugInfoCtrl',
                controllerAs: 'debugInfoCtrl'
          }
        }
    })
    
    .state('accounts', {
        url: '/accounts',
        params: {
            urlPath: 'accounts/'
            , listKey: 'accountList'
        },
        templateUrl: 'templates/accountList.html',
        controller: 'ListCtrl',
        controllerAs: 'listCtrl'
    })
    
    .state('transactions', {
        url: '/transactions',
        params: {
            urlPath: 'transactions_filter/'
            , listKey: 'transactionList'
            , deleteUrlPath: 'transactions_manual/'
        },
        templateUrl: 'templates/transactionList.html',
        controller: 'ListCtrl',
        controllerAs: 'listCtrl'
    })

    .state('vendors', {
        url: '/vendors',
        params: {
            urlPath: 'reports/expense_by_vendor/month'
            , listKey: 'vendorExpenses'
        },
        templateUrl: 'templates/vendorExpenses.html',
        controller: 'ListCtrl',
        controllerAs: 'listCtrl'
    })
    
    .state('categories', {
        url: '/categories',
        params: {
            urlPath: 'reports/expense_by_category/month'
            , listKey: 'categoryExpenses'
        },
        templateUrl: 'templates/categoryExpenses.html',
        controller: 'ListCtrl',
        controllerAs: 'listCtrl'
    });

  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');
    $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://maps.googleapis.com/**'
            ]);
});

