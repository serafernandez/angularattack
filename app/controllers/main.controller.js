angular.module('scrumattack')
  .controller('MainController', ['$rootScope', '$scope', '$cookies', function($rootScope, $scope, $cookies) {
    $scope.logIn = function() {
        Trello.authorize({
            name: "Scrum Attack",
            type: "popup",
            interactive: true,
            expiration: "1hour",
            persist: true,
            success: function () { onAuthorizeSuccessful($rootScope, $cookies); },
            scope: { write: false, read: true },
        });

        function onAuthorizeSuccessful($rootScope, $cookies) {
            $rootScope.token = Trello.token();
            $cookies.put("loggedIn", "true");
            getUser($rootScope);
        }
    };

    $scope.logged = function() {
        return $cookies.get("loggedIn") !== undefined;
    };

    $scope.logOut = function() {
        $cookies.put("loggedIn", undefined);
    };

    function getUser($rootScope) {
      var success = function(successMsg) {

        $rootScope.user = successMsg;
      };

      var error = function(errorMsg) {
          alert("not logged in");
      };
      Trello.get('member/me', success, error);
    };

}]);
