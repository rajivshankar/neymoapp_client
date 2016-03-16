/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// File: dashboard/controllers.js

controllers.controller('DashCtrl', ['$scope'
                                    , 'Accounts'
                                    , '$localStorage'
                                    , function($scope
                                               , Accounts
                                               , $localStorage
                                               ) {
    Accounts.all().then(function(resp){
        $scope.accountList = resp;
        });
    
}]);
