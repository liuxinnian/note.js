
/*
 * GET Article page.
 */

exports.index = function(req, res){

	var mongoose		= require("mongoose");
	var categories 		= mongoose.model("categories");

	// FindOne
	categories.findOne({ '_id': '50c49d3c881ea8aa95000001' }, function (err, result) {
	  if (err) console.log(err);
	  console.log('%s - %s', result.name,result._id) // Space Ghost is a talk show host.
	});

	res.render('article/index',{
		title: 'Article',
		cat: req.params.cat,
		id: req.params.id
	});
};

