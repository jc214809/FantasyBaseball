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
        $.ajax({
          url: 'http://www.mlb.com/fantasylookup/json/named.fb_index_schedule.bam?league_id=' + $scope.leagueID,
          type: 'GET',
          dataType: 'json',
          error: function() {
            alert("Error");
          },
          success: function(data) {
            $scope.schedule = [];
            $scope.matchUpIds = [];
            $scope.opponentsSchedule = [];
            $scope.masterSchedule = data.fb_index_schedule.queryResults;
            angular.forEach($scope.masterSchedule.row, function(schedule) {
              if (schedule.team_id == $scope.teamID) {
                $scope.schedule.push(schedule);
                $scope.matchUpIds.push(schedule.matchup_set);
              }
            });

            for (var i = 0; i < $scope.masterSchedule.row.length; i++) {
              if ($scope.masterSchedule.row[i].team_id != $scope.teamID && $scope.matchUpIds.indexOf($scope.masterSchedule.row[i].matchup_set) != -1) {
                $scope.opponentsSchedule.push($scope.masterSchedule.row[i]);
              }
            }
            $scope.homeTeam = null;
            $scope.awayTeam = null;
            for (var i = 0; i < $scope.schedule.length; i++) {
              if ($scope.schedule[i].period_id == $scope.periodId) {
                if ($scope.schedule[i].is_home == 'y') {
                  $scope.homeTeam = $scope.schedule[i];
                } else {
                  $scope.awayTeam = $scope.schedule[i];
                }
                break;
              }
            }
            for (var i = 0; i < $scope.opponentsSchedule.length; i++) {
              if ($scope.opponentsSchedule[i].period_id == $scope.periodId) {
                if ($scope.opponentsSchedule[i].is_home == 'y') {
                  $scope.homeTeam = $scope.opponentsSchedule[i];
                } else {
                  $scope.awayTeam = $scope.opponentsSchedule[i];
                }
                break;
              }
            }
            $scope.getLineups();
            $scope.$apply();
          }
        });
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
                if (player.slot_val == 'Bn' && player.position != 'P') {
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
                if (player.slot_val == 'Bn' && player.position != 'P') {
                  $scope.homeBenchPlayers.push(player);
                }
              });
              $scope.$apply();
            }
          });
        };

        $scope.allGames = [];
        $scope.gameURLs = [];
        $scope.scoreBoard = 'http://gd2.mlb.com/components/game/mlb/year_' + "2016" + '/month_' + "04" + '/day_' + "27" + '/master_scoreboard.json';
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
