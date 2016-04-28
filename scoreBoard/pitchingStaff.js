angular.module('fantasyBaseball.pitchingStaff', [])
  .controller('pitchingStaffCtrl', function pitchingStaffController($scope, $http) {
    $scope.teamsJSON = null;
    $http.get('../FantasyBaseball/teams.json').success(function(data) {
      $scope.teamsJSON = data;
    });
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
