/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// File: activityFeed/controllers.js

controllers.controller('ActivityFeedCtrl', ['$scope'
                                            , 'ActivityFeedService'
                                            , '$ionicPopup'
                                            , '$ionicPlatform'
                                            , '$localStorage'
                                            , 'GenericRestServices'
                                            , 'ReportsService'
                                            , 'AUTH_EVENTS'
                                            , 'REST_PATH'
                                            , 'REPORT_NAMES'
                                            , '$stateParams'
                                            , '$rootScope'
                                            , '$ionicPopup'
                                            , '$ionicModal'
                                            , '$state'
                                            , function($scope
                                                        , ActivityFeedService
                                                        , $ionicPopup
                                                        , $ionicPlatform
                                                        , $localStorage
                                                        , GenericRestServices
                                                        , ReportsService
                                                        , AUTH_EVENTS
                                                        , REST_PATH
                                                        , REPORT_NAMES
                                                        , $stateParams
                                                        , $rootScope
                                                        , $ionicPopup
                                                        , $ionicModal
                                                        , $state
                                                                ) {
    $scope.refreshData = function () {
        var activityFeed = ActivityFeedService.get(function () {
            console.log("Activity Feed read success: " + JSON.stringify(activityFeed.results));
            $scope.activityFeed = activityFeed.results;
            $localStorage.lists['activityFeed'] = $scope.activityFeed;
//            $scope.activityFeed.theme_colour = 'item-' +
//                                            $scope.activityFeed.theme_colour
        }, function (err) {
            console.log("Failed Balance Summary Read: " + JSON.stringify(err));
            try{
                $scope.activityFeed = $localStorage.lists['activityFeed'];
            }
            catch(err) {
                console.log("No local activityFeed :" + err.message);
            }
        });
    };
    
    $ionicModal.fromTemplateUrl('templates/charts_d3.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.chartModal = modal;
        console.log("Successfully created modal");
    });
    
    $scope.showChart = function (activityFeedItem) {
        $scope.activityFeedItem = activityFeedItem;
        console.log("data: " + JSON.stringify(activityFeedItem.chart_data));
        console.log("type: " + JSON.stringify(activityFeedItem.chart_object));
        chartOptions = activityFeedItem.chart_options;
        $scope.data = activityFeedItem.chart_data;
        console.log("data: " + JSON.stringify($scope.data));
        $scope.options = ReportsService.setChartOptions(chartOptions);
        console.log("options: " + JSON.stringify($scope.options));
        $scope.chartModal.show();
    };
    $scope.closeChartModal = function () {
        console.log("Hide the Modal");
        $scope.chartModal.hide();
    };
    $scope.refreshData();
}]);