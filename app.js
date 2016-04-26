   jQuery.ajaxPrefilter(function(options) {
     if (options.crossDomain && jQuery.support.cors) {
       options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
     }
   });

   function weekOfYear(date) {
     var d = new Date(+date);
     d.setHours(0, 0, 0);
     d.setDate(d.getDate() + 4 - (d.getDay() || 7));
     return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
   };

   angular.module('fantasyBaseball', [
       'ngRoute',
       'fantasyBaseball.scoreboard',
       'fantasyBaseball.weeklyScoreBoard',
       'fantasyBaseball.lineup'
     ])
     .config(function myAppConfig($routeProvider, $httpProvider, $locationProvider) {
       $routeProvider
         .when('/', {
           controller: 'ScoreBoardCtrl',
           templateUrl: 'scoreBoard/scoreBoard.html',
           pageTitle: 'ScoreBoard'
         })
         .when('/login', {
           controller: 'weeklyScoreBoardCtrl',
           templateUrl: 'weeklyScoreboard/weeklyScoreBoard.html',
           pageTitle: 'weeklyScoreBoard'
         });
     })
     .controller('AppCtrl', function AppCtrl($scope, $location) {
       $scope.periodId = weekOfYear(new Date) - 3;
       $scope.teamID = 85827;
       $scope.leagueID = 9518;
       //League Specific Variables above

       $scope.$on('$routeChangeSuccess', function(e, nextRoute) {
         if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
           $scope.pageTitle = nextRoute.$$route.pageTitle + ' | Fantasy Baseball';
         }
       });
     });
