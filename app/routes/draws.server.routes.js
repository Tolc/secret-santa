'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	draws = require('../../app/controllers/draws.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/draws')
		.get(draws.list)
		.post(users.requiresLogin, draws.create);

	app.route('/draws/:drawId')
		.get(draws.read)
		.put(users.requiresLogin, draws.hasAuthorization, draws.update)
		.delete(users.requiresLogin, draws.hasAuthorization, draws.delete);

    app.route('/draws/:drawId/add-participant')
        .post(users.requiresLogin, draws.addParticipant);

	// Finish by binding the article middleware
	app.param('drawId', draws.drawByID);
};
