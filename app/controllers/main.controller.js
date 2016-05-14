angular.module('scrumattack')
  .controller('MainController', ['$rootScope', '$scope', '$cookies', function($rootScope, $scope, $cookies) {
    $scope.logIn = function() {
        Trello.authorize({
            name: "Scrum Attack",
            type: "popup",
            interactive: true,
            expiration: "1hour",
            persist: true,
            success: function(){
                return onAuthorizeSuccessful($cookies);
            },
            scope: { write: true, read: true },
        });
    };
    function getUser() {
        Trello.get('/members/me', function(successMsg){
            $rootScope.user = successMsg;
        }, function(err){
            alert('No se pudo iniciar secion');
        });
    };
    function onAuthorizeSuccessful($cookies) {
        // if(Trello.token() !== undefined){
        $rootScope.token = Trello.token();
        $rootScope.isAuthorized = true;
        $rootScope.$digest();
        $cookies.put("loggedIn", "true");
        getUser();
        // }
    }

    $scope.logged = function() {
        return $cookies.get("loggedIn") !== undefined;
    };

    $scope.logOut = function() {
        Trello.deauthorize();
        $rootScope.isAuthorized = false;
        $cookies.put("loggedIn", undefined);
    };
}]);
