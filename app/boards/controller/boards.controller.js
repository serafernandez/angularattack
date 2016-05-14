angular.module('BoardsModule')
    .controller('BoardsController', ['$rootScope', '$scope', 'OrganizationsServices', 'BoardsServices', 'ListasServices', 'CardsServices', '$cookies', function($rootScope, $scope, OrganizationsServices, BoardsServices, ListasServices, CardsServices, $cookies){

        var views= {
            welcome: 'views/welcome.html',
            sprint: 'views/sprint.html'
        };

        $scope.parteApp = views.welcome;


        $rootScope.$watch('isAuthorized', function(newValue, oldValue){
            debugger;
            if(newValue === undefined)
                $rootScope.isAuthorized = ($cookies.get("loggedIn") === "true");
            else if(newValue === false)
                $scope.parteApp = views.welcome;
            else if(newValue === true){
                $scope.parteApp = views.sprint;
                console.log("Recupero organizaciones");
                OrganizationsServices.getAllOrg(function(orgs){
                    orgs.forEach(function(org){
                        if(org.name.indexOf('scrumattack') !== -1){
                            $rootScope.idNuestraOrg = org.id;
                            $cookies.put("idNuestraOrg", $rootScope.idNuestraOrg);
                        }
                        console.log($rootScope.idNuestraOrg);
                    });
                    if($rootScope.idNuestraOrg === undefined)
                        OrganizationsServices.createOrg("scrumattack", "Scrum Attack (Don't touch)", "http://scrumattack.2016.angularattack.io/", 'Scrum attack org',
                            function(success){
                                console.log(success);
                                $rootScope.idNuestraOrg = success.id;
                                $cookies.put("idNuestraOrg", $rootScope.idNuestraOrg);
                            },
                            function(err){
                                console.log("No se puede crear organizacion");
                            }
                        );
                }, function(err){
                    console.log(err);
                });
            }
        });

        $scope.createBoard = function(name){
            BoardsServices.createBoard(name, $cookies.get("idNuestraOrg"), function(success){
                console.log(success);
            }, function(err){
                console.log(err);
            });
        }

        $scope.dragHandler = {
            allowDuplicates: false,
            itemMoved: function(event){
                // recupero el elemento que se movio event.source.itemScope.item
                console.log(event);
            },
            containment: '#listas',
            containerPositioning: 'relative'
        };
    }]);
