angular.module('fantasyBaseball.playerStatus', [])
  .controller('playerStatusCtrl', function playerStatusController($scope) {
    $scope.enteredButLeft = false;
    $scope.entered = false;
    $scope.leftGame = false;
    $scope.checkPlayerStatus = function() {
      for (var i = $scope.allGames.length - 1; i >= 0; i--) {
        //for (var i = 0; i < $scope.allGames.length; i++) {
        // console.log($scope.allGames[i]);
        if ($scope.allGames[i].id == $scope.player.player_id && ($scope.player.gameId == $scope.allGames[i].gameID)) {
          for (var b = $scope.allGames.length - 1; b >= 0; b--) {
            //for (var b = 0; b < $scope.allGames.length; b++) {
            var iBatter = $scope.allGames[i].bo;
            var bBatter = $scope.allGames[b].bo;
            if (iBatter != undefined && bBatter != undefined) {
              if ((iBatter.charAt(0) == bBatter.charAt(0)) && ($scope.allGames[i].id != $scope.allGames[b].id) && ($scope.allGames[i].teamID == $scope.allGames[b].teamID)) {
                if (parseInt(iBatter.charAt(2)) > 0 && parseInt(bBatter.charAt(2)) > parseInt(iBatter.charAt(2))) {
                  $scope.enteredButLeft = true;
                  break;
                } else if (parseInt(iBatter.charAt(2)) > 0) {
                  $scope.entered = true;
                  break;
                } else if (parseInt(bBatter.charAt(2)) > parseInt(iBatter.charAt(2))) {
                  $scope.leftGame = true;
                  break;
                }
              };
            };
          };
        }; //add else here to say they are not in the lineup
      };
    };
  });
