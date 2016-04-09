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
    $scope.$on('$routeChangeSuccess', function(e, nextRoute) {
      if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
        $scope.pageTitle = nextRoute.$$route.pageTitle + ' | Fantasy Baseball';
      }
    });
  });
