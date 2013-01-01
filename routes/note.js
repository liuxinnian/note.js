
/*
 * Note Controller
 */

//default action
//默认动作
exports.index = function(req, res){

	var categories = require('../models/categories'),
		template = 'note/index',
		async = require('async');
	
	async.series({
	    categories: function(callback){
			var conditions = { 'parentId': null };
			categories.findCategory( conditions, function(err,result){
				callback(null, result);
			});
	    },
	    title: function(callback){
	        callback(null, 'Home');
	    },
	},
	// render the template
	function(err, results){
		res.render(template, results);
	});
	
};


//action for show a note
//显示note的方法
exports.show = function(req, res){

	res.render('note/show',{
		title: 'Note',
		cat: req.params.cat,
		id: req.params.id
	});
};

