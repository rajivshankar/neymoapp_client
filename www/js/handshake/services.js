/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// File: handshake/services.js

services.factory('HandshakeService', ['$http'
                                , '$rootScope'
                                , '$localStorage'
                                , 'Restangular'
                                , 'AUTH_EVENTS'
                                , function ($http
                                            , $rootScope
                                            , $localStorage
                                            , Restangular
                                            , AUTH_EVENTS
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
            $http.post('https://moneybee-20151115.herokuapp.com/restful/device.json'
//            $http.post('http://localhost:8000/restful/device/'
                        , deviceRec, { ignoreAuthModule: true })
            .then(function(response){
                    console.log("Successful $http. Auth Token: " + response.data.auth_token);
                    $localStorage.myErr = "Auth Token: " + response.data.auth_token;
                    $localStorage.userToken = response.data.auth_token;
                    $localStorage.userID = response.data.user_id;
                    $localStorage.devicePK = response.data.id;
                    
                    $rootScope.$broadcast(AUTH_EVENTS.loginConfirmed);

                    authTokenValue = "Token " + $localStorage.userToken;
                    Restangular.setDefaultHeaders({Authorization: authTokenValue});
//                    $http.defaults.headers.common.Authorization = authTokenValue;
                }, function(error){
                    $localStorage.myErr = "Error for $http:" + error.statusText + deviceRec;
                    console.log("Error for $http: " + error.statusText);
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                }
            );
            return authTokenValue;
        }
    };
    return service;
}]);
