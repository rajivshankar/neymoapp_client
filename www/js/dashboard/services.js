/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// File: dashboard/services.js

services.factory('Accounts', ['$http', 'Restangular'
                                , function($http
                                            , Restangular) {
    return {
        all: function() {
            var baseAccounts = Restangular.all('accounts');
            return baseAccounts.getList();
}
    };
}]);
