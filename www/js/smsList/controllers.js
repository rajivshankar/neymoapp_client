/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// File: smsList/controllers.js

controllers.controller('SMSListCtrl', ['$scope'
                                    , '$localStorage'
                                    , function($scope
                                               , $localStorage
                                               ) {
    $scope.lastSmsUploadDate = new Date("April 01, 2016 11:00:00");
    
    if (SMS) {
        SMS.listSMS({}, function (data) {
            $scope.smsList = data;
        });
    }
  
    $scope.isNumber = function (n) {
        $scope.personalText = false;
        if (n.length > 9) {
            $scope.lastTen = n.slice(-10);
            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
            //$scope.lastTen = data.address.slice(-10);
            if (isNumeric($scope.lastTen)) {
                $scope.personalText = true;
            }
        }
        return $scope.personalText;
    };
    
    // dateStr takes in a date in milliseconds
    // and returns the javascript dates in human readable formats
    $scope.dateStr = function(n) {
        var d = new Date(Number(n));
        return d.toString();
    };
    
    // checkDate takes the sms record as parameters
    // and returns whether the date falls later than last upload date
    // and returns true if later
    $scope.checkDate = function(sms) {
        tempDate = new Date(sms.date)
        if (tempDate.getTime() > ($scope.lastSmsUploadDate ? $scope.lastSmsUploadDate.getTime() : null)) {
            return true;
        } else {
            return false;
        }
    };

}]);
