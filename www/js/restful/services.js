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

services.factory('GenericRestServices', ['$resource'
                                        , function ($resource
                                                    ) {
    service = {
        genericResource : function (link) {
            return $resource(link);
        }
    };
    return service;
}]);