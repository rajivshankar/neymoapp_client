angular.module('moneyProApp.services', [])

.factory('Accounts', ['$http', function($http) {
    return {
        all: function() {
                return $http.get('https://moneybee-20151115.herokuapp.com/restful/accounts/')
                    .then(
                        function(response) {
                            return response;
                        },
                        function(errResponse) {
                            return errResponse;
                        }
                    );
        }
    };
}])
.factory('UTexts', ['$http', function($http) {
    return {
        all: function() {
                return $http.get('http://moneybee-20151115.herokuapp.com/restful/unprocessed_text_data/')
                    .then(
                        function(response) {
                            return response;
                        },
                        function(errResponse) {
                            return errResponse;
                        }
                    );
        }
    };
}]);
