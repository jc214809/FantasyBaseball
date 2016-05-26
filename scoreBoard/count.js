angular.module('fantasyBaseball.count', [])
  .controller('countCtrl', function countController($scope) {
    $scope.getCurrentCount = function(indicator) {
      //for (var i = $scope.eachGame.length - 1; i >= 0; i--) {
      //if (gameID == $scope.eachGame[i].game_pk) {
      var inningState = $scope.currentGame.inningState.toLowerCase();
      if (inningState == 'top' || inningState == 'bottom') {
        switch (indicator) {
          case "Ball":
            return $scope.currentGame.balls;
          case "Strike":
            return $scope.currentGame.strikes;
          case "Out":
            return $scope.currentGame.outs;
          default:
            console.log('error getting count')
        }
      }
    };
    //};
    //};

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
