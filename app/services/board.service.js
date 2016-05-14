angular.module('scrumattack')
.constant('URL_API','https://api.trello.com/1/')
.factory('boardService',['$http', 'URL_API', function($http, URL_API) {
   return {
	   getUser: function() {
		   Trello.get('member/me', success, error);
	   }
   };
}]);
