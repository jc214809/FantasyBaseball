angular.module('fantasyBaseball.count', [])
  .controller('countCtrl', function countController($scope) {
    $scope.getCurrentCount = function(indicator) {
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
  });
