   jQuery.ajaxPrefilter(function(options) {
     if (options.crossDomain && jQuery.support.cors) {
       var today = new Date().getHours();
       if (today >= 7 && today <= 19) {
         options.url = 'https://mlbfantasy.herokuapp.com/' + options.url;
       } else {
         options.url = 'https://jc214809.herokuapp.com/' + options.url;
       }
     }
   });

   function weekOfYear(date) {
     var d = new Date(+date);
     d.setHours(0, 0, 0);
     d.setDate(d.getDate() + 4 - (d.getDay() || 7));
     return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
   };

   function blink() {
     var blinks = document.getElementsByTagName('blink');
     for (var i = blinks.length - 1; i >= 0; i--) {
       var s = blinks[i];
       s.style.visibility = (s.style.visibility === 'visible') ? 'hidden' : 'visible';
     }
     window.setTimeout(blink, 1000);
   }

   if (document.addEventListener) document.addEventListener("DOMContentLoaded", blink, false);
   else if (window.addEventListener) window.addEventListener("load", blink, false);
   else if (window.attachEvent) window.attachEvent("onload", blink);
   else window.onload = blink;

   angular.module('fantasyBaseball', [
       'ngRoute',
       'fantasyBaseball.scoreboard',
       'fantasyBaseball.weeklyScoreBoard',
       'fantasyBaseball.lineup',
       'fantasyBaseball.pitchingStaff',
       'fantasyBaseball.playerStatus'
     ]) //, 'fantasyBaseball.count'
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
     .controller('AppCtrl', function AppCtrl($scope, $location, $http) {
       $scope.teamID = 85827;
       $scope.leagueID = 9518;
       //League Specific Variables above
       var today = new Date();
       var selectedDate = new Date(today);
       selectedDate.setDate(selectedDate.getDate());

       //$scope.setTheDate = function(pageLoad) {
       //Goes back to previous day if between midnight and 11am
       var hourOfday = new Date().getHours();
       if ((hourOfday >= 0 && hourOfday <= 10)) {
         selectedDate.setDate(selectedDate.getDate() - 1);
       }
       $scope.periodId = weekOfYear(selectedDate) - 3;
       $scope.selectedDate = selectedDate;
       //$scope.selectedDate.setHours(0, 0, 0, 0, 0);
       $scope.day = selectedDate.getDate();
       $scope.month = selectedDate.getMonth() + 1;
       $scope.year = selectedDate.getFullYear();
       if ($scope.day < 10) {
         $scope.day = '0' + $scope.day;
       }
       if ($scope.month < 10) {
         $scope.month = '0' + $scope.month;
       }

       //};
       $scope.changePeriodID = function() {
         selectedDate.setDate(selectedDate.getDate() - 1);
         $scope.periodId = weekOfYear(selectedDate) - 3;
         $scope.selectedDate = selectedDate;
         //$scope.selectedDate.setHours(0, 0, 0, 0, 0);
         $scope.day = selectedDate.getDate();
         $scope.month = selectedDate.getMonth() + 1;
         $scope.year = selectedDate.getFullYear();
         if ($scope.day < 10) {
           $scope.day = '0' + $scope.day;
         }
         if ($scope.month < 10) {
           $scope.month = '0' + $scope.month;
         }
       };

       $scope.$on('$routeChangeSuccess', function(e, nextRoute) {
         if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
           $scope.pageTitle = nextRoute.$$route.pageTitle + ' | Fantasy Baseball';
         }
       });
     });
