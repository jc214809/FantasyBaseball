angular.module('fantasyBaseball.pitchingStaff', [])
  .controller('pitchingStaffCtrl', function pitchingStaffController($scope, $http) {
    $scope.teamsJSON = null;
    $http.get('../FantasyBaseball/teams.json').success(function(data) {
      $scope.teamsJSON = data;
    });
    $scope.getPitchingStatLine = function(teamId) {
      for (var i = 0; i < $scope.allPitchingStaffs.length; i++) {
        if ($scope.allPitchingStaffs[i].teamID == teamId) {
          $scope.pitchingStatLine = '';
          var x = $scope.allPitchingStaffs[i];
          if (x.win > 0) {
            $scope.pitchingStatLine = ' W ,';
          };
          if (x.loss > 0) {
            $scope.pitchingStatLine = ' L ,';
          };
          if (x.out != 0) {
            var inning = parseInt(x.out) / 3;
            var inningString = inning.toString();
            var index = inningString.indexOf('.');
            if (inningString.charAt(index + 1) == 3) {;
              $scope.pitchingStatLine += ' ' + inningString.slice(0, inningString.indexOf(".")) + '.1' + ' IP ,';
            } else if (inningString.charAt(index + 1) == 6) {
              $scope.pitchingStatLine += ' ' + inningString.slice(0, inningString.indexOf(".")) + '.2' + ' IP ,';
            } else {
              $scope.pitchingStatLine += ' ' + inningString + ' IP ,';
            }
          };
          if (x.h != 0) {
            $scope.pitchingStatLine += ' ' + x.h + ' H ,';
          };
          if (x.er != 0) {
            $scope.pitchingStatLine += ' ' + x.er + ' ER ,';
          };
          if (x.bb != 0) {
            $scope.pitchingStatLine += ' ' + x.bb + ' BB ,';
          };
          if (x.so != 0) {
            $scope.pitchingStatLine += ' ' + x.so + ' K ,';
          };
          if (x.r == 0 && (x.status == 'F' || x.status == 'O')) {
            $scope.pitchingStatLine += ' 1 SHO ,';
          };

          $scope.pitchingStatLine = $scope.pitchingStatLine.substring(0, $scope.pitchingStatLine.length - 1);
          return $scope.pitchingStatLine;
        }
      };
    };
    $scope.getPitchingStaffScore = function(teamId) {
      for (var i = 0; i < $scope.allPitchingStaffs.length; i++) {
        if ($scope.allPitchingStaffs[i].teamID == teamId) {
          var pointsForHitsAndWalks = 0;
          var pointsForStrikeOuts = 0;
          var pointsForEarnedRuns = 0;
          var pointsForWin = 0;
          var x = $scope.allPitchingStaffs[i];
          if (x.win == 1) {
            pointsForWin = 3;
          }

          if (x.so < 6) {
            pointsForStrikeOuts = 0;
          } else if (x.so > 5 && x.so < 8) {
            pointsForStrikeOuts = 1;
          } else if (x.so > 7 && x.so < 10) {
            pointsForStrikeOuts = 2;
          } else if (x.so > 9 && x.so < 13) {
            pointsForStrikeOuts = 3;
          } else if (x.so > 12 && x.so < 16) {
            pointsForStrikeOuts = 5;
          } else if (x.so > 14 && x.so < 20) {
            pointsForStrikeOuts = 7;
          } else {
            pointsForStrikeOuts = 10;
          }

          if (x.er == 0) {
            pointsForEarnedRuns = 7;
          } else if (x.er == 1) {
            pointsForEarnedRuns = 5;
          } else if (x.er == 2) {
            pointsForEarnedRuns = 3;
          } else if (x.er == 3) {
            pointsForEarnedRuns = 2;
          } else if (x.er == 4) {
            pointsForEarnedRuns = 1;
          } else if (x.er > 5) {
            pointsForEarnedRuns = 0;
          }

          var walksPlusHits = parseInt(x.bb) + parseInt(x.h);

          if (walksPlusHits == 0) {
            pointsForHitsAndWalks = 20;
          } else if (walksPlusHits == 1) {
            pointsForHitsAndWalks = 16;
          } else if (walksPlusHits == 2) {
            pointsForHitsAndWalks = 12;
          } else if (walksPlusHits == 3 || walksPlusHits == 4) {
            pointsForHitsAndWalks = 8;
          } else if (walksPlusHits > 4 && walksPlusHits < 8) {
            pointsForHitsAndWalks = 4;
          } else if (walksPlusHits > 7 && walksPlusHits < 11) {
            pointsForHitsAndWalks = 2;
          } else if (walksPlusHits > 10 && walksPlusHits < 13) {
            pointsForHitsAndWalks = 1;
          } else {
            pointsForHitsAndWalks = 0;
          }
          pitchingScore = parseInt(pointsForHitsAndWalks) + parseInt(pointsForEarnedRuns) + parseInt(pointsForStrikeOuts) + parseInt(pointsForWin);
          return pitchingScore;
        }
      };
      return 0;
    };
    $scope.getTeamAbrev = function(teamId) {
      for (var i = 0; i < $scope.teamsJSON.length; i++) {
        if ($scope.teamsJSON[i].team_id = teamId) {
          // if ($scope.teamsJSON[i].teamcode.length > 1) {

          // }

          return $scope.teamsJSON[i].teamcode.value;
        }
      };
    };
  });
