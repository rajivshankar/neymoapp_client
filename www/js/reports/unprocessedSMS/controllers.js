/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// File: reports/unprocessedSMS/controllers.js

controllers.controller('UTextsCtrl', ['$scope'
                                    , '$http'
                                    , 'GenericRestServices'
                                    , 'AUTH_EVENTS'
                                    , 'REST_PATH'
                                    , function($scope
                                                , $http
                                                , GenericRestServices
                                                , AUTH_EVENTS
                                                , REST_PATH
                                                        ) {
    var initialLink = REST_PATH.host + REST_PATH.unprocessedText;
    var refreshData = function (link) {
        var entry = GenericRestServices.genericResource(link).get(function () {
            $scope.uTextList = entry.results;
            $scope.next = entry.next;
            $scope.previous = entry.previous;
            console.log('entry: ' + entry);
            console.log('$scope.uTextList : ' + $scope.uTextList);
        }, function (error) {
            console.log("error : " + JSON.stringify(error));
        });
    };
    
    $scope.prevButtonClick = function () {
        console.log('prev button click');
        if ($scope.previous) {
            console.log("Previous: " + $scope.previous)
            refreshData($scope.previous);
        }
    };
    
    $scope.nextButtonClick = function () {
        console.log('next button click');
        if ($scope.next) {
            console.log("Next: " + $scope.next)
            refreshData($scope.next);
        }
    };
    
    refreshData(initialLink);
    
    refreshDataCall = function () {
        refreshData(initialLink);
    };
    
    $scope.$on(AUTH_EVENTS.refreshData, refreshDataCall);
}]);