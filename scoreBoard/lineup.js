angular.module('fantasyBaseball.lineup', [])
  .directive('status', function() {
    return {
      restrict: 'E',
      controller: 'lineupCtrl',
      templateUrl: "scoreBoard/status.html"
    };
  })
  .controller('lineupCtrl', function lineupController($scope, $http, $q) {
    $scope.gameStatus = function(gameID) {
      for (var i = 0; i < $scope.allGames.length; i++) {
        if ($scope.allGames[i].id == gameID) {
          $scope.gameStatus = $scope.allGames[i].status;
        }
      }
    };
    $scope.getGameDetails = function(teamFileCode) {
      for (i = 0; i < $scope.allGamesDetails.length; i++) {
        if ($scope.allGamesDetails[i].homeTeamFileCode == teamFileCode || $scope.allGamesDetails[i].awayTeamFileCode == teamFileCode) {
          $scope.currentGame = $scope.allGamesDetails[i];
          break;
        } else {
          $scope.currentGame = [];
        }
      }
    };
    $scope.getInningState = function(inningState) {
      switch (inningState.toLowerCase()) {
        case 'top':
          return 'T';
        case 'middle':
          return 'M';
        case 'end':
          return 'E';
        default:
          return 'B';
      }
    }
    $.ajax({
      url: 'http://www.mlb.com/fantasylookup/json/named.wsfb_news_injury.bam',
      type: 'GET',
      dataType: 'json',
      error: function() {
        console.log("Could not retreive injury data");
      },
      success: function(data) {
        $scope.allInjuryInfo = [];
        angular.forEach(data.wsfb_news_injury.queryResults.row, function(player) {
          $scope.allInjuryInfo.push(player);
        });
      }
    });
    $scope.injuryDetails = function(playerID) {
      $scope.injuryInfo = null;
      $scope.injuryUpdate = null;
      for (var i = 0; i < $scope.allInjuryInfo.length; i++) {
        if ($scope.allInjuryInfo[i].player_id == playerID) {
          $scope.injuryInfo = $scope.allInjuryInfo[i].due_back + ": " + $scope.allInjuryInfo[i].injury_desc;
          $scope.injuryUpdate = $scope.allInjuryInfo[i].injury_update;
          return true;
        }
      }
      return false;
    }
    $scope.hittingStats = function(playerID) {
      //$scope.allGames = allGames;
      for (var i = 0; i < $scope.allGames.length; i++) {
        if ($scope.allGames[i].id == playerID) {
          $scope.hittingStatLine = $scope.allGames[i].h + ' - ' + $scope.allGames[i].ab + ' ,';
          if ($scope.allGames[i].d != 0) {
            $scope.hittingStatLine += ' ' + $scope.allGames[i].d + ' 2B ,';
          };
          if ($scope.allGames[i].t != 0) {
            $scope.hittingStatLine += ' ' + $scope.allGames[i].t + ' 3B ,';
          };
          if ($scope.allGames[i].hr != 0) {
            $scope.hittingStatLine += ' ' + $scope.allGames[i].hr + ' HR ,';
          };
          if ($scope.allGames[i].rbi != 0) {
            $scope.hittingStatLine += ' ' + $scope.allGames[i].rbi + ' RBI ,';
          };
          if ($scope.allGames[i].bb != 0) {
            $scope.hittingStatLine += ' ' + $scope.allGames[i].bb + ' BB ,';
          };
          if ($scope.allGames[i].r != 0) {
            $scope.hittingStatLine += ' ' + $scope.allGames[i].r + ' R ,';
          };
          if ($scope.allGames[i].sb != 0) {
            $scope.hittingStatLine += ' ' + $scope.allGames[i].sb + ' SB ,';
          };
          if ($scope.allGames[i].cs != 0) {
            $scope.hittingStatLine += ' ' + $scope.allGames[i].cs + ' CS ,';
          };
          $scope.hittingStatLine = $scope.hittingStatLine.substring(0, $scope.hittingStatLine.length - 1);
          return $scope.hittingStatLine;
        }
      };
    };
    $scope.getHittersScore = function(playerID) {
      for (var i = 0; i < $scope.allGames.length; i++) {
        if ($scope.allGames[i].id == playerID) {
          return ((((parseFloat($scope.allGames[i].h)) - (parseFloat($scope.allGames[i].d) + parseFloat($scope.allGames[i].t) + parseFloat($scope.allGames[i].hr))) * 1) + (parseFloat($scope.allGames[i].d) * 2) + (parseFloat($scope.allGames[i].t) * 3) + (parseFloat($scope.allGames[i].hr) * 4) + (parseFloat($scope.allGames[i].r) * 1) + (parseFloat($scope.allGames[i].rbi) * 1) + (parseFloat($scope.allGames[i].bb) * 1) + (parseFloat($scope.allGames[i].sb) * 2) + (parseFloat($scope.allGames[i].cs) * -1));
        }
      };
      return 0;
    };
  });
