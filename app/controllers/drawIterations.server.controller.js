'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	DrawIteration = mongoose.model('DrawIteration'),
	DrawItem = mongoose.model('DrawItem'),
	Person = mongoose.model('Person'),
	nodemailer = require('nodemailer'),
	_ = require('lodash');

/**
 * Create a drawIteration
 */
exports.create = function(req, res) {
	var drawIteration = new DrawIteration(req.body);
	drawIteration.user = req.user;

	drawIteration.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(drawIteration);
		}
	});
};

/**
 * Show the current drawIteration
 */
exports.read = function(req, res) {
	res.json(req.drawIteration);
};

/**
 * Update a drawIteration
 */
exports.update = function(req, res) {
	var drawIteration = req.drawIteration;

	drawIteration = _.extend(drawIteration, req.body);

	drawIteration.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(drawIteration);
		}
	});
};

/**
 * Delete an drawIteration
 */
exports.delete = function(req, res) {
	var drawIteration = req.drawIteration;

	drawIteration.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(drawIteration);
		}
	});
};

/**
 * List of DrawIterations
 */
exports.list = function(req, res) {
	DrawIteration.find().sort('-created').populate('user', 'displayName').exec(function(err, drawIterations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(drawIterations);
		}
	});
};

/**
 * DrawIteration middleware
 */
exports.drawIterationByID = function(req, res, next, id) {
	DrawIteration.findById(id).populate('items').exec(function(err, drawIteration) {
		if (err) return next(err);
		if (!drawIteration) return next(new Error('Failed to load drawIteration ' + id));

        Person.populate(drawIteration, {
            path: 'items.fromUser'
        }, function (err, drawIteration) {
            if (err) {
                return next(new Error('Failed to load DrawIteration ' + id));
            } else {
                Person.populate(drawIteration, {
                    path: 'items.toUser'
                }, function (err, drawIteration) {
                    if (err) {
                        return next(new Error('Failed to load DrawIteration ' + id));
                    } else {
                        req.drawIteration = drawIteration;
                        next();
                    }
                });
            }
        });

	});
};

/**
 * DrawIteration authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.drawIteration.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};


// update with your gmail information
// you may have to update your gmail settings
var gmTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        user: 'thomas.coquel117@gmail.com',
        pass: '*****'
    }
});

exports.sendMail = function(req, res) {
    var iteration = req.drawIteration;

    console.log('Trying to send mail for iteration [' + iteration._id + ']');

    var mailCallback = function (error, response) {
        if (error) {
            console.log(error);
            errors++;
        } else {
            console.log('Message sent: ' + response.message);
            oks++;
        }
    };

    for (var i = 0; i < iteration.items.length; i++ ) {
        var item = iteration.items[i];

        var mailOptions = {
            from: 'noreply@secret-santa.fr',
            to: item.fromUser.email,
            subject: 'Tirage au sort de Noël: [' + item.fromUser.name + ']',
            html: 'Voici à qui tu dois offrir un cadeau : <strong>' + item.toUser.name + '</strong>' +
            '<br/><br/>Bon courage dans ta recherche du cadeau parfait !'
        };


        gmTransport.sendMail(mailOptions, mailCallback);
    }

    res.status(200).send({});
};


