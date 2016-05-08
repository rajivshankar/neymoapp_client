/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// File: dashboard/controllers.js

controllers.controller('DashCtrl', ['$scope'
                                    , 'AccountInfoService'
                                    , 'ReportSQLService'
                                    , '$localStorage'
                                    , '$sessionStorage'
                                    , 'AUTH_EVENTS'
                                    , 'REPORT_NAMES'
                                    , 'TEST_CONST'
                                    , '$state'
                                    , function($scope
                                                , AccountInfoService
                                                , ReportSQLService
                                                , $localStorage
                                                , $sessionStorage
                                                , AUTH_EVENTS
                                                , REPORT_NAMES
                                                , TEST_CONST
                                                , $state
                                               ) {
    $scope.refreshData = function () {
        console.log('Refreshing Dashboard Data');
        console.log("IsOnline is: " + $sessionStorage.isOnline);
//        var accountEntry = AccountInfoService.get(function () {
//            console.log("Account read Success: " + JSON.stringify(accountEntry));
//            $scope.accountList = accountEntry.results;
//            $localStorage.lists['accountList'] = $scope.accountList;
//        }, function (err) {
//            console.log("Failed Account Read: " + JSON.stringify(err));
//            $scope.accountList = $localStorage.lists['accountList'];
//        });
        
        var balanceSummary = ReportSQLService
                            .reportResource(REPORT_NAMES.balance_summary)
                            .get(function () {
            console.log("Balance Summary read success: " + JSON.stringify(balanceSummary.results[0]));
            $scope.balanceSummary = balanceSummary.results[0];
            $localStorage.lists['balanceSummary'] = $scope.balanceSummary;
        }, function (err) {
            console.log("Failed Balance Summary Read: " + JSON.stringify(err));
            $scope.balanceSummary = $localStorage.lists['balanceSummary'];
        });

        var expenseSummary = ReportSQLService
                            .reportResource(REPORT_NAMES.expense_summary)
                            .get(function () {
            console.log("Expense Summary read success: " + JSON.stringify(expenseSummary.results[0]));
            $scope.expenseSummary = expenseSummary.results[0];
            $localStorage.lists['expenseSummary'] = $scope.expenseSummary;
        }, function (err) {
            console.log("Failed Expense Summary Read: " + JSON.stringify(err));
            $scope.expenseSummary = $localStorage.lists['expenseSummary'];
        });
        
        var expenseByVendorTop = ReportSQLService
                            .reportResource(REPORT_NAMES.expense_by_vendor_top)
                            .get(function () {
            console.log("Expense by Vendor read success: " + JSON.stringify(expenseByVendorTop.results[0]));
            $scope.expenseByVendorTop = expenseByVendorTop.results[0];
            $localStorage.lists['expenseByVendorTop'] = $scope.expenseByVendorTop;
        }, function (err) {
            console.log("Failed Expense By Vendor Read: " + JSON.stringify(err));
            $scope.expenseByVendorTop = $localStorage.lists['expenseByVendorTop'];
        });

        var expenseTop = ReportSQLService
                            .reportResource(REPORT_NAMES.expense_top)
                            .get(function () {
            console.log("Expense Top read success: " + JSON.stringify(expenseTop.results[0]));
            $scope.expenseTop = expenseTop.results[0];
            $localStorage.lists['expenseTop'] = $scope.expenseTop;
        }, function (err) {
            console.log("Failed Expense Top Read: " + JSON.stringify(err));
            $scope.expenseTop = $localStorage.lists['expenseTop'];
        });

        var expenseCatTop = ReportSQLService
                            .reportResource(REPORT_NAMES.expense_by_category_top)
                            .get(function () {
            console.log("Expense Category Top read success: " + JSON.stringify(expenseCatTop.results[0]));
            $scope.expenseCatTop = expenseCatTop.results[0];
            $localStorage.lists['expenseCatTop'] = $scope.expenseCatTop;
        }, function (err) {
            console.log("Failed Expense Category Top Read: " + JSON.stringify(err));
            $scope.expenseCatTop = $localStorage.lists['expenseCatTop'];
        });

    }
    
    $scope.refreshData();
    
    $scope.$on(AUTH_EVENTS.refreshData, $scope.refreshData);
    
    $scope.toggleDebug = function() {
        $sessionStorage.debugMode = $sessionStorage.debugMode ? !$sessionStorage.debugMode : false;
    };
    
    $scope.currencySymbol = TEST_CONST.rupeeSymbol;
    $scope.showHeader = true;
    $scope.toggleHeaderPrompt = $scope.showHeader ? "Hide Headers" : "Show Headers";

    
    $scope.toggleHeader = function () {
        $scope.showHeader = !$scope.showHeader;
        $scope.toggleHeaderPrompt = $scope.showHeader ? "Hide Headers" : "Show Headers";
    }
    
    $scope.routeState = function (path) {
        console.log("Inside routeState: " + path);
        $state.go(path);
    };
}]);
