angular.module('moneyProApp.controllers', [])

.controller('DashCtrl', ['$scope', 'Accounts', function($scope, Accounts) {
    Accounts.all().then(function(resp){
        $scope.accountList = resp.data.results;
    });
    var a = 1;
}])

.controller('UTextsCtrl', ['$scope', 'UTexts', function($scope, UTexts) {
    UTexts.all().then(function(resp){
        $scope.uTextList = resp.data.results;
    });
    var a = 1;
}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
