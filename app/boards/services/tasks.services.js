angular.module("BoardsModule")
    .factory("TasksServices", [function(){
        return {
            getListCards: function(idList, success, error){
                Trello.get("/lists/"+idList+"/cards", {filter: 'open'}, success, error);
            },
            createTask: function(name, description, listId, success, error) {
                var newCard = {
                      name: name,
                      desc: description,
                      pos: "bottom",
                      idList: listId
                };
                Trello.post('/cards', newCard, success, error);
            },
            moveTask: function(taskId, targetListId, position, success, err) {
                var params = {
                    idList: targetListId,
                    pos: position
                };
                Trello.put("/cards/" + taskId, params, success, err);
            },
            changePos: function(taskId, position, success, err) {
                var params = {
                    pos: position
                };
                Trello.put("/cards/" + taskId, position, success, err);
            }
        };
    }]);
