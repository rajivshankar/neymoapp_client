/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// File: reports/unprocessedSMS/controllers.js

controllers.controller('UTextsCtrl', ['$scope'
                                    , '$http'
                                    , 'UTextService'
                                    , 'BulkTextService'
                                    , 'UserInfoService'
                                    , 'TextDataService'
                                    , 'AUTH_EVENTS'
                                    , function($scope
                                                , $http
                                                , UTextService
                                                , BulkTextService
                                                , UserInfoService
                                                , TextDataService
                                                , AUTH_EVENTS
                                                        ) {
//    UTexts.all().then(function(resp){
//        $scope.uTextList = resp;
//    });
    
    var refreshData = function () {
        console.log('Refreshing SMS list data');
        var entry = TextDataService.get(function () {
            $scope.uTextList = entry.results;
            console.log($scope.uTextList);
            console.log($http.defaults.headers.common);
        }, function (error) {
            console.log("error : " + JSON.stringify(error));
        });
    }

    refreshData();
    
    $scope.$on(AUTH_EVENTS.refreshData, refreshData);
    
}]);