'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    personHandler = require('./persons.server.controller.js'),
	Draw = mongoose.model('Draw'),
	Person = mongoose.model('Person'),
	_ = require('lodash');

/**
 * Create a draw
 */
exports.create = function(req, res) {
	var draw = new Draw(req.body);
	draw.user = req.user;

	draw.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(draw);
		}
	});
};

/**
 * Show the current draw
 */
exports.read = function(req, res) {
	res.json(req.draw);
};

/**
 * Update a draw
 */
exports.update = function(req, res) {
	var draw = req.draw;

	draw = _.extend(draw, req.body);

	draw.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(draw);
		}
	});
};

/**
 * Delete an draw
 */
exports.delete = function(req, res) {
	var draw = req.draw;

	draw.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(draw);
		}
	});
};

/**
 * List of Draws
 */
exports.list = function(req, res) {
	Draw.find().sort('-created').populate('user', 'displayName').exec(function(err, draws) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(draws);
		}
	});
};

/**
 * Draw middleware
 */
exports.drawByID = function(req, res, next, id) {
	Draw.findById(id).populate('participants').exec(function(err, draw) {
		if (err) return next(err);
		if (!draw) return next(new Error('Failed to load draw ' + id));
		req.draw = draw;
		next();
	});
};

/**
 * Draw authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.draw.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

/**
 * Add Participant to Draw
 */
exports.addParticipant = function(req, res) {
    var draw = req.draw;
    var name = req.body.name;
    var email = req.body.email;

    personHandler.createByName(name, email, function(newPerson) {
        if (newPerson) {
            draw.participants.push({_id: newPerson._id});
            draw.save(function (err) {
                if (err) {
                    res.status(500).send({message: errorHandler.getErrorMessage(err)});
                } else {
                    res.status(200).send({
                        message: 'Participant ajouté',
                        draw: draw
                    });
                }
            });
        } else {
            res.status(500).send({message: 'Erreur durant ajout de participant'});
        }
    });
};
