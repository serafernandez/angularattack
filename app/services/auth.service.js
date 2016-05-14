angular.module('AuthModule')
.constant('URL_API','../api/v1/product')
.factory('authService',['$http', '$cookies', '$rootScope', 'URL_API',function($http, $cookies, $rootScope, URL_API) {
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
             return $cookies.get("trelloToken") !== undefined;
         },
         logIn : function() {
             _token = (_token) ? _token : $cookies.get("trelloToken");
             var interactive = _token == undefined;
             console.log('interactive ', interactive);
             Trello.authorize({
                 name: "Scrum Attack",
                 type: "popup",
                 interactive: interactive,
                 expiration: "never",
                 persist: true,
                 success: function() {
                     $rootScope.isAuthorized = _loggedIn = true;
                     return onAuthorizeSuccessful();
                 },
                 scope: { write: true, read: true },
             });
         },
         logOut : function() {
             Trello.deauthorize();
             $cookies.put("loggedIn", "false");
             _token = undefined;
             $cookies.put("trelloToken", undefined);
             $rootScope.isAuthorized = _loggedIn = false;
         }
     }

     function onAuthorizeSuccessful() {
         // if(Trello.token() !== undefined){
         $rootScope.token = Trello.token();
         $cookies.put("loggedIn", "true");
         $cookies.put("trelloToken", Trello.token());
         $rootScope.$digest();
         getUser();
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
