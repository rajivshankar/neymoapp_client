// File: services.js

var services = angular.module('moneyProApp.services',   ['ngLodash'
                                                        , 'restangular']);

services.config(['RestangularProvider', function(RestangularProvider) {
    _.contains = _.includes // to have lodash to work with Restangular
    // If Restangular ever updates to lodash 4.0 remove this.
    baseUrlStr = 'https://moneybee-20151115.herokuapp.com/restful';
    baseUrlStr = 'http://localhost:8000/restful';
    RestangularProvider.setBaseUrl(baseUrlStr);
    RestangularProvider.setRequestSuffix('.json');

    // add a response intereceptor
    splitGetList = function(data, operation, what, url, response, deferred) {
        var extractedData;
        // .. to look for getList operations
        if (operation === "getList") {
            // .. and handle the data and meta data
            extractedData = data.results;
            extractedData.count = data.count;
            extractedData.next = data.next;
            extractedData.previous = data.previous;
        } else {
            extractedData = data.results;
        }
        return extractedData;
    };
        RestangularProvider.addResponseInterceptor(splitGetList);
}]);

                            

