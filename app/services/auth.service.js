angular.module('AuthModule')
.constant('URL_API','../api/v1/product')
.factory('authService',['$http', '$cookies', '$rootScope', '$window', 'URL_API',function($http, $cookies, $rootScope, $window, URL_API) {
    var _loggedIn, _token;
    _loggedIn = false;
    _token = $cookies.get("trelloToken");

     return{
         setUser : function(user) {
             _user = user;
         },
         isLoggedIn : function() {
             console.log("logedIn", _loggedIn);
             return _loggedIn;
         },
         isCookieSetted : function() {
             _token = (_token) ? (_token) : $cookies.get("trelloToken");
             return _token !== undefined;
         },
         logIn : function() {
             _token = (_token) ? _token : $cookies.get("trelloToken");
             var interactive = _token === undefined;
             console.log('token ', _token);
             console.log('trello token ', Trello.token());
             console.log('interactive ', interactive);
             console.log('rootScope ', $rootScope.isAuthorized);
             var params = {
                     name: "Scrum Attack",
                     type: "popup",
                     interactive: interactive,
                     expiration: "never",
                     persist: true,
                     success: function() {
                         $rootScope.isAuthorized = _loggedIn = true;
                         return onAuthorizeSuccessful(interactive);
                     },
                     scope: { write: true, read: true },
                 };
                 console.log('json ', params);
             Trello.authorize(params);
         },
         logOut : function() {
             Trello.deauthorize();
             $cookies.put("loggedIn", "false");
             _token = undefined;
             $cookies.put("trelloToken", undefined);
             $rootScope.isAuthorized = _loggedIn = false;
             $window.location.reload();
         }
     }

     function onAuthorizeSuccessful(interactive) {
         // if(Trello.token() !== undefined){
         $rootScope.token = Trello.token();
         $cookies.put("loggedIn", "true");
         $cookies.put("trelloToken", Trello.token());
         $rootScope.$digest();
         getUser();

         interactive && $window.location.reload();
         // }
     }

     function getUser() {
         Trello.get('/members/me', function(successMsg){
             $rootScope.user = successMsg;
         }, function(err){
             alert('No se pudo iniciar sesion');
         });
     }
}]);
