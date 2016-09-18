// File: controllers.js
var controllers = angular.module('moneyProApp.controllers', []);

controllers.controller('AppCtrl', ['$scope'
                                    , '$rootScope'
                                    , '$q'
                                    , '$ionicPlatform'
                                    , '$localStorage'
                                    , '$sessionStorage'
                                    , '$cordovaNetwork'
                                    , '$ionicPopup'
                                    , 'HandshakeService'
                                    , 'SmsListService'
                                    , 'AUTH_EVENTS'
                                    , 'DeviceInfoService'
                                    , 'AppUtils'
                                    , function ($scope
                                                , $rootScope
                                                , $q
                                                , $ionicPlatform
                                                , $localStorage
                                                , $sessionStorage
                                                , $cordovaNetwork
                                                , $ionicPopup
                                                , HandshakeService
                                                , SmsListService
                                                , AUTH_EVENTS
                                                , DeviceInfoService
                                                , AppUtils
                                    ) {
    /*
     * Define the Login Modal
     * clean up the login modal once the destroy event occurs
     */
    if (!$localStorage.userToken) {
        DeviceInfoService.deviceInfo ()
        .then (HandshakeService.register)
        .then (function (authTokenValue) {
            console.log("Auth Token Returned: " + authTokenValue);
        })
        .catch (function (err) {
            console.log("Error in device registration: " + err);
        });
    }
    
    processAllSms = function () {
        SmsListService.cleanProcessedSms();
        console.log("Process All SMS individually: " 
                        + JSON.stringify(SmsListService.processSms()));
    };

    processBulkSms = function () {
        console.log("Process All SMS in Bulk: " 
                        + JSON.stringify(SmsListService.processBulkSms()));
    };

    $ionicPlatform.ready(function() {
        $scope.debugMode = $sessionStorage.debugMode;
        console.log("$scope.debugMode: " + $scope.debugMode)

        if (analytics && $localStorage.userID) {
            analytics.setUserId($localStorage.userID);
            console.log('Analytics set with userID:' + $localStorage.userID);
        }
        
        if(SMS) {
            var setSmsOptions = function () {
                var deferSetOptions = $q.defer();
                SMS.setOptions({
                    license: $sessionStorage.sms_plugin_key
                }, function (data) {
                    console.log('sms plugin key: '
                            + $sessionStorage.sms_plugin_key);
                    console.log('OPtions set success: ' + JSON.stringify(data));
                    console.log('$sessionStorage.deleteLastSmsDate: '
                                    + $sessionStorage.deleteLastSmsDate)
                    if ($sessionStorage.deleteLastSmsDate == true) {
                        $sessionStorage.deleteLastSmsDate = false;
                        delete $localStorage.lastSmsUploadDate;
                        console.log("last SMS upload date: " 
                                + $localStorage.lastSmsUploadDate || "no date");
                        $localStorage.unprocessedSms = [];
                    }
                    deferSetOptions.resolve();
                } , function (err) {
                    console.log('Options set error: ' + JSON.stringify(err));
                    deferSetOptions.resolve();
                });
                return deferSetOptions.promise;
            };
            if (!$sessionStorage.sms_plugin_key){
                AppUtils.getAppParams()
                .then(setSmsOptions)
                .then(processBulkSms);
            } else {
                setSmsOptions()
                .then(processBulkSms);
            }
        }
        if(SMS) {
            SMS.startWatch(function(){
        		console.log('watching', 'watching started');
        	}, function(){
        		console.log('failed to start watching');
        	});
        }   

        // Check internet connectivity and display offline or online status
        $sessionStorage.isOnline = $cordovaNetwork.isOnline();
        console.log("Online Status: " + $sessionStorage.isOnline)

        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            var onlineState = networkState;
            $sessionStorage.isOnline = $cordovaNetwork.isOnline();
            smsArriveListener({data: {body: "Refresh Connected"}});
            console.log("Online Status: " + $sessionStorage.isOnline)
//            $rootScope.$broadcast(AUTH_EVENTS.refreshData);
        });

        // listen for Offline event
        showOfflineAlert = function() {
            var alertPopup = $ionicPopup.alert({
                                title: "Neymo",
                                template: "Missing Internet Connection. Operating Offline!"
            });

            alertPopup.then(function (res) {
                console.log('Offline Alert Confirmed');
            });
        };
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            var offlineState = networkState;
            console.log("Online Status: " + $sessionStorage.isOnline);
            $sessionStorage.isOnline = $cordovaNetwork.isOnline();
            showOfflineAlert();
        });
    });

    smsArriveListener = function (e) {
        SmsListService.cleanProcessedSms();
        console.log(JSON.stringify(e));
        console.log("Process SMS on new arrival: " + JSON.stringify(SmsListService.processBulkSms(e)));
    };

    $ionicPlatform.on(AUTH_EVENTS.onSmsArrive, smsArriveListener);
    
    $localStorage.lists = $localStorage.lists || {};
}]);
