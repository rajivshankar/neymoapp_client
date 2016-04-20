/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// js/reports/controllers.js

/*
 * Generic controller List controller to control the display of a 
 * list of items obtained from the backend
 */

controllers.controller('ListCtrl', ['$scope'
                                    , '$http'
                                    , 'GenericRestServices'
                                    , 'AUTH_EVENTS'
                                    , 'REST_PATH'
                                    , '$stateParams'
                                    , function($scope
                                                , $http
                                                , GenericRestServices
                                                , AUTH_EVENTS
                                                , REST_PATH
                                                , $stateParams
                                                        ) {
    var initialLink = REST_PATH.host + $stateParams.urlPath;
    var refreshData = function (link) {
        var entry = GenericRestServices.genericResource(link).get(function () {
            if (link === $scope.next){
                $scope.itemList = $scope.itemList.concat(entry.results);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.itemList = entry.results;
            }
            $scope.next = entry.next;
            $scope.previous = entry.previous;
            console.log('entry: ' + entry);
            console.log('$scope.itemList : ' + $scope.itemList);
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
    
    $scope.loadMoreItems = function() {
        if ($scope.next) {
            refreshData($scope.next);
        }
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMoreItems();
    });
    
    refreshData(initialLink);
    
    refreshDataCall = function () {
        refreshData(initialLink);
    };
    
    $scope.$on(AUTH_EVENTS.refreshData, refreshDataCall);
}]);
