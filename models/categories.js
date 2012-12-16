
var settings = require('../settings');

var mongoose = require('mongoose'),
	dsn = 'mongodb://' + settings.db.host +  '/' + settings.db.name,
	db = mongoose.createConnection(dsn);

var categoriesSchema = new mongoose.Schema({
    name: String
});

var categoriesModel = db.model('categories', categoriesSchema);


exports.add = function(category_name,callback) {

	var category = new categoriesModel({ name: category_name });

	category.save(function (err, category) {
		(err) ? callback(err) : callback(err,category);
	 }); 

};