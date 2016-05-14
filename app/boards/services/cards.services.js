angular.module("BoardsModule")
    .factory("CardsServices", [function(){
        return {
            getListCards: function(idList, success, error){
                Trello.get("/lists/"+idList+"/cards", {filter: 'open'}, success, error);
            }
        };
    }]);
