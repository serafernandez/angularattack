angular.module('BoardsModule')
    .controller('BoardsController', ['$rootScope', '$scope', 'OrganizationsServices', 'BoardsServices', 'ListasServices', 'TasksServices', '$cookies', function($rootScope, $scope, OrganizationsServices, BoardsServices, ListasServices, TasksServices, $cookies){
        var views= {
            welcome: 'views/welcome.html',
            boards: 'views/boards.html',
            sprint: 'views/sprint.html',
            sprintPlanning: 'views/sprintPlanning.html',
            projectPlanning: 'views/projectPlanning.html',
            burnDown: 'views/burnDown.html'
        };

        $scope.parteApp = views.welcome;

        $rootScope.$watch('isAuthorized', function(newValue, oldValue){
            if(newValue === undefined)
                $rootScope.isAuthorized = ($cookies.get("loggedIn") === "true");
            else if(newValue === false)
                $scope.parteApp = views.welcome;
            else if(newValue === true) {
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
            "Done", "Doing", "Sprint", "Configs", "PBI", "PBIx", "GeneralTasks"
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

        $rootScope.changeView = function(view){
            $scope.parteApp = views[view];
        };

        $scope.selectPBI = function(item){
            if(item === $scope.PBISelected)
                $scope.PBISelected = {};
            else
                $scope.PBISelected = item;
        };

        $scope.GTToCreate = {};
        $scope.GTRecentlyCreated = [];
        $scope.createGT = function(pbiName){
            var task = {
                duration: $scope.GTToCreate.duration,
                description: ''
            };
            if(pbiName !== undefined)
                task.name= $scope.GTToCreate.name + " - " + pbiName;
            else
                task.name= $scope.GTToCreate.name;
            $scope.createTask(task.name, task.description, task.duration, 'GeneralTasks');
            $scope.GTRecentlyCreated.push(task);
            $scope.GTToCreate = {};
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
                    if(listName === list.name){
                        $scope.lists[listName] = list;
                    }
                });
            });
            updateCards();
        }

        function updateCards(){
            $.each($scope.lists, function(name, list){
                TasksServices.getListCards(list.id, function(success){
                    $scope.lists[name].tasks = success;
                    $scope.lists[name].totalTime = totalTime(success);
                    $rootScope.$digest();
                }, function(err){
                    console.log(err);
                });
            });
        }

        function totalTime(tasks) {
            var totalTime = 0;
            for(var i=0; i < tasks.length; i++) {
                var name = tasks[i].name;
                var index = name.indexOf('{{');
                var duration = 0;
                if(index !== -1) {
                    tasks[i].name = name.substring(0, index);
                    var duration = parseInt(name.substring(index+2));
                }
                totalTime += duration;
            }
            return totalTime;
        }

        $scope.openProject = function(project, view){
            $rootScope.changeView(view);
            $scope.GTRecentlyCreated = [];
            $rootScope.currentProject = project;
            ListasServices.getLists(project.id, function(success){
                listLogic(success);
            }, function(err){
                console.log(err);
            });
        };

        $rootScope.createTask = function(name, description, duration, list){
            console.log('list', $scope.lists[list]);
            TasksServices.createTask(name + " {{" + duration + "}}", description, $scope.lists[list].id, function(success){
                console.log(success);
            }, function(err){
                console.log(err);
            });
        };

        $rootScope.createPBI = function(name, description){

            console.log("list ", $scope.lists.PBI.id);
            TasksServices.createTask(name, description, $scope.lists.PBI.id, function(success){
                $scope.lists.PBI.tasks.push({name: name, desc: description});
                $rootScope.$digest();
                console.log(success);
            }, function(err){
                console.log(err);
            });
        };

        $rootScope.moveTask = function(taskId, targetListId, position){
            TasksServices.moveTask(taskId, targetListId, position, function(success){
                console.log(success);
            }, function(err){
                console.log(err);
            });
        };

        $rootScope.changeTaskPos = function(taskId, position){
            TasksServices.changePos(taskId, position, function(success){
                console.log(success);
            }, function(err){
                console.log(err);
            });
        };

        $scope.dragHandler = {
            allowDuplicates: false,
            itemMoved: function(event){
                // Recupero el elemento que se movio
                // event.source.itemScope.item
                // Recupero el id de la lista nueva
                // event.source.sortableScope.element[0].id
                // event.dest.sortableScope.element[0].id
                // Recupero la nueva pos
                // event.dest.index
                var listId = $scope.lists[event.dest.sortableScope.element[0].id].id;
                $rootScope.moveTask(event.source.itemScope.item.id, listId, event.dest.index);
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

        $rootScope.openModalCreateTask = function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'modalNewCard.html',
                controller: 'ModalInstanceCreateTaskCtrl'
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
    }])
    .controller('ModalInstanceCreateTaskCtrl', ['$rootScope', '$scope', '$uibModalInstance', function($rootScope, $scope, $uibModalInstance){
        $scope.task = [];
        $scope.ok = function() {
            if($scope.task)
                $rootScope.createTask($scope.task);
            $uibModalInstance.close();
        };
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
    }]);
