/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// File: dashboard/controllers.js

controllers.controller('DashCtrl', ['$scope'
                                    , '$http'
                                    , 'Accounts'
                                    , '$localStorage'
                                    , '$sessionStorage'
                                    , 'AUTH_EVENTS'
                                    , function($scope
                                                , $http
                                                , Accounts
                                                , $localStorage
                                                , $sessionStorage
                                                , AUTH_EVENTS
                                               ) {
    var refreshData = function () {
        console.log('Refreshing Dashboard Data');
        Accounts.all().then(function(resp){
            $scope.accountList = resp;
            });
    }
    
    refreshData();
    
    $scope.$on(AUTH_EVENTS.refreshData, refreshData);
    
    $scope.toggleDebug = function() {
        $sessionStorage.debugMode = $sessionStorage.debugMode ? !$sessionStorage.debugMode : false;
    };

}]);
