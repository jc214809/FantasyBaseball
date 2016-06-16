angular.module('fantasyBasebal.utilities.matchups', [])
  .controller('MatchupsCtrl', function($scope, $http) {
    $scope.period_id = weekOfYear(new Date) - 3;;
    $scope.getLineUp = function() {
      spinner.show();
      $scope.playersGames = [];
      var lineup = $.ajax({
        url: 'http://www.mlb.com/fantasylookup/json/named.fb_team_lineup.bam?period_id=' + $scope.period_id + '&team_id=' + $scope.teamID,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          $scope.lineUp = [];
          angular.forEach(data.fb_team_lineup.queryResults.row, function(players) {
            if (players.slot_val != 'Bn' && players.slot_val != 'DL' && players.slot_val != 'PS') {
              $scope.lineUp.push(players);
            }
            if (players.slot_val == 'Bn' && players.position != 'P') {
              $scope.lineUp.push(players);
            }
          });
          $scope.$apply();
        },
        error: function() {
          alert("Error getting Lineup data. Cors-Anywhere may be down.");
          spinner.hide();
        }
      });
      //lineup.done($scope.getViewSchedule());
      //lineup.fail(alert("fail"));
      //lineup.always(alert("always"));


      //$scope.getViewSchedule = function() {
      //$scope.playersGames = [];
      //function getViewSchedule() {

      var viewSchedule = $.ajax({
        url: 'http://www.mlb.com/fantasylookup/json/named.fb_team_lineup_view_schedule.bam?period_id=' + $scope.period_id + '&team_id=' + $scope.teamID,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          $scope.viewSchedule = data;
          //Matching IDs so I have the hitters real Id
          for (var i = 0; i < $scope.lineUp.length; i++) {
            angular.forEach($scope.viewSchedule.fb_team_lineup_view_schedule.queryResults.row, function(player) {
              if ($scope.lineUp[i].league_player_id == player.league_player_id) {
                player.player_id = $scope.lineUp[i].player_id;
                player.player_name = $scope.lineUp[i].player_name;
                var d = new Date(player.game_date + "/2016");
                player.day = d.getDay();
                //player.pb = {};
                $scope.getPitcherVsBatter($scope.lineUp[i].player_id, player.opp_probable_pitcher_id);
                player.pitcherVsBatter = $scope.Joel;
                //player.pitcherVsBatter.push();
              }
            });
          };
          //removing the pitching staffs games that dont have player_id
          $scope.viewSchedule = $scope.viewSchedule.fb_team_lineup_view_schedule.queryResults.row
          for (var i = 0; i < $scope.viewSchedule.length; i++) {
            if ($scope.viewSchedule[i].hasOwnProperty('player_id')) {

              //$scope.viewSchedule[i].pitcherVsBatter = $scope.getPitcherVsBatter($scope.viewSchedule[i].player_id, $scope.viewSchedule[i].opp_probable_pitcher_id);
              $scope.playersGames.push($scope.viewSchedule[i]);
            }
          }
          //$scope.playersGames = $scope.viewSchedule;
           spinner.hide();
          $scope.$apply();
        },
        error: function() {
          alert("Error getting index Schedule data. Cors-Anywhere may be down.");
           spinner.hide();
        }
      });
      //viewSchedule.done($scope.Joel($scope.viewSchedule));
      //viewSchedule.fail(alert("fail"));
      //viewSchedule.always(alert("always"));
      // body...
      //}
      //};

      // $scope.Joel = function(data) {
      //   console.log("Joel: " + JSON.stringify(data));
      // }

      lineup.then(viewSchedule).then(function() {
        console.log(JSON.stringify($scope.viewSchedule));
      });
    };

    $scope.findPvsBData = function(id, dayOfWeek) {
      $scope.PitcherBatterData = null;
      for (var i = 0; i < $scope.playersGames.length; i++) {
        if ($scope.playersGames[i].player_id == id && $scope.playersGames[i].day == dayOfWeek) {
          $scope.PitcherBatterData = $scope.playersGames[i];
          break;
        }
      }
    }


    $scope.getPitcherVsBatter = function(hittersId, pitchersId) {
      $scope.Joel = {};
      if (hittersId != undefined && pitchersId != undefined && hittersId != '' && pitchersId != '') {
        $.ajax({
          url: 'http://m.mlb.com/lookup/json/named.stats_batter_vs_pitcher_composed.bam?league_list_id=%27mlb%27&game_type=%27R%27&player_id=' + hittersId + '&pitcher_id=' + pitchersId,
          type: 'GET',
          async: false,
          dataType: 'json',
          success: function(data) {
            $scope.Joel = data.stats_batter_vs_pitcher_composed.stats_batter_vs_pitcher_total.queryResults.row;
            //return data.stats_batter_vs_pitcher_composed.stats_batter_vs_pitcher_total.queryResults.row;
          },
          error: function() {
            alert("Error getting Pitcher vs Batter data. Cors-Anywhere may be down.");
             spinner.hide();
          }
        });
      } else {
        //return $scope.Joel;
      }

      //pitcherVsBatter.done($scope.history);
      //pitcherVsBatter.fail(alert("fail"));
      //pitcherVsBatter.always(alert("always"));
    };

  });
