angular.module('BoardsModule')
    .controller('BoardsController', ['$rootScope', '$scope', 'OrganizationsServices', 'BoardsServices', 'ListasServices', 'CardsServices', '$cookies', function($rootScope, $scope, OrganizationsServices, BoardsServices, ListasServices, CardsServices, $cookies){
        var views= {
            welcome: 'views/welcome.html',
            sprint: 'views/sprint.html',
            boards: 'views/boards.html'
        };

        $scope.parteApp = views.welcome;

        $rootScope.$watch('isAuthorized', function(newValue, oldValue){
            if(newValue === undefined)
                $rootScope.isAuthorized = ($cookies.get("loggedIn") === "true");
            else if(newValue === false)
                $scope.parteApp = views.welcome;
            else if(newValue === true){
                $scope.parteApp = views.boards;
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

        var listsNames = [
            "Done", "Doing", "Sprint", "Configs", "PBI", "PBIx", "General Tasks"
        ];

        $rootScope.createBoard = function(name){
            BoardsServices.createBoard(name, $cookies.get("idNuestraOrg"), function(success){
                console.log(success);
                listsNames.forEach(function(listName){
                    ListasServices.createList(listName, success.id, function(success){}, function(err){
                        console.log(err);
                    });
                });
                $rootScope.getAllBoards();
            }, function(err){
                console.log(err);
            });
        };

        $scope.projects = [];
        $rootScope.getAllBoards = function(){
            BoardsServices.getAllBoards($cookies.get("idNuestraOrg"), function(success){
                $scope.projects = success;
                $rootScope.$digest();
            }, function(err){
                console.log(err);
            });
        };
        $rootScope.getAllBoards();

        $scope.lists = {};

        function listLogic(lists){
            lists.forEach(function(list){
                listsNames.forEach(function(listName){
                    if(listName === list.name)
                        $scope.lists[listName] = list;
                });
            });
            updateCards();
        }

        function updateCards(){
            $.each($scope.lists, function(name, list){
                CardsServices.getListCards(list.id, function(success){
                    console.log(list.name, success);
                    $scope.lists[name].tasks = success;
                    $rootScope.$digest();
                }, function(err){
                    console.log(err);
                });
            });
        }

        $scope.openProject = function(projectId){
            $scope.parteApp = views.sprint;
            console.log(projectId);
            $rootScope.currentProject = projectId;
            ListasServices.getLists(projectId, function(success){
                listLogic(success);
            }, function(err){
                console.log(err);
            });
        };

        $scope.dragHandler = {
            allowDuplicates: false,
            itemMoved: function(event){
                // recupero el elemento que se movio event.source.itemScope.item
                console.log(event);
            },
            containment: '#listas',
            containerPositioning: 'relative'
        };
    }])
    .controller("ModalController", ['$rootScope', '$scope', '$uibModal', function($rootScope, $scope, $uibModal){
        $rootScope.openModalCreateProject = function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'modalNewBoard.html',
                controller: 'ModalInstanceCreateProjectCtrl'
            });

            modalInstance.result.then(function() {
                console.log("salio");
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
    }])
    .controller('ModalInstanceCreateProjectCtrl', ['$rootScope', '$scope', '$uibModalInstance', function($rootScope, $scope, $uibModalInstance){
        $scope.projectName = '';
        $scope.ok = function(){
            if($scope.projectName)
                $rootScope.createBoard($scope.projectName);
            $uibModalInstance.close();
        };
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
    }]);
