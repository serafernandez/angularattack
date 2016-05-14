angular.module("BoardsModule")
    .factory('ListasServices', [function(){
        return {
            getLists: function(idBoard, success, error){
                Trello.get('/boards/'+idBoard+'/lists', success, error);
            },
            getCards: function(idLista, success, error){
                Trello.get('/lists/'+idLista+'/cards', success, error);
            },
            createList: function(name, idBoard, success, error){
                var list = {
                    name: name,
                    idBoard: idBoard
                };
                Trello.post('/lists', list, success, error);
            }
        };
    }]);
