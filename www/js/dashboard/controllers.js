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
                                    , 'TEST_CONST'
                                    , function($scope
                                                , AccountInfoService
                                                , $localStorage
                                                , $sessionStorage
                                                , AUTH_EVENTS
                                                , TEST_CONST
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
    
    $scope.currencySymbol = TEST_CONST.rupeeSymbol;
    $scope.toggleHeaderPrompt = "Show Headers";
    $scope.showHeader = false;
    
    $scope.toggleHeader = function () {
        $scope.showHeader = !$scope.showHeader;
        $scope.toggleHeaderPrompt = $scope.showHeader ? "Hide Headers" : "Show Headers";
    }
    

}]);
