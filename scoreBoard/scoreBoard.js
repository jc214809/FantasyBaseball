    angular.module('fantasyBaseball.scoreboard', ['fantasyBaseball.weeklyScoreBoard', 'fantasyBaseball.lineup', 'fantasyBaseball.pitchingStaff'])
      .directive('lineup', function() {
        return {
          restrict: 'E',
          controller: 'lineupCtrl',
          scope: {
            players: '=players',
            allGames: '=allgames',
            playersUpToBat: '=up',
            playersOnDeck: '=deck',
            playersInTheHole: '=hole'
          },
          templateUrl: 'scoreBoard/lineup.html'
        };
      })
      .directive('staff', function() {
        return {
          restrict: 'E',
          controller: 'pitchingStaffCtrl',
          scope: {
            staffs: '=staffs',
            allPitchingStaffs: '=allpitchingstaffs'
          },
          templateUrl: 'scoreBoard/pitchingStaff.html'
        };
      })
      .directive('scores', function() {
        return {
          restrict: 'E',
          controller: 'weeklyScoreBoardCtrl',
          scope: {
            awayStartingPlayers: '=awaystarters',
            awayPitchingStaff: '=awaystaff',
            homeStartingPlayers: '=homestarters',
            homePitchingStaff: '=homestaff'
          },
          templateUrl: 'weeklyScoreboard/weeklyScoreBoard.html'
        };
      })
      .factory("poollingFactory", function($timeout) {
        var timeIntervalInSec = 1;

        function callFnOnInterval(fn, timeInterval) {
          var promise = $timeout(fn, 7000 * timeIntervalInSec);
          return promise.then(function() {
            callFnOnInterval(fn, timeInterval);
          });
        };
        return {
          callFnOnInterval: callFnOnInterval
        };
      })
      .controller('ScoreBoardCtrl', function ScoreboardController($scope, $http, $q, $timeout, poollingFactory) {
        poollingFactory.callFnOnInterval(function() {
          //$scope.allGames = [];
          // $scope.allGames2 = [];
          // $scope.allPitchingStaffs = [];
          $scope.playersUpToBatUpdated = [];
          $scope.playersOnDeckUpdated = [];
          $scope.playersInTheHoleUpdated = [];
          $scope.battersToAdd = [];
          $scope.staffsToAdd = [];
          $scope.scoreBoard = 'http://gd2.mlb.com/components/game/mlb/year_' + "2016" + '/month_' + "04" + '/day_' + "30" + '/master_scoreboard.json';
          $http.get($scope.scoreBoard).success(function(data) {
            $scope.eachGame = data.data.games.game;
            angular.forEach($scope.eachGame, function(game) {
              if (game.hasOwnProperty('inhole')) {
                $scope.playersUpToBatUpdated.push(game.batter.id);
                $scope.playersOnDeckUpdated.push(game.ondeck.id);
                $scope.playersInTheHoleUpdated.push(game.inhole.id);
              };
              $scope.gameURLs.push('http://gd2.mlb.com' + game.game_data_directory + "/boxscore.json");
            });
            angular.forEach($scope.gameURLs, function(games) {
              $scope.game = $http.get(games);
              $q.all([$scope.game]).then(function(gameData) {
                angular.forEach(gameData[0].data.data.boxscore.batting[0].batter, function(eachBatter) {
                  for (var i = 0; i < $scope.allGames.length; ++i) {
                    if ($scope.allGames[i].id === eachBatter.id) {
                      $scope.allGames[i] = eachBatter;
                    } else {
                      $scope.battersToAdd.push(eachBatter);
                    }
                  }
                });
                $scope.playersUpToBat = [];
                $scope.playersUpToBat = $scope.playersUpToBatUpdated;
                $scope.playersOnDeck = [];
                $scope.playersOnDeck = $scope.playersOnDeckUpdated;
                $scope.playersInTheHole = [];
                $scope.playersInTheHole = $scope.playersInTheHoleUpdated;
                angular.forEach(gameData[0].data.data.boxscore.batting[1].batter, function(eachBatter) {
                  //if ($scope.homeBattersPlayerIds.indexOf(eachBatter.id) > -1 || $scope.awayBattersPlayerIds.indexOf(eachBatter.id) > -1) {
                  for (var i = 0; i < $scope.allGames.length; ++i) {
                    if ($scope.allGames[i].id === eachBatter.id) {
                      $scope.allGames[i] = eachBatter;
                    } else {
                      $scope.battersToAdd.push(eachBatter);
                    }
                  }
                  //}
                });
                $scope.allGames.concat($scope.battersToAdd);
                angular.forEach(gameData[0].data.data.boxscore.pitching, function(eachStaff) {
                  $scope.matchup = gameData[0].data.data.boxscore;
                  eachStaff.status = $scope.matchup.status_ind;
                  delete eachStaff.pitcher;
                  if (eachStaff.team_flag == 'away') {
                    for (var i = 0; i < $scope.allPitchingStaffs.length; ++i) {
                      eachStaff.teamID = $scope.matchup.away_id;
                      if ($scope.allPitchingStaffs[i].teamID === eachStaff.teamID) {
                        if (eachStaff.status == 'F' || eachStaff.status == 'O') {
                          if ($scope.matchup.linescore.home_team_runs < $scope.matchup.linescore.away_team_runs) {
                            eachStaff.win = '1';
                            eachStaff.loss = '0';
                          } else {
                            eachStaff.win = '0';
                            eachStaff.loss = '1';
                          }
                          $scope.allPitchingStaffs[i] = eachStaff;
                        } else {
                          eachStaff.win = '0';
                          eachStaff.loss = '0';
                          $scope.allPitchingStaffs[i] = eachStaff;
                        }
                      } else {
                        eachStaff.win = '0';
                        eachStaff.loss = '0';
                        $scope.staffsToAdd.push(eachStaff);
                      }
                    }
                  } else {
                    for (var i = 0; i < $scope.allPitchingStaffs.length; ++i) {
                      eachStaff.teamID = $scope.matchup.home_id;
                      if ($scope.allPitchingStaffs[i].teamID === eachStaff.teamID) {
                        if (eachStaff.status == 'F' || eachStaff.status == 'O') {
                          if ($scope.matchup.linescore.home_team_runs > $scope.matchup.linescore.away_team_runs) {
                            eachStaff.win = '1';
                            eachStaff.loss = '0';
                          } else {
                            eachStaff.win = '0';
                            eachStaff.loss = '1';
                          }
                          $scope.allPitchingStaffs[i] = eachStaff;
                        } else {
                          eachStaff.win = '0';
                          eachStaff.loss = '0';
                          $scope.allPitchingStaffs[i] = eachStaff;
                        }
                      } else {
                        eachStaff.win = '0';
                        eachStaff.loss = '0';
                        $scope.staffsToAdd.push(eachStaff);
                      }
                    }
                  }
                  $scope.allPitchingStaffs.concat($scope.staffsToAdd);
                  //$scope.allPitchingStaffs.push(eachStaff);
                });
              });
            });
          });
          //$scope.allGames = $scope.allGames2;
        });
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
              $scope.teamFlagAway = "away";
              $scope.teamFlagHome = "home";
              $scope.awayStartingPlayers = [];
              $scope.awayBenchPlayers = [];
              $scope.awayPitchingStaff = [];
              $scope.awayBenchPitchingStaffs = [];
              $scope.awayBattersPlayerIds = [];
              $scope.awayStaffIds = [];
              angular.forEach(data.fb_team_lineup.queryResults.row, function(player) {
                //console.log("player " + JSON.stringify(player));
                if (player.slot_val != 'Bn' && player.slot_val != 'DL' && player.slot_val != 'PS') {
                  $scope.awayStartingPlayers.push(player);
                  $scope.awayBattersPlayerIds.push(player.player_id);
                }
                if (player.slot_val == 'Bn' && player.position != 'P') {
                  $scope.awayBenchPlayers.push(player);
                  $scope.awayBattersPlayerIds.push(player.player_id);
                }
                if (player.slot_val == 'PS') {
                  $scope.awayPitchingStaff.push(player);
                  $scope.awayStaffIds.push(player.player_id);
                }
                if (player.slot_val == 'Bn' && player.position == 'P') {
                  $scope.awayBenchPitchingStaffs.push(player);
                  $scope.awayStaffIds.push(player.player_id);
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
              $scope.homePitchingStaff = [];
              $scope.homeBenchPitchingStaffs = [];
              $scope.homeBattersPlayerIds = [];
              $scope.homeStaffIds = [];
              angular.forEach(data.fb_team_lineup.queryResults.row, function(player) {
                if (player.slot_val != 'Bn' && player.slot_val != 'DL' && player.slot_val != 'PS') {
                  $scope.homeStartingPlayers.push(player);
                  $scope.homeBattersPlayerIds.push(player.player_id);
                }
                if (player.slot_val == 'Bn' && player.position != 'P') {
                  $scope.homeBenchPlayers.push(player);
                  $scope.homeBattersPlayerIds.push(player.player_id);
                }
                if (player.slot_val == 'PS') {
                  $scope.homePitchingStaff.push(player);
                  $scope.homeStaffIds.push(player.player_id);
                }
                if (player.slot_val == 'Bn' && player.position == 'P') {
                  $scope.homeBenchPitchingStaffs.push(player);
                  $scope.homeStaffIds.push(player.player_id);
                }
              });
              $scope.$apply();
            }
          });
          $scope.getStats();
        };
        $scope.getStats = function() {
          $scope.allGames = [];
          $scope.allPitchingStaffs = [];
          $scope.gameURLs = [];
          $scope.playersUpToBat = [];
          $scope.playersOnDeck = [];
          $scope.playersInTheHole = [];
          $scope.scoreBoard = 'http://gd2.mlb.com/components/game/mlb/year_' + "2016" + '/month_' + "04" + '/day_' + "30" + '/master_scoreboard.json';
          $http.get($scope.scoreBoard).success(function(data) {
            $scope.eachGame = data.data.games.game;
            angular.forEach($scope.eachGame, function(game) {
              if (game.hasOwnProperty('inhole')) {
                $scope.playersUpToBat.push(game.batter.id);
                $scope.playersOnDeck.push(game.ondeck.id);
                $scope.playersInTheHole.push(game.inhole.id);
              }
              $scope.gameURLs.push('http://gd2.mlb.com' + game.game_data_directory + "/boxscore.json");
            });
            angular.forEach($scope.gameURLs, function(games) {
              $scope.game = $http.get(games);
              $q.all([$scope.game]).then(function(gameData) {
                angular.forEach(gameData[0].data.data.boxscore.batting[0].batter, function(eachBatter) {
                  //if ($scope.homeBattersPlayerIds.indexOf(eachBatter.id) > -1 || $scope.awayBattersPlayerIds.indexOf(eachBatter.id) > -1) {
                  $scope.allGames.push(eachBatter);
                  //}
                });
                angular.forEach(gameData[0].data.data.boxscore.batting[1].batter, function(eachBatter) {
                  //if ($scope.homeBattersPlayerIds.indexOf(eachBatter.id) > -1 || $scope.awayBattersPlayerIds.indexOf(eachBatter.id) > -1) {
                  $scope.allGames.push(eachBatter);
                  //}
                });
                angular.forEach(gameData[0].data.data.boxscore.pitching, function(eachBatter) {
                  $scope.matchup = gameData[0].data.data.boxscore;
                  delete eachBatter.pitcher;
                  if (eachBatter.team_flag == 'away') {
                    eachBatter.teamID = $scope.matchup.away_id;
                    if ($scope.matchup.status_ind == 'F' || $scope.matchup.status_ind == 'O') {
                      if ($scope.matchup.linescore.home_team_runs < $scope.matchup.linescore.away_team_runs) {
                        eachBatter.win = '1';
                        eachBatter.loss = '0';
                      } else {
                        eachBatter.win = '0';
                        eachBatter.loss = '1';
                      }
                    } else {
                      eachBatter.win = '0';
                      eachBatter.loss = '0';
                    }
                  } else {
                    eachBatter.teamID = $scope.matchup.home_id;
                    if ($scope.matchup.status_ind == 'F' || $scope.matchup.status_ind == 'O') {
                      if ($scope.matchup.linescore.home_team_runs > $scope.matchup.linescore.away_team_runs) {
                        eachBatter.win = '1';
                        eachBatter.loss = '0';
                      } else {
                        eachBatter.win = '0';
                        eachBatter.loss = '1';
                      }
                    } else {
                      eachBatter.win = '0';
                      eachBatter.loss = '0';
                    }
                  }
                  eachBatter.status = $scope.matchup.status_ind;
                  $scope.allPitchingStaffs.push(eachBatter);
                });
              });
            });
          });
        };
      });
