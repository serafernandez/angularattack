angular.module("BoardsModule")
    .factory("TasksServices", [function(){
        return {
            getListCards: function(idList, success, error){
                Trello.get("/lists/"+idList+"/cards", {filter: 'open'}, success, error);
            },
            createTask: function(task, listId) {
                var newCard = {
                      name: task.name + " {{" + task.duration + "}}",
                      desc: task.description,
                      pos: "bottom",
                      due: null,
                      idList: listId
                };
                console.log('new Card ', newCard);
                // TODO: qweqweampsodmpaosmfpoam
            }
        };
    }]);
