/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// File: smsList/services.js

services.factory('SmsListService', ['$localStorage'
                                    , '$q'
                                    , '$rootScope'
                                    , '$ionicPlatform'
                                    , '$http'
                                    , 'AUTH_EVENTS'
                                    , 'TEST_CONST'
                                    , 'DeviceInfoService'                                    
                                    , function($localStorage
                                                , $q
                                                , $rootScope
                                                , $ionicPlatform
                                                , $http
                                                , AUTH_EVENTS
                                                , TEST_CONST
                                                , DeviceInfoService
                                               ) {
    var service = {};
    var smsFilteredList = [];
    var tempUnprocessedSms = [];
    var readSms;
    
    // to check if the sender number is a phone number
    // if it isn't it would be a service text
    function isNumber (n) {
        var personalText = false;
        var lastTen = '';
        if (n.length > 9) {
            lastTen = n.slice(-10);
            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
            if (isNumeric(lastTen)) {
                personalText = true;
            }
        }
        return personalText;
    };
    
    // dateStr takes in a date in milliseconds
    // and returns the javascript dates in human readable formats
    function dateStr (n) {
        var d = new Date(Number(n));
        return d.toString();
    };
    
    // checkDate takes the sms record as parameters
    // and returns whether the date falls later than last upload date
    // and returns true if later
    function checkDate (sms) {
        return (sms.date > ($localStorage.lastSmsUploadDate || null));
    };
    
    success = function (response){
        console.log (response.data);
    };
    
    failure = function (errResponse) {
        console.log (errResponse.statusText);
    };
    
    processSms = function (data, ignoreDate) {
        var smsList = data;
        var sms = {};
        var smsRestRec = {};
        var smsProcessed = false;
        var deferred = $q.defer();
        
        smsFilteredList = [];
        if (!$localStorage.unprocessedSms) {
            $localStorage.unprocessedSms = [];
        }
        console.log("Inside FUNCTION processSms: " + $localStorage.lastSmsUploadDate || "no date");
        for (var i in smsList) {
            sms = smsList[i];
            smsRestRec = {};
            if (checkDate(sms) || ignoreDate) {
                console.log("Process Sms (date check): " + JSON.stringify(sms));
                if (!isNumber(sms.address) || (sms.address === TEST_CONST.number)) {
                    smsRestRec.text_message = unescape(encodeURIComponent(sms.body));
                    smsRestRec.sender = sms.address;
                    d = new Date(sms.date_sent);
                    smsRestRec.sent_datetime = d.toISOString();
                    d = new Date(sms.date);
                    smsRestRec.received_datetime = d.toISOString();
                    smsRestRec.service_centre = sms.service_center;
                    smsRestRec.location_latitude = sms.latitude || null;
                    smsRestRec.location_longitude = sms.longitude || null;

                    smsRestRec = JSON.parse(JSON.stringify(smsRestRec));
                    smsProcessed =true;

                    $http.post('https://moneybee-20151115.herokuapp.com/restful/text-data.json'
                                , smsRestRec).then(function (result) {
                        console.log("Success in single writing texts" + sms.body + ' ' + JSON.stringify(smsRestRec));
                        console.log("result: " + result);
                        $localStorage.lastSmsUploadDate = Date.now();
                    }
                    , function (error) {
                        console.log("Failure in single writing texts " + sms.body + ' ' + JSON.stringify(smsRestRec));
                        console.log("error: " + error.status + " " + error.statusText);
                        $localStorage.unprocessedSms.push(sms);
                    });
                    smsFilteredList.push(smsRestRec);
                } else {
                    console.log("Non Service Text: " + sms.body);
                }
            }
        }
        deferred.resolve();
        
        return deferred.promise;
    }
    
    readSms = function () {
        var tempDeferred = $q.defer();
        var tempProcessSms = function (data) {
            // processSMS without ignoring date
            processSms(data, false)
            .then (function () {
                tempDeferred.resolve(null);
            })
        }
        var tempErrProcessSms = function (err) {
            console.log("error processing SMS");
            tempDeferred.resolve(null);
        }
        console.log("Just before check platform");
        $ionicPlatform.ready(function() {
            if (SMS) {
                console.log("Processing current SMS: " + $localStorage.lastSmsUploadDate || "no date");
                SMS.listSMS({}, tempProcessSms, tempErrProcessSms)
            }
        });
        return tempDeferred.promise;
    }
    
    service = {
        processDeviceSms: function () {
            readSms ()
            .then( function() {
                console.log("Processing PAST Unprocessed SMS");
                tempUnprocessedSms = $localStorage.unprocessedSms;
                $localStorage.unprocessedSms = [];
                // process SMS ignoring  the date
                return processSms(tempUnprocessedSms, true);
            }, function () {
                console.log("Error processing PAST Unprocessed SMS");
//            })
//            .finally (function () {
//                $rootScope.$broadcast(AUTH_EVENTS.refreshData);
            });
        },
        processNewSms: function (e) {
            readSms()
            .then( function() {
                console.log("Processing new SMS");
                return DeviceInfoService.geoLocation();
            })
            .then(function (coordsData) {
                var smsList = [];
                e.data.latitude  = coordsData.latitude ? coordsData.latitude : null;
                e.data.longitude = coordsData.longitude ? coordsData.longitude : null;
                smsList.push(e.data);
                // process SMS ignoring  the date
                return processSms(smsList, true)
            })
            .then (function () {
                console.log("Processing PAST Unprocessed SMS");
                tempUnprocessedSms = $localStorage.unprocessedSms;
                console.log("tempUnprocessedSms: " + tempUnprocessedSms);
                $localStorage.unprocessedSms = [];
                // process SMS ignoring  the date
                return processSms(tempUnprocessedSms, true);
            })
            .catch (function () {
                    console.log("Error processing Unprocessed SMS");
            })
            .finally (function () {
                $rootScope.$broadcast(AUTH_EVENTS.refreshData);
            });
        }
    };
    return service;
}]);
