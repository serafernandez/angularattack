angular.module('BoardsModule')
    .factory('OrganizationsServices', [function(){
        return {
            createOrg: function(name, displayName, website, desc, success, error){
                var org = {
                    name: name,
                    displayName: displayName,
                    website: website,
                    desc: desc
                };
                Trello.post('/organizations', org, success, error);
            },
            getOrg: function(name, success, error){
                Trello.get('/organizations/'+name, success, error);
            },
            getAllOrg: function(success, err){
                Trello.get("/members/me/organizations", success, err);
            }
        };
    }]);
