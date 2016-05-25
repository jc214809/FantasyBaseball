angular.module('fantasyBaseball.count', [])
  .controller('countCtrl', function countController($scope) {
    $scope.getCurrentCount = function(indicator) {
      //for (var i = $scope.eachGame.length - 1; i >= 0; i--) {
      //if (gameID == $scope.eachGame[i].game_pk) {
      var inningState = $scope.currentGame.inningState;
      //if (inningState == 'top' || inningState == 'bottom') {
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
      //}
    };
    //};
    //};
  });
