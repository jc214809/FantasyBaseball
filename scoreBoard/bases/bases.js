angular.module('fantasyBaseball.bases', [])
  .controller('basesCtrl', function basesController($scope) {
    $scope.getBaseRunners = function(baseParameter) {
      if (baseParameter == 'runner_on_1b') {
        if ($scope.currentGame.runnerOnFirst != null) {
          return true;
        };
      };
      if (baseParameter == 'runner_on_2b') {
        if ($scope.currentGame.runnerOnSecond != null) {
          return true;
        };
      };
      if (baseParameter == 'runner_on_3b') {
        if ($scope.currentGame.runnerOnThird != null) {
          return true;
        };
      };
    };

    $scope.isRunnerCurrentPlayer = function(playerID, baseParameter) {
      if (baseParameter == 'runner_on_1b') {
        if ($scope.currentGame.runnerOnFirst != null && $scope.currentGame.runnerOnFirst == playerID) {
          return true;
        };
      };
      if (baseParameter == 'runner_on_2b') {
        if ($scope.currentGame.runnerOnSecond != null && $scope.currentGame.runnerOnSecond == playerID) {
          return true;
        };
      };
      if (baseParameter == 'runner_on_3b') {
        if ($scope.currentGame.runnerOnThird != null && $scope.currentGame.runnerOnThird == playerID) {
          return true;
        };
      };
    };
  });
