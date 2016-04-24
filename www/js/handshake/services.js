/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// File: handshake/services.js

services.factory('HandshakeService', ['$http'
                                , '$localStorage'
                                , 'REST_PATH'
                                , '$q'
                                , function ($http
                                            , $localStorage
                                            , REST_PATH
                                            , $q
                                            ) {
    var service = {
        register: function(deviceRec) {
            /*
             * Checks if a token is present and returns the same if found
             * if the token is not present, checks for an email ID
             * If the email ID is present, sends the email ID and gets token
             * If there is no token, gets the phone number and checks for token 
             * If this is an existing phone number, returns token to an existing number
             * if the phone is new, creates a new token and marks it as new
             * 
             */
            var authTokenValue = '';
            var deferred = $q.defer();
            if (deviceRec) {
                console.log("Just before posting " + JSON.stringify(deviceRec) + " to " + REST_PATH.host + REST_PATH.device);
                $http.post(REST_PATH.host + REST_PATH.device, deviceRec)
                .then(function(response){
                    console.log("Successful $http. Auth Token: " + response.data.auth_token);
//                    $localStorage.deviceRecStr = JSON.stringify(deviceRec);
//                    $localStorage.userToken = response.data.auth_token;
//                    $localStorage.userID = response.data.user_id;
//                    $localStorage.devicePK = response.data.id;
//
//                    if ($localStorage.userToken) {
//                        // set default header "token"
//                        authTokenValue = "Token " + $localStorage.userToken;
//                        $http.defaults.headers.common.Authorization = authTokenValue;
//                    }
                    deferred.resolve(response.data.auth_token);
                }, function(error){
                    $localStorage.myErr = "Error for $http:" + error.statusText + deviceRec;
                    console.log("Error for $http: " + error.statusText);
                    deferred.reject(error.statusText);
                });
            } else {
                deferred.reject("Error in DeviceRec (Empty)");
            }
            return deferred.promise;
        }
    };
    return service;
}]);
