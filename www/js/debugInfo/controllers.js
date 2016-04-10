/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// debugInfo/controllers.js
controllers.controller('DebugInfoCtrl', ['$scope'
                                        , '$localStorage'
                                        , 'AppUtils'
                                        , function ($scope
                                                    , $localStorage
                                                    , AppUtils
                                        ) {
    
    var d = new Date(Number(1459592334094));
    $scope.deviceRecStr =  $localStorage.deviceRecStr;
    $scope.deviceRec =  $localStorage.deviceRec;
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
    
    console.log("Is +22309040 a number: " + AppUtils.isNumber("+22309040"));
    console.log("Date :" + d.toString())
    console.log("Date ISO :" + d.toISOString())
    d = new Date(Date.now())
    console.log("Date Now :" + d.toString())

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
}]);