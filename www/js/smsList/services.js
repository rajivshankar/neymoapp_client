/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// File: smsList/services.js

services.factory('SmsListService', ['$localStorage'
                                    , '$rootScope'
                                    , '$ionicPlatform'
                                    , 'BulkTextService'
                                    , 'TextDataService'
                                    , '$http'
                                    , 'AUTH_EVENTS'
                                    , function($localStorage
                                                , $rootScope
                                                , $ionicPlatform
                                                , BulkTextService
                                                , TextDataService
                                                , $http
                                                , AUTH_EVENTS
                                               ) {
    var service = {};
    var smsFilteredList = [];
    var tempUnprocessedSms = [];
      
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
//        var tempDate = new Date(sms.date);
//        var lastSmsUploadDate = ($localStorage.lastSmsUploadDate ? new Date($localStorage.lastSmsUploadDate) : null);
        
//        console.log(sms.body);
//        console.log("message time: " + sms.date);
//        console.log("last upload time: " + $localStorage.lastSmsUploadDate);
        
//        if (tempDate.getTime() > (lastSmsUploadDate ? lastSmsUploadDate.getTime() : null)) {
        if (sms.date > ($localStorage.lastSmsUploadDate || null)) {
            return true;
        } else {
            return false;
        }
    };
    
    success = function (response){
        console.log (response.data);
    };
    
    failure = function (errResponse) {
        console.log (errResponse.statusText);
    };
    
    processSms = function (data) {
        var smsList = data;
        var sms = {};
        var smsRestRec = {};
        var smsProcessed = false;
        smsFilteredList = [];
        console.log("Inside FUNCTION processSms: " + $localStorage.lastSmsUploadDate || "no date");
        for (var i in smsList) {
            sms = smsList[i];
            smsRestRec = {};
            if (checkDate(sms)) {
                console.log("Text: " + sms.body);
                if (!isNumber(sms.address)) {
                    smsRestRec.text_message = unescape(encodeURIComponent(sms.body));
                    smsRestRec.sender = sms.address;
                    d = new Date(sms.date_sent);
                    smsRestRec.sent_datetime = d.toISOString();
                    d = new Date(sms.date);
                    smsRestRec.received_datetime = d.toISOString();
                    smsRestRec.service_centre = sms.service_center;
                    smsRestRec.location_latitude = null;
                    smsRestRec.location_longitude = null;

                    smsRestRec = JSON.parse(JSON.stringify(smsRestRec));
                    smsProcessed =true;

                    $http.post('https://moneybee-20151115.herokuapp.com/restful/text-data.json'
                                , smsRestRec).then(function (result) {
                        console.log("Success in single writing texts" + JSON.stringify(smsRestRec));
                        console.log("result: " + result);
                        $localStorage.lastSmsUploadDate = Date.now();
                    }
                    , function (error) {
                        console.log("Failure in single writing texts" + JSON.stringify(smsRestRec));
                        console.log("error: " + error.status + " " + error.statusText);
                        $localStorage.unprocessedSms.push(sms);
                    });
                    smsFilteredList.push(smsRestRec);
                } else {
                    console.log("Non Service Text: " + sms.body);
                }
            }
        }
        if (smsProcessed) {
            $rootScope.$broadcast(AUTH_EVENTS.refreshData);
        }
    }
    
    errProcessSms = function (err) {
        console.log("error processing SMS");
    }
    
    service = {
        processSms: function () {
            console.log("Just before check platform");
            $ionicPlatform.ready(function() {
                console.log("Just before processing SMS");
                if (SMS) {
                    console.log("Inside processing SMS: " + $localStorage.lastSmsUploadDate || "no date");
                    SMS.listSMS({}, processSms, errProcessSms);
                }
                console.log("Just AFTER processing SMS");
            });

            if ($localStorage.unprocessedSms) {
                console.log("Processing Unprocessed SMS");
                tempUnprocessedSms = $localStorage.unprocessedSms;
                delete $localStorage.unprocessedSms;
                processSms(tempUnprocessedSms);
            }
            return smsFilteredList;
        },
        processNewSms: function (e) {
            var smsList = [];
            smsList.push(e.data);
            processSms(smsList);
            return smsFilteredList;
        }
    };
    return service;
}]);
