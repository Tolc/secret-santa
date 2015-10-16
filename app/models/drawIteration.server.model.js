'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * DrawIteration Schema
 */
var DrawIterationSchema = new Schema({
    items: [{
        type: Schema.ObjectId,
        ref: 'DrawItem'
    }]
});

mongoose.model('DrawIteration', DrawIterationSchema);
