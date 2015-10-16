'use strict';

// Setting up route
angular.module('draws').config(['$stateProvider',
	function($stateProvider) {
		// Draws state routing
		$stateProvider.
		state('listDraws', {
			url: '/draws',
			templateUrl: 'modules/draws/views/list-draws.client.view.html'
		}).
		state('createDraw', {
			url: '/draws/create',
			templateUrl: 'modules/draws/views/create-draw.client.view.html'
		}).
		state('viewDraw', {
			url: '/draws/:drawId',
			templateUrl: 'modules/draws/views/view-draw.client.view.html'
		});
		//state('editDraw', {
		//	url: '/draws/:drawId/edit',
		//	templateUrl: 'modules/draws/views/edit-draw.client.view.html'
		//});
	}
]);
