/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// debugInfo/controllers.js
controllers.controller('DebugInfoCtrl', ['$scope'
                                        , '$ionicPlatform'
                                        , '$localStorage'
                                        , 'AppUtils'
                                        , 'REST_PATH'
                                        , '$cordovaGeolocation'
                                        , 'DeviceInfoService'
                                        , '$sce'
                                        , '$http'
                                        , '$ionicLoading'
                                        , 'AUTH_EVENTS'
                                        , function ($scope
                                                    , $ionicPlatform
                                                    , $localStorage
                                                    , AppUtils
                                                    , REST_PATH
                                                    , $cordovaGeolocation
                                                    , DeviceInfoService
                                                    , $sce
                                                    , $http
                                                    , $ionicLoading
                                                    , AUTH_EVENTS
                                        ) {
    var posOptions;
    var d = new Date(Number(1459592334094));
    var tmpUrl = "";
    $scope.deviceRecStr =  $localStorage.deviceRecStr;
    $scope.deviceRec =  $localStorage.deviceRec;
    $scope.device_id = $localStorage.device;
    $scope.uuid = $localStorage.uuid;
    $scope.myErr = $localStorage.myErr;
    
    console.log("Before DeviceService call");
    DeviceInfoService.deviceInfo ()
    .then (function (deviceRec) {
        console.log("DeviceRec: " + JSON.stringify(deviceRec));
    }, function (errMessage) {
        console.log("Device Rec Error: " + Message);
    });

    if ($localStorage.userToken) {
        $scope.userToken = $localStorage.userToken;
        $scope.userID = $localStorage.userID;
        $scope.devicePK = $localStorage.devicePK;
    } else {
        $scope.userToken = "Undefined"
    }
    
    console.log("Is +22309040 a number: " + AppUtils.isNumber("+22309040"));
    console.log("Date :" + d.toString());
    console.log("Date ISO :" + d.toISOString());
    d = new Date(Date.now());
    d = new Date("April 01, 2016 10:59:59");
    console.log("Date Now :" + d.toString());

    $scope.lastSmsUploadDate = new Date("April 01, 2016 11:00:00");
    if (d.getTime() > ($scope.lastSmsUploadDate? $scope.lastSmsUploadDate.getTime() : Date.now())) {
        console.log("d is greater then lastSmsUploadDate" );
    } else {
        console.log("d is lesser then lastSmsUploadDate" );
    }
    
    if (d > null) {
        console.log("d is greater than null" );
    } else {
        console.log("d is lesser than null" );
    }
    
    console.log("Local Storage DeviceRec: " + $localStorage.deviceRec);
    console.log(REST_PATH.host);

    DeviceInfoService.geoLocation()
    .then (function (coordsData) {
        $scope.latitude  = coordsData.latitude;
        $scope.longitude = coordsData.longitude;
//        $scope.googleUrl = $sce.getTrustedResourceUrl("https://maps.googleapis.com/maps/api/staticmap?center="+$scope.latitude + "," + $scope.longitude+"&zoom=15&size=600x300&maptype=roadmap&key=AIzaSyCmU7xiNr4nqA03zEnZxutHc-a9p5epvaE");
        $scope.googleUrl = $sce.getTrustedResourceUrl("https://maps.googleapis.com/maps/api/staticmap?center="+$scope.latitude + "," + $scope.longitude+"&zoom=15&size=300x150&maptype=roadmap&key=AIzaSyCmU7xiNr4nqA03zEnZxutHc-a9p5epvaE");
        console.log('$scope.googleUrl: ' + $scope.googleUrl);
    }, function (error) {
        $scope.latitude  = null;
        $scope.longitude = null;
    });
    
    viewSmsList = function () {
        $scope.unprocessedSms = $localStorage.unprocessedSms ? JSON.stringify($localStorage.unprocessedSms) : "None";
    };
    
    viewSmsList();
    
    $scope.$on(AUTH_EVENTS.refreshData, viewSmsList);
    
    m1 = Date.now();
    d1 = new Date(m1);
    d2 = new Date(m1 + 1000);
    console.log("d1: " + d1);
    console.log("d2: " + d2);
    
}]);