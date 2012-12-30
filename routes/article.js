
/*
 * GET Article page.
 */

exports.index = function(req, res){

	var mongoose		= require("mongoose");
	var categories 		= require('../models/categories');

	res.render('article/index',{
		title: 'Article',
		cat: req.params.cat,
		id: req.params.id
	});
};

