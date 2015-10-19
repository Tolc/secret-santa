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
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    created: {
        type: Date,
        default: Date.now
    },
    participants: [{
        type: Schema.ObjectId,
        ref: 'Person'
    }],
    iterations: [{
        type: Schema.ObjectId,
        ref: 'DrawIteration'
    }]
});

mongoose.model('Draw', DrawSchema);
