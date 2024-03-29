/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// File: smsList/services.js

services.factory('SmsListService', ['$localStorage'
                                    , '$q'
                                    , '$sessionStorage'
                                    , '$rootScope'
                                    , '$ionicPlatform'
                                    , '$http'
                                    , 'AUTH_EVENTS'
                                    , 'TEST_CONST'
                                    , 'REST_PATH'
                                    , 'DeviceInfoService'                                    
                                    , function($localStorage
                                                , $q
                                                , $sessionStorage
                                                , $rootScope
                                                , $ionicPlatform
                                                , $http
                                                , AUTH_EVENTS
                                                , TEST_CONST
                                                , REST_PATH
                                                , DeviceInfoService
                                               ) {
    var service = {};
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
    
    processSingleSms = function (sms, idx, smsProcessedList) {
        var deferred = $q.defer();
        var smsRestRec = {};
        var index = idx;

        console.log('sms: ' + sms.body);
        console.log(sms.date_sent); 
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
        console.log("Just before posting " + JSON.stringify(smsRestRec) +
                    " to " +
                    REST_PATH.host + REST_PATH.textInput);
        $http.post(REST_PATH.host + REST_PATH.textInput
                    , smsRestRec).then(function (result) {
            console.log("Success in single writing texts: " + sms.body + ' ' 
                            + JSON.stringify(smsRestRec));
            sms.processedFlag = 'Y';
            if (smsProcessedList) {
                smsProcessedList.push(sms);
            }
            $localStorage.unprocessedSms[index].processedFlag = 'Y';
            console.log("setting Y at index: " + index 
                            + " with " + sms.body);
            console.log($localStorage.unprocessedSms);
        }
        , function (error) {
            console.log("Failure in single writing texts " + sms.body + ' ' 
                            + JSON.stringify(smsRestRec));
            console.log("error: " + error.status + " " + error.statusText);
        });
        deferred.resolve(smsProcessedList);
        return deferred.promise;
    };
    
    processSmsList = function () {
        var smsList;
        var sms = {};
        var smsRestRec = {};
        var deferred = $q.defer();
        var smsProcessedList = [];
        
        if (!$localStorage.unprocessedSms) {
            $localStorage.unprocessedSms = [];
        }
        console.log("Inside processSmsList. Array Length: " 
                + $localStorage.unprocessedSms.length)
        for (var j in $localStorage.unprocessedSms) {
            console.log('$localStorage.unprocessedSms[' 
                    + j + ']: ' 
                    + $localStorage.unprocessedSms[j].body);
        }
        var smsList = $localStorage.unprocessedSms;
        
        console.log("Inside FUNCTION processSmsList: " 
                + $localStorage.lastSmsUploadDate || "no date");
        for (var i in smsList) {
            sms = smsList[i];
//            console.log("Processed: (" + sms.processedFlag 
//                          + ") sms: " + sms.body);
            smsRestRec = {};
            if (sms.processedFlag === 'N') {
                processSingleSms (sms, i)
                .then(function (smsProcessedList) {
                    console.log("Processed sms [" + i + "]: " + sms.body);
                });
            }
        }
        deferred.resolve();
        return deferred.promise;
    };
    
    processSmsBulk = function () {
        var smsList;
        var sms = {};
        var smsRestRec = {};
        var smsRestRecList = {};
        var deferred = $q.defer();
        
        if (!$localStorage.unprocessedSms) {
            $localStorage.unprocessedSms = [];
        }
        console.log("Inside processSmsBulk. Array Length: " 
                + $localStorage.unprocessedSms.length);
        var smsList = $localStorage.unprocessedSms;
        
        console.log("Inside FUNCTION processSmsBulk: " 
                + $localStorage.lastSmsUploadDate || "no date");
        smsRestRecList.data = [];
        for (var i in smsList) {
            sms = smsList[i];
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
            smsRestRecList.data.push(smsRestRec);
        }
        
        console.log("smsRecList.data: " + JSON.stringify(smsRestRecList));
        if (smsRestRecList.data.length>0){
            console.log("Just before posting to " 
                    + REST_PATH.host + REST_PATH.textInputBulk);
            $http.post(REST_PATH.host + REST_PATH.textInputBulk
                        , JSON.stringify(smsRestRecList))
//                        , smsRestRecList)
            .then(function (result) {
                console.log("Success in bulk writing texts: ");
                $localStorage.unprocessedSms = [];
                deferred.resolve();
            }, function (error) {
                console.log("Failure in bulk writing texts ");
                console.log("error: " + error.status + " " + error.statusText);
                deferred.resolve();
            });
        }
        return deferred.promise;
    };
        
    readSms = function (coordsData) {
        var readSmsDeferred = $q.defer();
        console.log("readSms called");
        var tempProcessSms = function (data) {
            var sms, smsRestRec;
            var lastSmsUploadDate = null;
            if (!$localStorage.unprocessedSms) {
                $localStorage.unprocessedSms = [];
            }
            console.log("Number of SMS: " + data.length);
            for (i in data) {
                sms = data[i];
//                console.log("Process sms[" + i + "]: " + JSON.stringify(sms))
                if (checkDate(sms)) {
                    console.log($localStorage.lastSmsUploadDate 
                            + " :(date check): " + sms.date);
                    if (!isNumber(sms.address) || (sms.address === TEST_CONST.number)) {
                        sms.processedFlag = 'N';
                        if ((Date.now() - sms.date) < TEST_CONST.timeMarginSec*1000) {
                            console.log("getting coordinates");
                            sms.latitude = coordsData.latitude;
                            sms.longitude = coordsData.longitude;
                            console.log("sms.latitude: " + sms.latitude);
                            console.log("sms.longitude: " + sms.longitude);
                        } else {
                            console.log("IGNORING coordinates");
                            sms.latitude = null;
                            sms.longitude = null;
                        }
                        $localStorage.unprocessedSms.push(sms);
                        if (lastSmsUploadDate) {
                            lastSmsUploadDate = (lastSmsUploadDate < sms.date) ? sms.date : lastSmsUploadDate;
                        } else {
                            lastSmsUploadDate = sms.date;
                        }
                        console.log('Updated lastSmsUploadDate: ' 
                                        + lastSmsUploadDate);
                    } else {
                        console.log("Non Service Text: " + sms.body);
                    }
                }
                else {
                    console.log("date check fail: " 
                                    + $localStorage.lastSmsUploadDate );
                    console.log("Not earlier date of sms: " + sms.date);
                }
            }
            console.log("Updated $localStorage.unprocessedSms: " 
                + JSON.stringify($localStorage.unprocessedSms));
            $localStorage.lastSmsUploadDate = lastSmsUploadDate || $localStorage.lastSmsUploadDate;
            console.log('$localStorage.lastSmsUploadDate: ' 
                    + $localStorage.lastSmsUploadDate);
            readSmsDeferred.resolve();
        };
        var tempErrProcessSms = function (err) {
            console.log("error processing SMS");
            readSmsDeferred.resolve();
        };
        $ionicPlatform.ready(function() {
            if (SMS) {
                console.log("Processing current SMS: " 
                        + $localStorage.lastSmsUploadDate || "no date");
                var smsCount = $sessionStorage.smsCount || 100;
                console.log("smsCount: " + smsCount);
                $sessionStorage.tmpCount = smsCount;
                var smsFilter = {
                    box: 'inbox',
                    indexFrom : 0, // start from index 0
                    maxCount : smsCount // count of SMS to return each time
                };
                console.log("smsFilter: " + JSON.stringify(smsFilter));
                SMS.listSMS(smsFilter, tempProcessSms, tempErrProcessSms);
            }
        });
        return readSmsDeferred.promise;
    };
    
    service = {
        processSms: function (smsData) {
            if (smsData) {
                console.log("Inside new sms to process " + smsData.data.body);
            }
//            cleanupResources = function () {
//                console.log("After processing SMS List "
//                        + "$localStorage.lastSmsUploadDate: " 
//                        + $localStorage.lastSmsUploadDate);
//                if (smsData) {
//                    console.log("After processing News SMS " 
//                                    + smsData.data.body);
//                    $rootScope.$broadcast(AUTH_EVENTS.refreshData);
//                }
//            };
//            
//            //Chain the following pomises to execute sequentially
//            DeviceInfoService.geoLocation()
//            .then(readSms)
//            .then(processSmsList)
//            .finally(cleanupResources);
//            return "Processing SMS...";
        },
        processBulkSms: function (smsData) {
            if (smsData) {
                console.log("Inside new sms to process " + smsData.data.body);
            }
            cleanupResources = function () {
                console.log("After processing SMS List "
                        + "$localStorage.lastSmsUploadDate: " 
                        + $localStorage.lastSmsUploadDate);
                if (smsData) {
                    console.log("After processing News SMS " 
                                    + smsData.data.body);
                    $rootScope.$broadcast(AUTH_EVENTS.refreshData);
                }
            };
            
            //Chain the following pomises to execute sequentially
            DeviceInfoService.geoLocation()
            .then(readSms)
            .then(processSmsBulk)
            .finally(cleanupResources);
            return "Processing SMS...";
        },
        cleanProcessedSms: function () {
            var tmpArray = [];
            console.log("Cleaning up Unprocessed SMS List...");
            for (var i in $localStorage.unprocessedSms) {
                if ($localStorage.unprocessedSms[i].processedFlag === 'N') {
                    tmpArray.push($localStorage.unprocessedSms[i]);
                }
            }
            $localStorage.unprocessedSms = tmpArray;
        }
    };
    return service;
}]);
