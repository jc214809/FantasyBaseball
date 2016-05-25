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
        if ($scope.gamesDetails.runnerOnFirst != null) {
          return true;
        };
      };
      if (baseParameter == 'runner_on_2b') {
        if ($scope.gamesDetails.runnerOnSecond != null) {
          return true;
        };
      };
      if (baseParameter == 'runner_on_3b') {
        if ($scope.gamesDetails.runnerOnThird != null) {
          return true;
        };
      };
    };
    $scope.isRunnerCurrentPlayer = function(playerID, baseParameter) {
      if (baseParameter == 'runner_on_1b') {
        if ($scope.gamesDetails.runnerOnFirst != null && $scope.gamesDetails.runnerOnFirst == playerID) {
          return true;
        };
      };
      if (baseParameter == 'runner_on_2b') {
        if ($scope.gamesDetails.runnerOnSecond != null && $scope.gamesDetails.runnerOnSecond == playerID) {
          return true;
        };
      };
      if (baseParameter == 'runner_on_3b') {
        if ($scope.gamesDetails.runnerOnThird != null && $scope.gamesDetails.runnerOnThird == playerID) {
          return true;
        };
      };
    };


  });
