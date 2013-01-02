
/*
 * Note Controller
 */

//default action
//默认动作
exports.index = function(req, res){

	var categories = require('../models/categories'),
		notes = require('../models/notes'),
		template = 'note/index',
		async = require('async');
	
	async.series({
	    categories: function(callback){
			var conditions = { 'parentId': null };
			categories.findCategory( conditions, function(err,result){
				callback(null, result);
			});
	    },
	    notes: function(callback){
	    	var	page = 1,
				row = 10;
			var conditions = { hidden: false};

			if( typeof(req.params.cat) !== "undefined"){
				conditions["category._id"] = req.params.cat;
			}
			notes.findNote( conditions,page,row,function(err,result){
				callback(null, result);
			});
	    },
	    common: function(callback){
	    	var common = {params:req.params};
	        callback(null, common);
	    },
	},
	//finally,render the template
	function(err, results){
		results.common.title = 'Home'; //overwrite the page title
		res.render(template, results);
	});
	
};


//action for show a note
//显示note的方法
exports.show = function(req, res){

	var notes = require('../models/notes'),
		template = 'note/show',
		async = require('async');

	async.series({
	    note: function(callback){
			var noteId = req.params.id
			var conditions = { _id: noteId, hidden: false};
			notes.findOneNote( conditions,function(err,result){
				callback(null, result);
			});
	    },
	    common: function(callback){
	    	var common = {params:req.params};
	        callback(null, common);
	    },
	},
	//finally,render the template
	function(err, results){
		results.common.title = results.note.title; //overwrite the page title
		res.render(template, results);
	});

};

