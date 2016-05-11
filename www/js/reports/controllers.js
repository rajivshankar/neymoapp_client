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
                                    , '$ionicPopup'
                                    , '$localStorage'
                                    , 'GenericRestServices'
                                    , 'AUTH_EVENTS'
                                    , 'REST_PATH'
                                    , '$stateParams'
                                    , '$state'
                                    , function($scope
                                                , $ionicPopup
                                                , $localStorage
                                                , GenericRestServices
                                                , AUTH_EVENTS
                                                , REST_PATH
                                                , $stateParams
                                                , $state
                                                        ) {
    var initialLink = REST_PATH.host + $stateParams.urlPath;
    // for offline work
    var listKey = $stateParams.listKey
    $scope.refreshData = function (link) {
        var entry = GenericRestServices.genericResource(link).get(function () {
            if (link === $scope.next){
                $scope.itemList = $scope.itemList.concat(entry.results);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.itemList = entry.results;
                $localStorage.lists[listKey] = $scope.itemList;
            }
            $scope.next = entry.next;
            $scope.previous = entry.previous;
            console.log('entry: ' + JSON.stringify(entry));
            console.log('$scope.itemList : ' + JSON.stringify($scope.itemList));
        }, function (error) {
            console.log("error : " + JSON.stringify(error));
            $scope.itemList = $localStorage.lists[listKey];
        });
    };
    
    $scope.loadMoreItems = function() {
        if ($scope.next) {
            $scope.refreshData($scope.next);
        }
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMoreItems();
    });
    
    $scope.refreshData(initialLink);
    
    $scope.refreshDataCall = function () {
        console.log("Refreshing data call to " + initialLink)
        $scope.refreshData(initialLink);
    };
    
    $scope.$on(AUTH_EVENTS.refreshData, $scope.refreshDataCall);
    
    $scope.routeState = function (path, params) {
        console.log("Inside routeState: " + path + params);
        if (params) {
            $state.go(path, params);
        }
        else {
            $state.go(path);
        }
    };
    
    $scope.showPopup = function (msg) {
        console.log("Inside showPopup: " + JSON.stringify(msg));
        if (msg.title) {
            var myPopup = $ionicPopup.show({
                template: msg.text,
                title: msg.title || 'Text Message',
                buttons: [
                  {
                    text: 'Close',
                    type: 'button-positive',
                    onTap: function(e) {
                        try{
                            console.log("e: " + JSON.stringify(e));
                        }
                        catch(e) {
                            console.log("Tapped error" + e.message);
                        }
                        return true;
                    }
                  }
                ]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);
            });
        }
    };
}]);


controllers.controller('ReportsCtrl', ['$scope'
                                        , '$ionicPopup'
                                        , 'ReportsGCService'
                                        , 'AUTH_EVENTS'
                                        , function($scope
                                                    , $ionicPopup
                                                    , ReportsGCService
                                                    , AUTH_EVENTS
                                                            ) {
    /*
     * This control helps the actual html to loop through all the 
     * relevant reports for the user and displays them as buttons
     * 
     * HAve a json object
     */
    
    var getChartObjects = function () {
        $scope.chartList = [];
        $scope.refreshing = true;
        var chartObjectsSet = ReportsGCService.get(function () {
            console.log("Reports read Success: ");
            $scope.chartList = chartObjectsSet.results;
            console.log("$scope.chartList : " + $scope.chartList);
            $scope.refreshing = false;
        }, function (err) {
            console.log("Failed ReportsRead: " + JSON.stringify(err));
            $scope.chartList = [];
            $scope.refreshing = false;
        });
    };
    
    $scope.chartObject = {};
    
    getChartObjects();
    
    $scope.refreshData = function () {
        $scope.chartList = [];
        getChartObjects();
    };
    
    $scope.$on(AUTH_EVENTS.refreshData, getChartObjects);

    $scope.showChart = function (chartObj) {
        $scope.chartObject = chartObj;
        if(chartObj) {
            var myPopup = $ionicPopup.show({
                template: '<div google-chart chart="chartObject" style="height:100%; width:100%;"></div>',
                scope: $scope,
                buttons: [
                  {
                    text: 'Close',
                    type: 'button-small',
                    onTap: function(e) {
                        try{
                            console.log("e: " + JSON.stringify(e));
                        }
                        catch(e) {
                            console.log("Tapped error" + e.message);
                        }
                        return true;
                    }
                  }
                ]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);
            });
        }
    }
}]);
 
