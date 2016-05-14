angular.module('BoardsModule')
    .controller('BoardsController', ['$rootScope', '$scope', 'OrganizationsServices', 'BoardsServices', 'ListasServices', 'CardsServices', function($rootScope, $scope, OrganizationsServices, BoardsServices, ListasServices, CardsServices){
        $rootScope.$watch('isAuthorized', function(newValue, oldValue){
            if(newValue === true) {
                console.log("Recupero organizaciones");
                OrganizationsServices.getAllOrg(function(orgs){
                    console.log(orgs);
                    orgs.forEach(function(org){
                        console.log(org);
                    });
                }, function(err){
                    console.log(err);
                });
            }
        });


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
