/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// File: dashboard/controllers.js

controllers.controller('DashCtrl', ['$scope'
                                    , 'AccountInfoService'
                                    , 'ReportSQLService'
                                    , 'CategoriesListService'
                                    , 'SmsListService'
                                    , '$rootScope'
                                    , '$localStorage'
                                    , '$sessionStorage'
                                    , 'AUTH_EVENTS'
                                    , 'REPORT_NAMES'
                                    , 'TEST_CONST'
                                    , '$state'
                                    , '$ionicPopup'
                                    , '$ionicModal'
                                    , function($scope
                                                , AccountInfoService
                                                , ReportSQLService
                                                , CategoriesListService
                                                , SmsListService
                                                , $rootScope
                                                , $localStorage
                                                , $sessionStorage
                                                , AUTH_EVENTS
                                                , REPORT_NAMES
                                                , TEST_CONST
                                                , $state
                                                , $ionicPopup
                                                , $ionicModal
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
                            .reportResource(REPORT_NAMES.expense_by_vendor)
                            .get(function () {
            console.log("Expense by Vendor read success: " + JSON.stringify(expenseByVendorTop.results[0]));
            $scope.expenseByVendorTop = expenseByVendorTop.results[0];
            $localStorage.lists['expenseByVendorTop'] = $scope.expenseByVendorTop;
        }, function (err) {
            console.log("Failed Expense By Vendor Read: " + JSON.stringify(err));
            $scope.expenseByVendorTop = $localStorage.lists['expenseByVendorTop'];
        });

        var expenseCatTop = ReportSQLService
                            .reportResource(REPORT_NAMES.expense_by_category)
                            .get(function () {
            console.log("Expense Category Top read success: " + JSON.stringify(expenseCatTop.results[0]));
            $scope.expenseCatTop = expenseCatTop.results[0];
            $localStorage.lists['expenseCatTop'] = $scope.expenseCatTop;
        }, function (err) {
            console.log("Failed Expense Category Top Read: " + JSON.stringify(err));
            $scope.expenseCatTop = $localStorage.lists['expenseCatTop'];
        });

    };
    
    $scope.refreshData();
    
    $rootScope.$on(AUTH_EVENTS.refreshData, $scope.refreshData);
    
    $scope.toggleDebug = function() {
        $sessionStorage.debugMode = $sessionStorage.debugMode ? !$sessionStorage.debugMode : false;
    };
    
    $scope.currencySymbol = TEST_CONST.rupeeSymbol;
    $scope.showHeader = true;
    $scope.toggleHeaderPrompt = $scope.showHeader ? "Hide Headers" : "Show Headers";

    
    $scope.toggleHeader = function () {
        $scope.showHeader = !$scope.showHeader;
        $scope.toggleHeaderPrompt = $scope.showHeader ? "Hide Headers" : "Show Headers";
    };
    
    $scope.routeState = function (path) {
        console.log("Inside routeState: " + path);
        $state.go(path);
    };
    
    $ionicModal.fromTemplateUrl('templates/cashExpenseModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.cashExpenseModal = modal;
        console.log("Successfully created modal");
    });
    
    //Code for recording cash transaction
    $scope.recordCashExpense = function () {
        console.log("Show the Modal");
        $scope.transaction = {};
        $scope.transaction.amount = 0;
        $scope.transaction.amountStr = $scope.transaction.amount.toString();

        var categoryListGrid = function () {
            var gridColumnNum = 3;
            $scope.categoriesGrid = [];
            rowNum = 0;
            for (i=0; i<$scope.categoriesList.length; i++) {
                if (!$scope.categoriesGrid[rowNum]){
                    $scope.categoriesGrid[rowNum]=[];
                }
                $scope.categoriesGrid[rowNum].push($scope.categoriesList[i]);
                if ((i+1)%gridColumnNum === 0){
                    rowNum += 1;
                }
            }
        };
        
        var categoriesList = CategoriesListService.get(function () {
            console.log("Categories list read success: " +
                            JSON.stringify(categoriesList.results));
            $scope.categoriesList = categoriesList.results;
            $localStorage.lists['categoriesList'] = $scope.categoriesList;
            categoryListGrid()
            console.log("Category Grid (successful read): " +
                            JSON.stringify($scope.categoriesGrid));
        }, function (err) {
            console.log("Failed Categories List Read: " + JSON.stringify(err));
            $scope.categoriesList = $localStorage.lists['categoriesList'];
            categoryListGrid();
            console.log("Category Grid (failed read): " +
                            JSON.stringify($scope.categoriesGrid));
        });
        
        $scope.cashExpenseModal.show();
    };
    
    $scope.closeCashExpenseModal = function () {
        console.log("Hide the Modal");
        $scope.cashExpenseModal.hide();
    };
    
    $scope.updateTextBoxAmount = function () {
//        console.log("updateTextBoxAmount ");
        $scope.transaction.amount = Number($scope.transaction.amountStr);
    };

    $scope.updateSliderAmount = function () {
//        console.log("updateSliderAmount");
        $scope.transaction.amountStr = $scope.transaction.amount.toString();
    };
    
    $scope.selectCategory = function (item) {
        console.log("item ID: " + item.id);
        console.log("item category: " + item.category);
        console.log("Amount: " + $scope.transaction.amount);
        if ($scope.transaction.amount > 0) {
            var smsRec = {};
            var currTime = Date.now();
            var textMessage = "Cash Expense of " + 
                                TEST_CONST.defaultCurrency+
                                " "+
                                $scope.transaction.amount.toString()+
                                " recorded for "+
                                item.category;
            // Confirm save
            var confirmPopup = $ionicPopup.confirm({
                title: '<h4>Confirm Cash Transaction</h4>',
                template: textMessage,
                cancelType: 'button button-small',
                okText: 'Save',
                okType: 'button-positive button-small'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    smsRec._id = 0;
                    smsRec.address = "NM-CASHTX";
                    smsRec.body = textMessage;
                    smsRec.date = currTime;
                    smsRec.date_sent = currTime;
                    smsRec.error_code = 0;
                    smsRec.ipmsg_id =  0;
                    smsRec.locked = 0;
                    smsRec.m_size = textMessage.length;
                    smsRec.person = 0;
                    smsRec.protocol= 0;
                    smsRec.read = 1;
                    smsRec.reply_path_present = 0;
                    smsRec.seen = 1;
                    smsRec.service_center = "+000000000000";
                    smsRec.sim_id = 1;
                    smsRec.status = -1;
                    smsRec.thread_id = 0;
                    smsRec.type= 1;
                    smsRec.latitude = null;
                    smsRec.longitude = null;

                    smsData = {};
                    smsData.data = smsRec;
                    console.log(JSON.stringify(smsData));
                    SmsListService.cleanProcessedSms();
                    $localStorage.unprocessedSms.push(smsRec);
                    console.log("Process SMS on new arrival: " +
                            JSON.stringify(SmsListService.processBulkSms(smsData)));
                    $scope.closeCashExpenseModal();
                } else {
                    console.log('You are not sure');
                }
            });
        } else {
            console.log("Amount is 0");
        }
    };
}]);
