// File: services.js

var services = angular.module('moneyProApp.services', []);

services.factory('AppUtils', function ()
                                    {
    service = {
        isNumber: function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
    };
    return service;
});
