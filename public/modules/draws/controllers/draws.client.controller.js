'use strict';

angular.module('draws').controller('DrawsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Draws', 'Persons',
	function($scope, $stateParams, $location, Authentication, Draws, Persons) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var draw = new Draws({
				title: this.title,
				content: this.content
			});
			draw.$save(function(response) {
				$location.path('draws/' + response._id);

				$scope.title = '';
				$scope.content = '';
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
	}
]);
