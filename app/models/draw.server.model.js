'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Draw Schema
 */
var DrawSchema = new Schema({
    participants: [{
        type: Schema.ObjectId,
        ref: 'Person'
    }],
    items: [{
        type: Schema.ObjectId,
        ref: 'DrawIteration'
    }]
});

mongoose.model('Draw', DrawSchema);
