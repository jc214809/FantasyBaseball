angular.module('fantasyBaseball.count', [])
  .controller('countCtrl', function countController($scope, $http, $q) {
    $scope.getCurrentCount = function(gameID, indicator) {
      for (var i = $scope.eachGame.length - 1; i >= 0; i--) {
        if (gameID == $scope.eachGame[i].game_pk) {
          var inningState = $scope.eachGame[i].status.inning_state.toLowerCase();
          if (inningState == 'top' || inningState == 'bottom') {
            switch (indicator) {
              case "Ball":
                return $scope.eachGame[i].status.b;
              case "Strike":
                return $scope.eachGame[i].status.s;
              case "Out":
                return $scope.eachGame[i].status.o;
              default:
                console.log('error getting count')
            }
          }
        };
      };
    };
  });
