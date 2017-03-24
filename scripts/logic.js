var app = angular.module('TwitchStatus', []);

// template to manufacture user profiles from API
//---------------------------------------------------------------------------\\
app.factory('Generator', function ($http) {
    
    var stream   = 'https://wind-bow.gomix.me/twitch-api/streams/',
        channel  = 'https://wind-bow.gomix.me/twitch-api/channels/',
        callback = '?callback=JSON_CALLBACK',
        hostURL  = 'https://dl.dropboxusercontent.com/s/',
        blank1   = hostURL + 'uvqhy49dpofl831/blank1.jpg',
        blank2   = hostURL + '2n48l5dtujzpdrv/blank2.png',
        profile  = function (person) {
            return (function (self) {
                $http.jsonp(channel + person + callback)
                    .then(function (response) {
                        angular.extend(self, response.data);
                    });
                $http.jsonp(stream + person + callback)
                    .then(function (response) {
                        if (response.data.error) {
                            self.display_name = response.data.message;
                            self.game = '~~~~~~~~';
                        }
                        if (!self.logo) {
                            self.logo = blank1;
                        }
                        if (!self.profile_banner) {
                            self.profile_banner = blank2;
                        }
                        angular.extend(self, response.data);
                    });
            }(this)); // initialize individual 'user' object
        };
    return profile;
});//========================================================================//

// custom filter for stream status
//---------------------------------------------------------------------------\\
app.filter('online', function () {
    return function (users, state) {
        this.all     = [];
        this.online  = [];
        this.offline = [];
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (user.stream !== null &&
                user.stream !== undefined) {
                online.push(user);
            }
            else if (user.stream === null ||
                     user.stream === undefined) {
                offline.push(user);
            }
            all.push(user);
        }
        return this[state]; // match state parameter to array
    }
});//========================================================================//

// create user profiles and manipulate view 
//---------------------------------------------------------------------------\\
app.controller('MainCtrl', function ($scope, Generator) {
    
    var nameList = [
        'freecodecamp',
        'Nightblue3',
        'syndicate',
        'LIRIK',
        'PhantomL0rd',
        'captainsparklez',
        'LethalFrag',
        'johnnymccrum',
        'combatex',
        'syndicate',
        'riotgames',
        'esl_csgo',
        'summit1g',
        'sodapoppin',
        'comster404',
        'ESL_SC2',
        'cretetion',
        'habathcx',
        'OgamingSC2',
        'noobs2ninjas'
    ];//=====================================================================//
    
    
// move arrow; remove 'lit' class from list items; update class
//---------------------------------------------------------------------------\\
    $scope.showAll = function() {
        $scope.status = 'all';
        document.querySelector('#arrow').style.left = '-8.5em';
        document.querySelectorAll('li').forEach(function(item) {
            item.classList.remove('lit');
        });
        document.querySelector('#all').classList.add('lit');
    }
    $scope.showOnline = function() {
        $scope.status = 'online';
        document.querySelector('#arrow').style.left = '0em';
        document.querySelectorAll('li').forEach(function(item) {
            item.classList.remove('lit');
        });
        document.querySelector('#on').classList.add('lit');
    }
    $scope.showOffline = function() {
        $scope.status = 'offline';
        document.querySelector('#arrow').style.left = '8.5em';
        document.querySelectorAll('li').forEach(function(item) {
            item.classList.remove('lit');
        });
        document.querySelector('#off').classList.add('lit');
    }//======================================================================//
    
    // init user list in scope
    $scope.users = [];
    // use factory to create & add user objects
    nameList.forEach(function (name) {
        var user = new Generator(name);
        $scope.users.push(user);
    });
    // console.log($scope.users); // DEBUG
});