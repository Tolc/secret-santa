'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Person = mongoose.model('Person'),
	_ = require('lodash');

/**
 * Create a person
 */
exports.create = function(req, res) {
	var person = new Person(req.body);
	person.user = req.user;

	person.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(person);
		}
	});
};

/**
 * Show the current person
 */
exports.read = function(req, res) {
	res.json(req.person);
};

/**
 * Update a person
 */
exports.update = function(req, res) {
	var person = req.person;

	person = _.extend(person, req.body);

	person.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(person);
		}
	});
};

/**
 * Delete an person
 */
exports.delete = function(req, res) {
	var person = req.person;

	person.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(person);
		}
	});
};

/**
 * List of Persons
 */
exports.list = function(req, res) {
	Person.find().sort('-created').populate('user', 'displayName').exec(function(err, persons) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(persons);
		}
	});
};

/**
 * Person middleware
 */
exports.personByID = function(req, res, next, id) {
	Person.findById(id).populate('children').populate('marriedTo').exec(function(err, person) {
		if (err) return next(err);
		if (!person) return next(new Error('Failed to load person ' + id));
		req.person = person;
		next();
	});
};

/**
 * Person authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.person.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};


/**
 * Creates a Person
 */
exports.createByName = function(name, email, callback) {
    var newPerson = new Person({
        name: name,
        email: email
    });
    newPerson.save(function(err) {
        if (err) {
            callback(undefined);
        } else {
            callback(newPerson);
        }
    });
};


exports.addChild = function(req, res) {
	var person = req.person;
	var childId = req.body.childId;

	person.children.push({_id: childId});
	person.save(function(err) {
		if (err) {
			res.status(500).send({message: 'Erreur durant sauvegarde personne'});
		} else {
			Person.findById(childId).populate('children').populate('marriedTo').exec(function(err, personDb) {
				if (err) {
					res.status(500).send({message: 'Erreur personne ' + childId});
				} else {
					res.status(200).send({child: personDb});
				}
			});
		}
	});
};

exports.addMarriage = function(req, res) {
	var person = req.person;
	var secondId = req.body.marriageLast;

	Person.findById(secondId).populate('children').populate('marriedTo').exec(function(err, personDb) {
		if (err) {
			res.status(500).send({message: 'Erreur personne ' + secondId});
		} else {
			person.marriedTo = personDb;
			personDb.marriedTo = person;
			person.save(function(err) {
				if (err) {
					res.status(500).send({message: 'Erreur durant sauvegarde personne'});
				} else {
					personDb.save(function(err) {
						if (err) {
							res.status(500).send({message: 'Erreur durant sauvegarde personne'});
						} else {
							res.status(200).send({});
						}
					});
				}
			});
		}
	});


};