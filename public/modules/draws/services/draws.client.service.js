'use strict';

//Draws service used for communicating with the draws REST endpoints
angular.module('draws').factory('Draws', ['$resource',
	function($resource) {
		return $resource('draws/:drawId', {
			drawId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
