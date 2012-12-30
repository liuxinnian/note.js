
/*
 * GET home page.
 */

exports.index = function(req, res){

	var categories = require('../models/categories');

	// Render view
	res.render('welcome/index', {
		title: 'Welcome'
	});
};

