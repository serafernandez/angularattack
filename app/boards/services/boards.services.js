angular.module("BoardsModule")
    .factory("BoardsServices", [function(){
        return {
            createBoard: function(name, idOrg, success, err){
                var board = {
                    name: name,
                    idOrganization: idOrg
                };
                Trello.post("/boards", board, success, err);
            },
            getAllBoards: function(idOrg, success, err){
                Trello.get("/organizations/"+idOrg+"/boards", {filter: 'open'}, success, err);
            },
            getBoard: function(idBoard, success, err){
                Trello.get("/boards/"+idBoard, success, err);
            },
            deleteBoard: function(idBoard, success, err){
                Trello.put('/boards/'+idBoard+'/closed', success, err);
            }
        };
    }]);
