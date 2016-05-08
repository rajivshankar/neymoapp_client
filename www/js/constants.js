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
    logoutComplete: 'event:auth-logout-complete',
    refreshData: 'event:refresh-all-data',
    onSmsArrive: 'onSMSArrive',
});

mainApp.constant('REST_PATH', {
//    host: 'http://localhost:8000/restful/',
    host: 'https://moneybee-20151115.herokuapp.com/restful/',
    device: 'device.json',
    unprocessedText: 'unprocessed_text_data/',
    smsList: 'text-data/',
    textInput: 'text-data.json'
});

mainApp.constant('TEST_CONST', {
    number: '+447526019132',
    coordPrecision: 8,
    timeMarginSec: 120,
    rupeeSymbol: "&#8377;"
});

mainApp.constant('REPORT_NAMES', {
    balance_summary: 'balance_summary',
    expense_summary: 'expense_summary/month',
    expense_by_account: 'expense_by_account',
    expense_by_vendor_top: 'expense_by_vendor_top/month',
    expense_by_vendor: 'expense_by_vendor/month',
    expense_by_category_top: 'expense_by_category_top/month',
    expense_by_category: 'expense_by_category/month',
    expense_top: 'expense_top5/month'    
});