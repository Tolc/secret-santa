'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DrawItem Schema
 */
var DrawItemSchema = new Schema({
	fromUser: {
        type: Schema.ObjectId,
        ref: 'Person'
    },
    toUser: {
        type: Schema.ObjectId,
        ref: 'Person'
    }
});

mongoose.model('DrawItem', DrawItemSchema);
