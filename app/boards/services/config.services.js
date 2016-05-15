angular.module("BoardsModule")
    .factory("ConfigServices", [function(){
        return {
            getConfigs: function(projectId, configListId, success, err) {
                //Trello.get('lists/'+configListId')
                //Trello.get('cards/' + cardId + '/actions/comments')
            }
        };
    }]);
