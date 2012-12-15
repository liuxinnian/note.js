
var mongoose		= require("mongoose");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var categories 		= new Schema({
	name: String,
	parentid : ObjectId
});

exports.categories = categories;
