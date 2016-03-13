/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// File: handshake/services.js

services.factory('Handshake', ['$http'
                                , '$localStorage'
                                , '$ionicPlatform'
                                , '$cordovaDevice'
                                , function($http
                                            , $localStorage
                                            , $ionicPlatform
                                            , $cordovaDevice) {
    return {
        token: function() {
            /*
             * Checks if a token is present and returns the same if found
             * if the token is not present, checks for an email ID
             * If the email ID is present, sends the email ID and gets token
             * If there is no token, gets the phone number and checks for token 
             * If this is an existing phone number, returns token to an existing number
             * if the phone is new, creates a new token and marks it as new
             * 
             */
            if ($localStorage.userToken) {
                return $localStorage.userToken
            }
            
            
        }
    };
}]);
