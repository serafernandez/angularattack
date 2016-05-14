angular.module('BoardsModule')
    .controller('ListasController', ['$scope', function($scope){
        $scope.listaSprint = [
            {
                id: 1,
                titulo: "Prueba",
                tiempo: "60 min"
            },
            {
                id:2,
                titulo: "Prueba2",
                tiempo: "35 min"
            },
            {
                id:3,
                titulo: "Prueba3",
                tiempo: "48 min"
            }
        ];
        $scope.listaDoing = [
            {
                id:4,
                titulo: "PruebaDoing",
                tiempo: "60 min"
            },
            {
                id:5,
                titulo: "Prueba2Doinga",
                tiempo: "35 min"
            },
            {
                id:6,
                titulo: "Prueba3Doing",
                tiempo: "48 min"
            }
        ];
        $scope.listaDone = [
            {
                id:7,
                titulo: "PruebaDone",
                tiempo: "60 min"
            },
            {
                id: 8,
                titulo: "Prueba2Done",
                tiempo: "35 min"
            },
            {
                id:9,
                titulo: "Prueba3Done",
                tiempo: "48 min"
            }
        ];

        $scope.dragHandler = {
            allowDuplicates: false,
            itemMoved: function(event){
                debugger;
                // recupero el elemento que se movio event.source.itemScope.item

                console.log(event);
            },
            containment: '#listas',
            containerPositioning: 'relative'
        };
    }]);
