// File: controllers.js
var controllers = angular.module('moneyProApp.controllers', []);

controllers.controller('AppCtrl', ['$scope'
                                    , '$rootScope'
                                    , '$ionicPlatform'
                                    , '$localStorage'
                                    , '$sessionStorage'
                                    , '$cordovaNetwork'
                                    , '$ionicPopup'
                                    , 'HandshakeService'
                                    , 'SmsListService'
                                    , 'AUTH_EVENTS'
                                    , 'DeviceInfoService'
                                    , function ($scope
                                                , $rootScope
                                                , $ionicPlatform
                                                , $localStorage
                                                , $sessionStorage
                                                , $cordovaNetwork
                                                , $ionicPopup
                                                , HandshakeService
                                                , SmsListService
                                                , AUTH_EVENTS
                                                , DeviceInfoService
                                    ) {
    /*
     * Define the Login Modal
     * clean up the login modal once the destroy event occurs
     */
    $scope.debugMode = $sessionStorage.debugMode;

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
    
//    if (!$localStorage.firstFullSmsRun) {
//        console.log("Inside first full SMS run");
//        delete $localStorage.lastSmsUploadDate;
//        $localStorage.firstFullSmsRun = true;
//    }
//    delete $localStorage.firstFullSmsRun;
    $ionicPlatform.ready(function() {
//        if(SMS) SMS.setOptions({
//            license: 'rajiv.shankar@yahoo.com/ee874cd88f918b376be664e7b334a210'
//        }, function (data) {
//            console.log('OPtions set success: ' + JSON.stringify(data));
//        } , function (err) {
//            console.log('Options set error: ' + JSON.stringify(err));
//        });
        if(SMS) {
            SMS.startWatch(function(){
        		console.log('watching', 'watching started');
        	}, function(){
        		console.log('failed to start watching');
        	});
//            SMS.listSMS({}, function (data) {
//                console.log('SMS data: ' + JSON.stringify(data));
//            } , function (err) {
//                console.log('SMS data error: ' + JSON.stringify(err));
//            });
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
//    delete $localStorage.lastSmsUploadDate;
    processAllSms = function () {
        SmsListService.cleanProcessedSms();
        console.log("Process All SMS: " + JSON.stringify(SmsListService.processSms()));
    };
    
    processAllSms();

    smsArriveListener = function (e) {
        SmsListService.cleanProcessedSms();
        console.log("Process SMS on new arrival: " + JSON.stringify(SmsListService.processSms(e)));
    };

    $ionicPlatform.on(AUTH_EVENTS.onSmsArrive, smsArriveListener);
    
    $localStorage.lists = $localStorage.lists || {};
}]);
