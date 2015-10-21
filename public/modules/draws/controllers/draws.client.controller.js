'use strict';

angular.module('draws').controller('DrawsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Draws', 'Persons',
	function($scope, $http, $stateParams, $location, Authentication, Draws, Persons) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var draw = new Draws({
                title: this.title
            });
			draw.$save(function(response) {
				$location.path('draws/' + response._id);
                $scope.title = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(draw) {
			if (draw) {
				draw.$remove();

				for (var i in $scope.draws) {
					if ($scope.draws[i] === draw) {
						$scope.draws.splice(i, 1);
					}
				}
			} else {
				$scope.draw.$remove(function() {
					$location.path('draws');
				});
			}
		};

		$scope.update = function() {
			var draw = $scope.draw;

			draw.$update(function() {
				$location.path('draws/' + draw._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.draws = Draws.query();
		};

		$scope.findOne = function() {
			$scope.draw = Draws.get({
				drawId: $stateParams.drawId
			});
		};

        $scope.addParticipant = function() {
            $http.post('/draws/' + $scope.draw._id + '/add-participant', {
                name: $scope.name,
                email: $scope.email
            }).success(function(response) {
                $scope.draw = response.draw;
                $scope.name = '';
                $scope.email = '';
            }).error(function(response) {
            });
        };

		$scope.iterate = function() {
			$http.post('/draws/' + $scope.draw._id + '/iterate', {}).success(function(response) {
				$scope.draw = response.draw;
				console.log($scope.draw);
			}).error(function(response) {
			});
		};

		$scope.addChild = function() {
			$http.post('/persons/' + $scope.parentId + '/add-child', {
				childId: $scope.childId
			}).success(function(response) {
				console.log(response.child);
				$scope.childId = '';
				$scope.parentId = '';
			}).error(function(response) {
				console.log(response);
			});
		};

		$scope.addMarriage = function() {
			$http.post('/persons/' + $scope.marriageFirst + '/add-marriage', {
				marriageLast: $scope.marriageLast
			}).success(function(response) {
				console.log(response.child);
				$scope.marriageFirst = '';
				$scope.marriageLast = '';
			}).error(function(response) {
				console.log(response);
			});
		};

        $scope.sendMail = function(iteration) {
            $http.post('/iterations/' + iteration._id + '/sendMail', {}).success(function(response) {
                console.log(response);
            }).error(function(response) {
                console.log(response);
            });
        };

        $scope.showIteration = function(iteration) {
            iteration.show = !iteration.show;
        };
	}
]);
