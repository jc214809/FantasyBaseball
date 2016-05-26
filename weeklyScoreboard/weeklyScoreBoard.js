angular.module('fantasyBaseball.weeklyScoreBoard', [])
  .controller('weeklyScoreBoardCtrl', function weeklyScoreBoardController($scope, $http, $q) {
    $scope.awayScores = null;
    $scope.homeScores = null;
    if ($scope.awayTeam != undefined && $scope.homeTeam != undefined) {
      $.ajax({
        url: 'http://mlb.mlb.com/fantasylookup/json/named.fb_team_score_by_date.bam?away_team_id=' + $scope.awayTeam.team_id + '&home_team_id=' + $scope.homeTeam.team_id + '&period_id=' + $scope.periodId,
        type: 'GET',
        dataType: 'json',
        error: function() {
          alert("Error getting weekly Score data. CORS-Anywhere may be down.");
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
        }
      });
    };
    $scope.getScores = function() {
      if ($scope.awayScoreData != undefined && $scope.homeScoreData != undefined) {
        $scope.awayScores = $scope.weeklyScoreBoardJson($scope.awayScoreData, $scope.awayStartingPlayers, $scope.awayPitchingStaff);
        var awayTotal = $scope.weeklyTotal($scope.awayScores);
        $scope.awayScores.total = awayTotal;
        $scope.homeScores = $scope.weeklyScoreBoardJson($scope.homeScoreData, $scope.homeStartingPlayers, $scope.homePitchingStaff);
        var homeTotal = $scope.weeklyTotal($scope.homeScores);
        $scope.homeScores.total = homeTotal;
      }
    }
    $scope.weeklyScoreBoardJson = function(scoringData, starters, staff) {
      $scope.weeklyScores = ['{ "monday": "0" , "tuesday": "0", "wednesday": "0", "thursday": "0", "friday": "0", "saturday": "0", "sunday": "0", "total": "0"}'];
      var today = $scope.selectedDate;
      var obj = JSON.parse($scope.weeklyScores);
      for (var i = 0; i < scoringData.length; i++) {
        if (scoringData[i].scoring_day == 2) {
          if (today.getDay() == 1 && $scope.periodId == $scope.periodId) {
            obj.monday = $scope.todaysTotal(starters, staff);
          } else {
            obj.monday = scoringData[i].total_points;
          }
        } else if (scoringData[i].scoring_day == 3) {
          if (today.getDay() == 2 && $scope.periodId == $scope.periodId) {
            obj.tuesday = $scope.todaysTotal(starters, staff);
          } else {
            obj.tuesday = scoringData[i].total_points;
          }
        } else if (scoringData[i].scoring_day == 4) {
          if (today.getDay() == 3 && $scope.periodId == $scope.periodId) {
            obj.wednesday = $scope.todaysTotal(starters, staff);
          } else {
            obj.wednesday = scoringData[i].total_points;
          }
        } else if (scoringData[i].scoring_day == 5) {
          if (today.getDay() == 4 && $scope.periodId == $scope.periodId) {
            obj.thursday = $scope.todaysTotal(starters, staff);
          } else {
            obj.thursday = scoringData[i].total_points;
          }
        } else if (scoringData[i].scoring_day == 6) {
          if (today.getDay() == 5 && $scope.periodId == $scope.periodId) {
            obj.friday = $scope.todaysTotal(starters, staff);
          } else {
            obj.friday = scoringData[i].total_points;
          }
        } else if (scoringData[i].scoring_day == 7) {
          if (today.getDay() == 6 && $scope.periodId == $scope.periodId) {
            obj.saturday = $scope.todaysTotal(starters, staff);
          } else {
            obj.saturday = scoringData[i].total_points;
          }
        } else {
          if (today.getDay() == 0 && $scope.periodId == $scope.periodId) {
            obj.sunday = $scope.todaysTotal(starters, staff);
          } else {
            obj.sunday = scoringData[i].total_points;
          }
        }
      }
      return obj;
    };

    $scope.todaysTotal = function(starters, staff) {
      if (starters != undefined && staff != undefined) {
        $scope.total = 0;
        for (var i = 0; i < starters.length; i++) {
          $scope.total += parseInt($('#' + starters[i].gameId + starters[i].player_id).text());
        };
        for (var i = 0; i < staff.length; i++) {
          $scope.total += parseInt($('#' + staff[i].gameId + staff[i].player_id).text());
        };
        return $scope.total;
      } else {
        return 0;
      }
    };

    $scope.weeklyTotal = function(scores) {
      var total = parseInt(scores.monday, 10) + parseInt(scores.tuesday, 10) + parseInt(scores.wednesday, 10) + parseInt(scores.thursday, 10) + parseInt(scores.friday, 10) + parseInt(scores.saturday, 10) + parseInt(scores.sunday, 10);
      return total;
    };

  });
