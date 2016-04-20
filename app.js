   jQuery.ajaxPrefilter(function(options) {
     if (options.crossDomain && jQuery.support.cors) {
       options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
     }
   });

   angular.module('fantasyBaseball', [
       'ngRoute',
       'fantasyBaseball.scoreboard'
     ])
     .config(function myAppConfig($routeProvider, $httpProvider, $locationProvider) {
       $routeProvider
         .when('/', {
           controller: 'ScoreBoardCtrl',
           templateUrl: 'scoreBoard/scoreBoard.html',
           pageTitle: 'ScoreBoard'
         })
         .when('/login', {
           controller: 'LoginCtrl',
           templateUrl: 'login/login.html',
           pageTitle: 'Login'
         });
     })
     .controller('AppCtrl', function AppCtrl($scope, $location) {
       $.ajax({
         url: 'http://www.mlb.com/fantasylookup/json/named.fb_index_schedule.bam?league_id=9518',
         type: 'GET',
         dataType: 'json',
         error: function() {
           alert("Error");
         },
         success: function(data) {
           $scope.schedule = [];
           $scope.matchUpIds = [];
           $scope.opponentsSchedule = [];
           $scope.masterSchedule = data.fb_index_schedule.queryResults;
           angular.forEach($scope.masterSchedule.row, function(schedule) {
             if (schedule.team_id == '85827') {
               $scope.schedule.push(schedule);
               $scope.matchUpIds.push(schedule.matchup_set);
             }
           });

           for (var i = 0; i < $scope.masterSchedule.row.length; i++) {
             if ($scope.masterSchedule.row[i].team_id != '85827' && $scope.matchUpIds.indexOf($scope.masterSchedule.row[i].matchup_set) != -1) {
               $scope.opponentsSchedule.push($scope.masterSchedule.row[i]);
             }
           }
           $scope.$apply();
         }
       });
       $scope.$on('$routeChangeSuccess', function(e, nextRoute) {
         if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
           $scope.pageTitle = nextRoute.$$route.pageTitle + ' | Fantasy Baseball';
         }
       });
     });
