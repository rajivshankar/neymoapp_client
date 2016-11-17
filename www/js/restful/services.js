/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// restful/services.js

/*
 * This service helps us define all the service we would need to interact
 * with server side calls to the python middleware
 */

services.factory('AppParamService', ['$resource'
                                , 'REST_PATH'
                                , function ($resource
                                            , REST_PATH
                                                    ) {
    return $resource(REST_PATH.host + 'app_params/');
}]);

services.factory('SmsService', ['$resource'
                                , 'REST_PATH'
                                , function ($resource
                                            , REST_PATH
                                                    ) {
    return $resource(REST_PATH.host + 'text-data/');
}]);

services.factory('UTextService', ['$resource'
                                , 'REST_PATH'
                                , function ($resource
                                            , REST_PATH
                                                    ) {
    return $resource(REST_PATH.host + 'unprocessed_text_data/');
}]);

services.factory('TextDataService', ['$resource'
                                    , 'REST_PATH'
                                    , function ($resource
                                                , REST_PATH
                                                        ) {
//    console.log(REST_PATH.host + 'text-data/');
    return $resource(REST_PATH.host + 'text-data/');
}]);

services.factory('BulkTextService', ['$resource'
                                    , 'REST_PATH'
                                    , function ($resource
                                                , REST_PATH
                                                        ) {
//    console.log(REST_PATH.host + 'bulk/bulk_text/');
    return $resource(REST_PATH.host + 'bulk/bulk_text/');
}]);

services.factory('UserInfoService', ['$resource'
                                , 'REST_PATH'
                                , function ($resource
                                            , REST_PATH
                                                    ) {
    return $resource(REST_PATH.host + 'users/');
}]);

services.factory('AccountInfoService', ['$resource'
                                , 'REST_PATH'
                                , function ($resource
                                            , REST_PATH
                                                    ) {
    return $resource(REST_PATH.host + 'accounts/');
}]);

services.factory('BalanceSummaryService', ['$resource'
                                , 'REST_PATH'
                                , function ($resource
                                            , REST_PATH
                                                    ) {
    return $resource(REST_PATH.host + 'balance_summary/');
}]);

services.factory('ReportSQLService', ['$resource'
                                , 'REST_PATH'
                                , function ($resource
                                            , REST_PATH
                                                    ) {
    service = {
        reportResource : function (reportName) {
            console.log('SQL Service Path: ' + REST_PATH.host + 'reports/' + reportName + '/')
            return $resource(REST_PATH.host + 'reports/' + reportName + '/');
        }
    };
    return service;
}]);

services.factory('ReportsGCService', ['$resource'
                                , 'REST_PATH'
                                , function ($resource
                                            , REST_PATH
                                                    ) {
    return $resource(REST_PATH.host + 'reports_google_charts/');
}]);

services.factory('CategoriesListService', ['$resource'
                                , 'REST_PATH'
                                , function ($resource
                                            , REST_PATH
                                                    ) {
    return $resource(REST_PATH.host + 'main_categories/');
}]);

services.factory('ActivityFeedService', ['$resource'
                                , 'REST_PATH'
                                , function ($resource
                                            , REST_PATH
                                                    ) {
    return $resource(REST_PATH.host + 'activity_feed/');
}]);

services.factory('GenericRestServices', ['$resource'
                                        , function ($resource
                                                    ) {
    service = {
        genericResource : function (link) {
            console.log('Generic Resource Path: ' + link)
            return $resource(link);
        }
    };
    return service;
}]);