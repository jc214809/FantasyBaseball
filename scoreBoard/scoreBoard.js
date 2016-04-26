    angular.module('fantasyBaseball.scoreboard', ['fantasyBaseball.weeklyScoreBoard', 'fantasyBaseball.lineup']).directive('lineup', function() {
        return {
          restrict: 'E',
          controller: 'lineupCtrl',
          scope: {
            startingPlayers: '=starters',
            benchPlayers: '=bench',
            allGames: '=allgames'
          },
          templateUrl: 'scoreBoard/lineup.html'
        };
      })
      .controller('ScoreBoardCtrl', function ScoreboardController($scope, $http, $q) {
        $scope.getLineups();
        $scope.getLineups = function() {
          $.ajax({
            url: 'http://www.mlb.com/fantasylookup/json/named.fb_team_lineup.bam?period_id=' + $scope.periodId + '&team_id=' + $scope.awayTeam.team_id,
            type: 'GET',
            dataType: 'json',
            error: function() {
              alert("Joel Error");
            },
            success: function(data) {
              $scope.awayStartingPlayers = [];
              $scope.awayBenchPlayers = [];
              $scope.pitchingStaff = 'lan';
              angular.forEach(data.fb_team_lineup.queryResults.row, function(player) {
                if (player.slot_val != 'Bn' && player.slot_val != 'DL' && player.slot_val != 'PS') {
                  $scope.awayStartingPlayers.push(player);
                }
                if (player.slot_val == 'Bn') {
                  $scope.awayBenchPlayers.push(player);
                }
              });
              $scope.$apply();
            }
          });
          $.ajax({
            url: 'http://www.mlb.com/fantasylookup/json/named.fb_team_lineup.bam?period_id=' + $scope.periodId + '&team_id=' + $scope.homeTeam.team_id,
            type: 'GET',
            dataType: 'json',
            error: function() {
              alert("Joel Error");
            },
            success: function(data) {
              $scope.homeStartingPlayers = [];
              $scope.homeBenchPlayers = [];
              $scope.pitchingStaff = 'lan';
              angular.forEach(data.fb_team_lineup.queryResults.row, function(player) {
                if (player.slot_val != 'Bn' && player.slot_val != 'DL' && player.slot_val != 'PS') {
                  $scope.homeStartingPlayers.push(player);
                }
                if (player.slot_val == 'Bn') {
                  $scope.homeBenchPlayers.push(player);
                }
              });
              $scope.$apply();
            }
          });
        };
        $scope.allGames = [];
        $scope.gameURLs = [];
        $scope.scoreBoard = 'http://gd2.mlb.com/components/game/mlb/year_' + "2016" + '/month_' + "04" + '/day_' + "25" + '/master_scoreboard.json';
        $http.get($scope.scoreBoard).success(function(data) {
          $scope.eachGame = data.data.games.game;
          angular.forEach($scope.eachGame, function(game) {
            $scope.gameURLs.push('http://gd2.mlb.com' + game.game_data_directory + "/boxscore.json");
          });
          angular.forEach($scope.gameURLs, function(games) {
            $scope.game = $http.get(games);
            $q.all([$scope.game]).then(function(gameData) {
              angular.forEach(gameData[0].data.data.boxscore.batting[0].batter, function(eachBatter) {
                $scope.allGames.push(eachBatter);
              });
              angular.forEach(gameData[0].data.data.boxscore.batting[1].batter, function(eachBatter) {
                $scope.allGames.push(eachBatter);
              });
            });
          });
        });
      });
