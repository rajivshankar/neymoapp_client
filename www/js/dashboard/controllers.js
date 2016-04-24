/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// File: dashboard/controllers.js

controllers.controller('DashCtrl', ['$scope'
                                    , 'AccountInfoService'
                                    , '$localStorage'
                                    , '$sessionStorage'
                                    , 'AUTH_EVENTS'
                                    , function($scope
                                                , AccountInfoService
                                                , $localStorage
                                                , $sessionStorage
                                                , AUTH_EVENTS
                                               ) {
    var refreshData = function () {
        console.log('Refreshing Dashboard Data');
        console.log("IsOnline is: " + $sessionStorage.isOnline);
        var accountEntry = AccountInfoService.get(function () {
            console.log("Account read Success: " + JSON.stringify(accountEntry));
            $scope.accountList = accountEntry.results;
            $localStorage.lists['accountList'] = $scope.accountList;
        }, function (err) {
            console.log("Failed Account Read: " + JSON.stringify(err));
            $scope.accountList = $localStorage.lists['accountList'];
        });
    }
    
    refreshData();
    
    $scope.$on(AUTH_EVENTS.refreshData, refreshData);
    
    $scope.toggleDebug = function() {
        $sessionStorage.debugMode = $sessionStorage.debugMode ? !$sessionStorage.debugMode : false;
    };

}]);
