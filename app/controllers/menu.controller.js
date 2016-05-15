angular.module('scrumattack')
  .controller('MenuController', ['$rootScope', '$scope', function($rootScope, $scope) {
      $scope.setView = function(view) {
          $rootScope.changeView(view);
      };
}]);
