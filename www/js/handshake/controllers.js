/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// File: handshake/controllers.js

controllers.controller('loginCtrlTemp', ['$scope'
                                    , '$localStorage'
                                    , 'DeviceInfoService'
                                    , 'HandshakeService'
                                    , 'AUTH_EVENTS'
                                    , function ($scope
                                                , $localStorage
                                                , DeviceInfoService
                                                , HandshakeService
                                                , AUTH_EVENTS
                                                ) {
    /*
     * Get the information about the device and pass it on to the server
     * Obtain the authentication token and set it in the $localStorage
     */
/*
    $scope.message = "Initial Message";
    $scope.deviceRec = DeviceInfoService.deviceInfo();
    $localStorage.uuid = deviceRec.uuid;
    $localStorage.device = deviceRec.device_id;

    $scope.user = {
        username: null,
        password: null
    };

    $scope.login = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'MoneyApp',
            template: 'Inside Login Function'
        });

        confirmPopup.then(function(res) {
            if(res) {
                console.log('Yep');
            } else {
                console.log('Nope');
            }
        });
        $scope.message = "Inside Login function";
        console.log ($scope.message);
//        HandshakeService.register($scope.deviceRec);
    };
    

    $scope.$on(AUTH_EVENTS.loginConfirmed, function() {
         $scope.loginModal.hide();
    });

    $scope.$on(AUTH_EVENTS.loginFailed, function() {
        var error = "Login failed.";
        if (status === 401) {
            error = "Invalid Username or Password.";
        }
        $scope.message = error;
//        $scope.loginModal.hide(); // remove this to force login
    });

    $scope.$on(AUTH_EVENTS.logoutComplete, function() {
        $state.go('app.home', {}, {reload: true, inherit: false});
    });
*/
}]);
