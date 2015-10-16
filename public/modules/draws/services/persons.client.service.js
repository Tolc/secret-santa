'use strict';

//Persons service used for communicating with the persons REST endpoints
angular.module('draws').factory('Persons', ['$resource',
	function($resource) {
		return $resource('persons/:personId', {
			personId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
