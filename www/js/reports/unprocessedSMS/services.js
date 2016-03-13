/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// File: reports/unprocessedSMS/services.js

services.factory('UTexts', ['$http', 'Restangular', function($http, Restangular) {
    return {
        all: function() {
            var baseAccounts = Restangular.all('unprocessed_text_data');
            return baseAccounts.getList();
        }
    };
}]);
