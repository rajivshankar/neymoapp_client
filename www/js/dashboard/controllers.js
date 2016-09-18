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
                                    , '$timeout'
                                    , '$ionicPlatform'
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
                                                , $timeout
                                                , $ionicPlatform
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
    
    var createCategoryGrid = function (categoriesList
                                       , gridColumnNum
                                       ){
        categoriesGrid = [];
        rowNum = 0;
        for (i=0; i<categoriesList.length; i++) {
            if (!categoriesGrid[rowNum]){
                categoriesGrid[rowNum]=[];
            }
            try {
                console.log(categoriesList[i].category + '::' + categoriesList[i].icon_name);
                if (categoriesList[i].icon_name.substr(0,4) == 'mdi-'){
                    categoriesList[i].mdiOrIcon = 'mdi';
                } else {
                    categoriesList[i].mdiOrIcon = 'icon';
                }
                console.log(categoriesList[i].category + '::' + categoriesList[i].mdiOrIcon);
            }
            catch(err) {
                console.log("Category" + err.message);
                categoriesList[i].icon_name = "";
            }
            try {
                categoriesList[i].icon_colour = 'button-' + categoriesList[i].icon_colour;
                console.log(categoriesList[i].category + "::" + categoriesList[i].icon_colour);
            }
            catch(err) {
                console.log("Category" + err.message);
                categoriesList[i].icon_colour = "";
            }
            categoriesGrid[rowNum].push(categoriesList[i]);
            if ((i+1)%gridColumnNum === 0){
                rowNum += 1;
            }
        }
        return categoriesGrid;
    };
    
    //Code for recording cash transaction
    $scope.recordCashExpense = function () {
        console.log("Show the Modal");
        $scope.transaction = {};
        $scope.transaction.amount = "";
        $scope.transaction.amountStr = "0";//$scope.transaction.amount.toString();
        
        var categoriesList = CategoriesListService.get(function () {
            console.log("Categories list read success: " +
                            JSON.stringify(categoriesList.results));
            $scope.categoriesList = categoriesList.results;
            $localStorage.lists['categoriesList'] = $scope.categoriesList;
            $scope.categoriesGrid = createCategoryGrid($scope.categoriesList, 4);
            console.log("Category Grid (successful read): " +
                            JSON.stringify($scope.categoriesGrid));
        }, function (err) {
            console.log("Failed Categories List Read: " + JSON.stringify(err));
            $scope.categoriesList = $localStorage.lists['categoriesList'];
            $scope.categoriesGrid = createCategoryGrid($scope.categoriesList, 4);
            console.log("Category Grid (failed read): " +
                            JSON.stringify($scope.categoriesGrid));
        });
        
        $ionicPlatform.ready(function() {
            if (analytics) {
                var viewName = "Cash Transaction Input";
                analytics.trackView(viewName);
                console.log('View tracked by analytics: ' + viewName);
            }
        });
        $scope.cashExpenseModal.show();
    };
    
    $scope.closeCashExpenseModal = function () {
        console.log("Hide the Modal");
        $scope.cashExpenseModal.hide();
    };
    $scope.updateTextBoxAmount = function () {
//        console.log("updateTextBoxAmount ");
        if (Number($scope.transaction.amountStr) > 0){
            $scope.transaction.amount = Number($scope.transaction.amountStr);
        } else {
            $scope.transaction.amount = "";
        }
    };

    $scope.updateSliderAmount = function () {
//        console.log("updateSliderAmount");
        $scope.transaction.amountStr = $scope.transaction.amount.toString();
    };
    
    $scope.selectCategory = function (item) {
        $scope.selectedItem = item;
        console.log("item ID: " + $scope.selectedItem.id);
        console.log("item category: " + $scope.selectedItem.category);
        console.log("item category children: " + JSON.stringify($scope.selectedItem.children));
        console.log("Amount: " + $scope.transaction.amount);
        if ($scope.transaction.amount > 0) {
            var smsRec = {};
            var currTime = Date.now();
            $scope.subCategoriesGrid = createCategoryGrid($scope.selectedItem.children, 3);
            // Confirm save
            var saveCashTransaction = function(){
                console.log("Category: " + $scope.selectedItem.category);
                var textMessage = "Cash Expense of " + 
                                    TEST_CONST.defaultCurrency+
                                    " "+
                                    $scope.transaction.amount.toString()+
                                    " recorded for "+
                                    $scope.selectedItem.category;
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
                $ionicPlatform.ready(function() {
                    if (analytics) {
                        var eventCategory = "Cash";
                        var eventAction = "Input";
                        var eventLabel = $scope.selectedItem.category;
                        var eventValue = $scope.transaction.amount;
                        analytics.trackEvent(eventCategory
                                            , eventAction
                                            , eventLabel
                                            , eventValue);
                        console.log('Event tracked by analytics: ' +
                                            eventCategory + '::' +
                                            eventAction + '::' +
                                            eventLabel + '::' +
                                            eventValue.toString());
                    }
                });

                var confirmPopup = $ionicPopup.show({
                    title: "Success!",
                    template: textMessage
                });
                
                $timeout(function() {
                    confirmPopup.close(); //close the popup after 3 seconds for some reason
                }, 2000);
                
                $scope.closeCashExpenseModal();
            };

            var showPopup = $ionicPopup.show({
                title: '<h4>Confirm</h4>',
                subTitle: 'Choose sub-category below or confirm parent',
                templateUrl: 'templates/cashSubCategories.html',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel',
                        type: 'button-small',
                        onTap: function(e) {
                            console.log('You are not sure');
                        }
                    },
                    {
                        text: $scope.selectedItem.category,
                        type: 'button-positive button-small',
                        onTap: function(e) {
                            saveCashTransaction();
                        }
                    }
                ]
            });

            $scope.selectSubCategory = function (subItem) {
                console.log('Sub Item: ' + JSON.stringify(subItem));
                $scope.selectedItem = subItem;
                saveCashTransaction();
                showPopup.close();
            };
            
        } else {
            console.log("Amount is 0");
        }
    };
}]);
