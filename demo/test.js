
var mongoose = require('mongoose');
var dsn = 'mongodb://localhost/itnote';
var db = mongoose.createConnection(dsn);


var categoriesSchema = new mongoose.Schema({
    name: String
});

var categoriesModel = db.model('categories', categoriesSchema);

var categories = new categoriesModel({ name: '数据库' })


categories.save(function (err, categories) {
	if (err) // TODO handle the error
	console.log(categories._id);
});

categoriesModel.findOne({ '_id': '50c49d3c881ea8aa95000001' }, function (err, result) {
  if (err) console.log(err);
  console.log('%s - %s', result.name,result._id) // Space Ghost is a talk show host.
});
