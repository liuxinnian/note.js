
/*
 * GET home page.
 */

exports.index = function(req, res){

	var categories = require('../models/categories');

	categories.add('test_name',function(err,data){
		console.log(  (err) ? err : 'last_id:' + data._id );
	});

	// Render view
	res.render('welcome/index', {
		title: 'Welcome'
	});
};

