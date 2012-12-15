
/*
 * GET home page.
 */

exports.index = function(req, res){

	var mongoose		= require("mongoose");
	var categories 		= mongoose.model("categories");

	// Insert
	var category = new categories({ name: '一个新分类' })
	category.save(function (err, category) {
		if (err) console.log(err);
		console.log( 'last_id : ' + category._id + ' insert succeed!');
	});

	// Render view
	res.render('welcome/index', {
		title: 'Welcome'
	});
};

