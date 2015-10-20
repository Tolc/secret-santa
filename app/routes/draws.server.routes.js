'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	draws = require('../../app/controllers/draws.server.controller'),
	persons = require('../../app/controllers/persons.server.controller');

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

	app.route('/draws/:drawId/iterate')
		.post(users.requiresLogin, draws.iterate);

	// Finish by binding the article middleware
	app.param('drawId', draws.drawByID);

	app.route('/persons/:personId/add-child')
		.post(users.requiresLogin, persons.addChild);

	app.route('/persons/:personId/add-marriage')
		.post(users.requiresLogin, persons.addMarriage);

	app.param('personId', persons.personByID);


};
