angular.module('scrumattack')
  .controller('MainController', ['$rootScope', '$scope', 'boardService', function($rootScope, $scope, boardService) {
    $scope.logIn = function() {
      Trello.authorize({
        name: "Scrum Attack",
        type: "popup",
        interactive: true,
        expiration: "1hour",
        persist: true,
        success: function () { onAuthorizeSuccessful($rootScope); },
        scope: { write: false, read: true },
      });

      function onAuthorizeSuccessful($rootScope) {
        $rootScope.token = Trello.token();
        getUser($rootScope);
      }
    };

    function getUser($rootScope) {
      //boardService.getUser().success(alert("qwe"));
      var success = function(successMsg) {
        $rootScope.user = successMsg;
      };

      var error = function(errorMsg) {
          alert("not logged in");
      };
      Trello.get('member/me', success, error);
    };
    
}]);
