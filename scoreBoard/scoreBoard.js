   jQuery.ajaxPrefilter(function(options) {
     if (options.crossDomain && jQuery.support.cors) {
       options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
     }
   });

   angular.module('fantasyBaseball.scoreboard', [])
     .controller('ScoreBoardCtrl', function ScoreboardController($scope, $http, $q) {
       $scope.periodId = 11;
       $scope.teamID = 85827;
       $.ajax({
         url: 'http://www.mlb.com/fantasylookup/json/named.fb_team_lineup.bam?period_id=' + $scope.periodId + '&team_id=' + $scope.teamID,
         type: 'GET',
         dataType: 'json',
         error: function() {
           alert("Error");
         },
         success: function(data) {
           $scope.startingPlayers = [];
           $scope.benchPlayers = [];
           $scope.pitchingStaff = 'lan';
           angular.forEach(data.fb_team_lineup.queryResults.row, function(player) {
             if (player.slot_val != 'Bn' && player.slot_val != 'DL' && player.slot_val != 'PS') {
               $scope.startingPlayers.push(player);
             }
             if (player.slot_val == 'Bn') {
               $scope.benchPlayers.push(player);
             }
           });
           $scope.$apply();
         }
       });
       $scope.allGames = [];
       $scope.gameURLs = [];
       $scope.boxscores = null;
       $scope.boxscores2 = null;
       $scope.scoreBoard = 'http://gd2.mlb.com/components/game/mlb/year_' + "2016" + '/month_' + "04" + '/day_' + "06" + '/master_scoreboard.json';
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
       $scope.hittingStats = function(playerID) {
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
             //return $scope.allGames[i];
           }
         };
       };
     });
