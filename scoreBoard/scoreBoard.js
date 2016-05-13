    angular.module('fantasyBaseball.scoreboard', ['fantasyBaseball.weeklyScoreBoard', 'fantasyBaseball.lineup', 'fantasyBaseball.pitchingStaff'])
      .directive('lineup', function() {
        return {
          restrict: 'E',
          controller: 'lineupCtrl',
          scope: {
            players: '=players',
            allGames: '=allgames',
            eachGame: '=eachgame',
            playersUpToBat: '=up',
            playersOnDeck: '=deck',
            playersInTheHole: '=hole',
            allGamesDetails: '=details'
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
            allPitchingStaffs: '=allpitchingstaffs',
            allGamesDetails: '=details'
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
          $scope.playersUpToBatUpdated = [];
          $scope.playersOnDeckUpdated = [];
          $scope.playersInTheHoleUpdated = [];
          $scope.battersToAdd = [];
          $scope.staffsToAdd = [];
          $scope.gameURLs = [];
          $scope.matchup = null;
          $scope.scoreBoard = 'http://gd2.mlb.com/components/game/mlb/year_' + "2016" + '/month_' + "05" + '/day_' + "13" + '/master_scoreboard.json';
          $http.get($scope.scoreBoard).success(function(data) {
            $scope.eachGame = data.data.games.game;
            angular.forEach($scope.eachGame, function(game) {
              if (game.hasOwnProperty('inhole')) {
                $scope.playersUpToBatUpdated.push(game.batter.id);
                $scope.playersOnDeckUpdated.push(game.ondeck.id);
                $scope.playersInTheHoleUpdated.push(game.inhole.id);
              };
              for (var i = 0; i < $scope.allGamesDetails.length; i++) {
                if ($scope.allGamesDetails[i].gameId == game.game_pk) {
                  $scope.gamesDetails = [];
                  $scope.gamesDetails.status = game.status.ind;
                  $scope.gamesDetails.inning = game.status.inning;
                  $scope.gamesDetails.inningState = game.status.inning_state;
                  $scope.gamesDetails.gameId = game.game_pk;
                  $scope.gamesDetails.homeTeamFileCode = game.home_file_code;
                  $scope.gamesDetails.awayTeamFileCode = game.away_file_code;
                  $scope.gamesDetails.homeTeamAbb = game.home_name_abbrev;
                  $scope.gamesDetails.awayTeamAbb = game.away_name_abbrev;
                  if (game.status.ind != 'S' && game.status.ind != 'P' && game.hasOwnProperty('linescore')) {
                    $scope.gamesDetails.homeScore = game.linescore.r.home;
                    $scope.gamesDetails.awayScore = game.linescore.r.away;
                  }
                  $scope.gamesDetails.balls = game.status.b;
                  $scope.gamesDetails.strikes = game.status.s;
                  $scope.gamesDetails.outs = game.status.o;
                  $scope.gamesDetails.doubleheader = game.double_header_sw;
                  $scope.gamesDetails.gameTime = game.time + ' ' + game.ampm;
                  $scope.allGamesDetails[i] = $scope.gamesDetails;
                }
              }
              //$scope.allGamesDetails.push($scope.gamesDetails);

              $scope.gameURLs.push('http://gd2.mlb.com' + game.game_data_directory + "/boxscore.json");
            });
            $scope.playersUpToBat = [];
            $scope.playersUpToBat = $scope.playersUpToBatUpdated;
            $scope.playersOnDeck = [];
            $scope.playersOnDeck = $scope.playersOnDeckUpdated;
            $scope.playersInTheHole = [];
            $scope.playersInTheHole = $scope.playersInTheHoleUpdated;

            angular.forEach($scope.gameURLs, function(games) {
              $scope.game = $http.get(games);
              $q.all([$scope.game]).then(function(gameData) {
                $scope.matchup = gameData[0].data.data.boxscore;
                angular.forEach(gameData[0].data.data.boxscore.batting[0].batter, function(eachBatter) {
                  for (var i = 0; i < $scope.allGames.length; ++i) {
                    eachBatter.gameID = $scope.matchup.game_pk;
                    eachBatter.teamID = $scope.matchup.away_id;
                    if ($scope.allGames[i].id == eachBatter.id && $scope.allGames[i].gameID == eachBatter.gameID) {
                      $scope.allGames[i] = eachBatter;
                    } else {
                      $scope.battersToAdd.push(eachBatter);
                    }
                  }
                });
                angular.forEach(gameData[0].data.data.boxscore.batting[1].batter, function(eachBatter) {
                  for (var i = 0; i < $scope.allGames.length; ++i) {
                    eachBatter.gameID = $scope.matchup.game_pk;
                    eachBatter.teamID = $scope.matchup.home_id;
                    if ($scope.allGames[i].id == eachBatter.id && $scope.allGames[i].gameID == eachBatter.gameID) {
                      $scope.allGames[i] = eachBatter;
                    } else {
                      $scope.battersToAdd.push(eachBatter);
                    }
                  }
                });

                $scope.allGames.concat($scope.battersToAdd);
                angular.forEach(gameData[0].data.data.boxscore.pitching, function(eachStaff) {
                  $scope.matchup = gameData[0].data.data.boxscore;
                  //console.log($scope.matchup.away_fname + ' vs. ' + $scope.matchup.home_fname + ' ' + $scope.matchup.status_ind);
                  delete eachStaff.pitcher;
                  eachStaff.gameID = $scope.matchup.game_pk;
                  if (eachStaff.team_flag == 'away') {
                    eachStaff.teamID = $scope.matchup.away_id;
                    $scope.check = $scope.checkForStaff(eachStaff.teamID, $scope.matchup.game_pk);
                    if ($scope.check > -1) {
                      if ($scope.allPitchingStaffs[$scope.check].teamID == eachStaff.teamID && $scope.allPitchingStaffs[$scope.check].gameID == eachStaff.gameID) {
                        eachStaff.gameID = $scope.matchup.game_pk;
                        if ($scope.matchup.status_ind == 'F' || $scope.matchup.status_ind == 'O') {
                          // console.log($scope.matchup.away_fname + ' vs. ' + $scope.matchup.home_fname + ' ' + $scope.matchup.status_ind + ' ' + (parseInt($scope.matchup.linescore.home_team_runs) < parseInt($scope.matchup.linescore.away_team_runs)))
                          if (parseInt($scope.matchup.linescore.home_team_runs) < parseInt($scope.matchup.linescore.away_team_runs)) {
                            eachStaff.win = '1';
                            eachStaff.loss = '0';
                          } else {
                            eachStaff.win = '0';
                            eachStaff.loss = '1';
                          }
                          eachStaff.status = $scope.matchup.status_ind;
                          $scope.allPitchingStaffs[$scope.check] = eachStaff;
                        } else {
                          eachStaff.win = '0';
                          eachStaff.loss = '0';
                          eachStaff.status = $scope.matchup.status_ind;
                          $scope.allPitchingStaffs[$scope.check] = eachStaff;
                        }
                      }
                    } else {
                      eachStaff.win = '0';
                      eachStaff.loss = '0';
                      eachStaff.status = $scope.matchup.status_ind;
                      $scope.staffsToAdd.push(eachStaff);
                    }
                  } else {
                    //for (var i = 0; i < $scope.allPitchingStaffs.length; ++i) {
                    eachStaff.teamID = $scope.matchup.home_id;
                    $scope.check = $scope.checkForStaff(eachStaff.teamID, $scope.matchup.game_pk);
                    if ($scope.check > -1) {
                      if ($scope.allPitchingStaffs[$scope.check].teamID == eachStaff.teamID && $scope.allPitchingStaffs[$scope.check].gameID == eachStaff.gameID) {
                        //if ($scope.allPitchingStaffs[i].teamID == eachStaff.teamID) {
                        if ($scope.matchup.status_ind == 'F' || $scope.matchup.status_ind == 'O') {
                          if (parseInt($scope.matchup.linescore.home_team_runs) > parseInt($scope.matchup.linescore.away_team_runs)) {
                            eachStaff.win = '1';
                            eachStaff.loss = '0';
                          } else {
                            eachStaff.win = '0';
                            eachStaff.loss = '1';
                          }
                          eachStaff.status = $scope.matchup.status_ind;
                          $scope.allPitchingStaffs[$scope.check] = eachStaff;
                        } else {
                          eachStaff.win = '0';
                          eachStaff.loss = '0';
                          eachStaff.status = $scope.matchup.status_ind;
                          $scope.allPitchingStaffs[$scope.check] = eachStaff;
                        }
                        //}
                      }
                    } else {
                      eachStaff.win = '0';
                      eachStaff.loss = '0';
                      eachStaff.status = $scope.matchup.status_ind;
                      $scope.staffsToAdd.push(eachStaff);
                    }
                    //}
                  }
                });
                $scope.allPitchingStaffs.concat($scope.staffsToAdd);
              });
            });
          });
        });
        $.ajax({
          url: 'http://www.mlb.com/fantasylookup/json/named.fb_index_schedule.bam?league_id=' + $scope.leagueID,
          type: 'GET',
          dataType: 'json',
          error: function() {
            alert("Error getting Schedule data. Cors-Anywhere may be down.");
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
        $scope.checkForStaff = function(id, gameID) {
          for (i = 0; i < $scope.allPitchingStaffs.length; i++) {
            if ($scope.allPitchingStaffs[i].teamID == id && $scope.allPitchingStaffs[i].gameID == gameID) {
              return i;
            }
          }
          return -1;
        };
        $scope.getGameDetails = function(teamAbb, gameTime) {
          for (var i = 0; i < $scope.eachGame.length; i++) {
            if ($scope.eachGame[i].home_file_code == teamAbb || $scope.eachGame[i].away_file_code == teamAbb) {
              //$scope.fullGameTime = $scope.eachGame[i].time + " " + $scope.eachGame[i].ampm;
              //if ($scope.fullGameTime == gameTime) {
              return $scope.eachGame[i].game_pk;
              //}
            }
          }
          return 1;
        };
        $scope.createPlayerObject = function(player) {
          $scope.playerDetails = [];
          for (var i = 0; i < $scope.eachGame.length; i++) {
            if ($scope.eachGame[i].home_file_code == player.team_file_code || $scope.eachGame[i].away_file_code == player.team_file_code) {
              $scope.playerDetails.gameTime = $scope.eachGame[i].time + " " + $scope.eachGame[i].ampm;
              //$scope.playerDetails.
            }
          }
          $scope.playerDetails.player_name = player.player_name;
          $scope.playerDetails.slot = player.slot;
          $scope.playerDetails.player_id = player.player_id
          $scope.playerDetails.team_file_code = player.team_file_code;
          // $scope.playerDetails.
          // $scope.playerDetails.
          // $scope.playerDetails.
          // $scope.playerDetails.\
          return $scope.playerDetails;
        }
        $scope.getLineups = function() {
          $.ajax({
            url: 'http://www.mlb.com/fantasylookup/json/named.fb_team_lineup.bam?period_id=' + $scope.periodId + '&team_id=' + $scope.awayTeam.team_id,
            type: 'GET',
            dataType: 'json',
            error: function() {
              alert("Error getting Lineup for the away team. Cors-Anywhere may be down.");
            },
            success: function(data) {
              $scope.awayStartingPlayers = [];
              $scope.awayBenchPlayers = [];
              $scope.awayPitchingStaff = [];
              $scope.awayBenchPitchingStaffs = [];
              angular.forEach(data.fb_team_lineup.queryResults.row, function(player) {
                //create my own player object here
                $scope.playerDetails = [];
                $scope.playerDetails = $scope.createPlayerObject(player);
                $scope.playerDetails.gameId = $scope.getGameDetails(player.team_file_code, player.game_time);
                if (player.slot_val != 'Bn' && player.slot_val != 'DL' && player.slot_val != 'PS') {
                  $scope.awayStartingPlayers.push($scope.playerDetails);
                }
                if (player.slot_val == 'Bn' && player.position != 'P') {
                  $scope.awayBenchPlayers.push($scope.playerDetails);
                }
                if (player.slot_val == 'PS') {
                  $scope.awayPitchingStaff.push($scope.playerDetails);
                }
                if (player.slot_val == 'Bn' && player.position == 'P') {
                  $scope.awayBenchPitchingStaffs.push($scope.playerDetails);
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
              alert("Error getting Lineup for the home team. Cors-Anywhere may be down.");
            },
            success: function(data) {
              $scope.homeStartingPlayers = [];
              $scope.homeBenchPlayers = [];
              $scope.homePitchingStaff = [];
              $scope.homeBenchPitchingStaffs = [];
              angular.forEach(data.fb_team_lineup.queryResults.row, function(player) {
                $scope.playerDetails = [];
                $scope.playerDetails = $scope.createPlayerObject(player);
                $scope.playerDetails.gameId = $scope.getGameDetails(player.team_file_code, player.game_time);
                if (player.slot_val != 'Bn' && player.slot_val != 'DL' && player.slot_val != 'PS') {
                  $scope.homeStartingPlayers.push($scope.playerDetails);
                }
                if (player.slot_val == 'Bn' && player.position != 'P') {
                  $scope.homeBenchPlayers.push($scope.playerDetails);
                }
                if (player.slot_val == 'PS') {
                  $scope.homePitchingStaff.push($scope.playerDetails);
                }
                if (player.slot_val == 'Bn' && player.position == 'P') {
                  $scope.homeBenchPitchingStaffs.push($scope.playerDetails);
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
          $scope.allGamesDetails = [];
          $scope.scoreBoard = 'http://gd2.mlb.com/components/game/mlb/year_' + "2016" + '/month_' + "05" + '/day_' + "13" + '/master_scoreboard.json';
          $http.get($scope.scoreBoard).success(function(data) {
            $scope.eachGame = data.data.games.game;
            angular.forEach($scope.eachGame, function(game) {
              if (game.hasOwnProperty('inhole')) {
                $scope.playersUpToBat.push(game.batter.id);
                $scope.playersOnDeck.push(game.ondeck.id);
                $scope.playersInTheHole.push(game.inhole.id);
              }
              $scope.gamesDetails = [];
              $scope.gamesDetails.status = game.status.ind;
              $scope.gamesDetails.inning = game.status.inning;
              $scope.gamesDetails.inningState = game.status.inning_state;
              $scope.gamesDetails.gameId = game.game_pk;
              $scope.gamesDetails.homeTeamFileCode = game.home_file_code;
              $scope.gamesDetails.awayTeamFileCode = game.away_file_code;
              $scope.gamesDetails.homeTeamAbb = game.home_name_abbrev;
              $scope.gamesDetails.awayTeamAbb = game.away_name_abbrev;
              if (game.status.ind != 'S' && game.status.ind != 'P' && game.hasOwnProperty('linescore')) {
                $scope.gamesDetails.homeScore = game.linescore.r.home;
                $scope.gamesDetails.awayScore = game.linescore.r.away;
              }
              $scope.gamesDetails.balls = game.status.b;
              $scope.gamesDetails.strikes = game.status.s;
              $scope.gamesDetails.outs = game.status.o;
              $scope.gamesDetails.doubleheader = game.double_header_sw;
              $scope.gamesDetails.gameTime = game.time + ' ' + game.ampm;
              $scope.allGamesDetails.push($scope.gamesDetails);
              $scope.gameURLs.push('http://gd2.mlb.com' + game.game_data_directory + "/boxscore.json");
            });
            angular.forEach($scope.gameURLs, function(games) {
              $scope.game = $http.get(games);
              $q.all([$scope.game]).then(function(gameData) {
                $scope.matchup = gameData[0].data.data.boxscore;
                angular.forEach(gameData[0].data.data.boxscore.batting[0].batter, function(eachBatter) {
                  eachBatter.gameID = $scope.matchup.game_pk;
                  eachBatter.teamID = $scope.matchup.away_id;
                  $scope.allGames.push(eachBatter);
                  //console.log(eachBatter);
                });
                angular.forEach(gameData[0].data.data.boxscore.batting[1].batter, function(eachBatter) {
                  eachBatter.gameID = $scope.matchup.game_pk;
                  eachBatter.teamID = $scope.matchup.home_id;
                  $scope.allGames.push(eachBatter);
                  //console.log(eachBatter);
                });
                angular.forEach(gameData[0].data.data.boxscore.pitching, function(eachBatter) {
                  delete eachBatter.pitcher;
                  if (eachBatter.team_flag == 'away') {
                    eachBatter.teamID = $scope.matchup.away_id;
                    if ($scope.matchup.status_ind == 'F' || $scope.matchup.status_ind == 'O') {
                      if (parseInt($scope.matchup.linescore.home_team_runs) < parseInt($scope.matchup.linescore.away_team_runs)) {
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
                      if (parseInt($scope.matchup.linescore.home_team_runs) > parseInt($scope.matchup.linescore.away_team_runs)) {
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
                  eachBatter.gameID = $scope.matchup.game_pk;
                  eachBatter.status = $scope.matchup.status_ind;
                  $scope.allPitchingStaffs.push(eachBatter);
                });
              });
            });
          });
        };
      });
