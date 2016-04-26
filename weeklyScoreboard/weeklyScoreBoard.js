angular.module('fantasyBaseball.weeklyScoreBoard', [])
  .controller('weeklyScoreBoardCtrl', function weeklyScoreBoardController($scope, $http, $q) {
    $scope.schedule = [];
    $scope.matchUpIds = [];
    $scope.opponentsSchedule = [];
    $scope.awayScores = null;
    $scope.homeScores = null;
    $.ajax({
      url: 'http://www.mlb.com/fantasylookup/json/named.fb_index_schedule.bam?league_id=' + $scope.leagueID,
      type: 'GET',
      dataType: 'json',
      error: function() {
        alert("Error");
      },
      success: function(data) {
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
        $scope.matchupScores();
        $scope.$apply();
      }
    });
    $scope.matchupScores = function() {
      $.ajax({
        url: 'http://mlb.mlb.com/fantasylookup/json/named.fb_team_score_by_date.bam?away_team_id=' + $scope.awayTeam.team_id + '&home_team_id=' + $scope.homeTeam.team_id + '&period_id=' + $scope.periodId,
        type: 'GET',
        dataType: 'json',
        error: function() {
          alert("Error");
        },

        success: function(data) {
          $scope.masterScoreData = data.fb_team_score_by_date.queryResults.row;
          $scope.awayScoreData = [];
          $scope.homeScoreData = [];
          for (var i = 0; i < $scope.masterScoreData.length; i++) {
            if ($scope.masterScoreData[i].team_id == $scope.awayTeam.team_id) {
              $scope.awayScoreData.push($scope.masterScoreData[i]);
            } else {
              $scope.homeScoreData.push($scope.masterScoreData[i]);
            }
          }
          $scope.awayScores = $scope.weeklyScoreBoardJson($scope.awayScoreData);
          var awayTotal = $scope.weeklyTotal($scope.awayScores);
          $scope.awayScores.total = awayTotal;
          $scope.homeScores = $scope.weeklyScoreBoardJson($scope.homeScoreData);
          var homeTotal = $scope.weeklyTotal($scope.homeScores);
          $scope.homeScores.total = homeTotal;
        }
      });
    };
    $scope.weeklyScoreBoardJson = function(scoringData) {
      $scope.weeklyScores = ['{ "monday": "0" , "tuesday": "0", "wednesday": "0", "thursday": "0", "friday": "0", "saturday": "0", "sunday": "0", "total": "0"}'];
      var obj = JSON.parse($scope.weeklyScores);
      for (var i = 0; i < scoringData.length; i++) {
        if (scoringData[i].scoring_day == 2) {
          obj.monday = scoringData[i].total_points;
        } else if (scoringData[i].scoring_day == 3) {
          obj.tuesday = scoringData[i].total_points;
        } else if (scoringData[i].scoring_day == 4) {
          obj.wednesday = scoringData[i].total_points;
        } else if (scoringData[i].scoring_day == 5) {
          obj.thursday = scoringData[i].total_points;
        } else if (scoringData[i].scoring_day == 6) {
          obj.friday = scoringData[i].total_points;
        } else if (scoringData[i].scoring_day == 7) {
          obj.saturday = scoringData[i].total_points;
        } else {
          obj.sunday = scoringData[i].total_points;
        }
      }
      return obj;
    };

    $scope.weeklyTotal = function(scores) {
      var total = parseInt(scores.monday, 10) + parseInt(scores.tuesday, 10) + parseInt(scores.wednesday, 10) + parseInt(scores.thursday, 10) + parseInt(scores.friday, 10) + parseInt(scores.saturday, 10) + parseInt(scores.sunday, 10);
      return total;
    };

  });
