'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Person Schema
 */
var PersonSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	email: {
		type: String,
		default: '',
		trim: true,
        required: 'Email cannot be blank'
	}
});

mongoose.model('Person', PersonSchema);
