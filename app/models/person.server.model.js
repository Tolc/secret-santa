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
	},
	marriedTo: {
		type: Schema.ObjectId,
		ref: 'Person'
	},
	children: [{
		type: Schema.ObjectId,
		ref: 'Person'
	}]
});

mongoose.model('Person', PersonSchema);
