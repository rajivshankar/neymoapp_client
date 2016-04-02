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
}]);
