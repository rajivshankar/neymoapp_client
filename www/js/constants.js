/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// File: js/constants.js

mainApp.constant('AUTH_EVENTS', {
    loginRequired: 'event:auth-loginRequired',
    loginConfirmed: 'event:auth-loginConfirmed',
    loginFailed: 'event:auth-login-failed',
    logoutComplete: 'event:auth-logout-complete'
});

mainApp.constant('REST_PATH', {
//    host: 'http://localhost:8000/restful/',
    host: 'https://moneybee-20151115.herokuapp.com/restful/device.json',
    device: 'device/'
});