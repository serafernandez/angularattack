angular.module('AuthModule')
  .controller('AuthController', ['$rootScope', '$scope', '$cookies','authService', function($rootScope, $scope, $cookies, authService) {
    $scope.logIn = function() {
        authService.logIn();
    };

    $scope.logged = function() {
        return authService.isLoggedIn();
    };

    $scope.logOut = function() {
        authService.logOut();
    };
}])
.run(['authService', '$rootScope', function(authService, $rootScope) {
    if(authService.isCookieSetted()) {
        authService.logIn();
    }
}]);
