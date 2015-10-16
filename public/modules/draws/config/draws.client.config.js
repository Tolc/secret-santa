'use strict';

// Configuring the Articles module
angular.module('draws').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tirages', 'draws', 'dropdown', '/draws(/create)?');
		Menus.addSubMenuItem('topbar', 'draws', 'Liste des tirages', 'draws');
		Menus.addSubMenuItem('topbar', 'draws', 'Nouveau tirage', 'draws/create');
	}
]);
