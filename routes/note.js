
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

	var row = 10;
	var page = ( typeof(req.params.page) === "undefined") ? 1 : parseInt(req.params.page);
	var conditions = { "hidden": false};

	if( typeof(req.params.cat) !== "undefined"){
		conditions["category._id"] = req.params.cat;
	}

	async.series({
	    categories: function(callback){
			categories.findCategory( { 'parentId': null }, function(err,results){
				callback(null, results);
			});
	    },
	    notes: function(callback){
			notes.countNote(conditions, function (err, count) {
				var totalPages = Math.ceil( count / row );
				//fix page paramater: 0 > page < totalPages
				var fixedPage = page;
				if(page < 1){
					fixedPage = 1;
				}else if(page > totalPages){
					fixedPage = totalPages;
				}
				var pageNav = { "currentPage" : fixedPage, "totalPages": totalPages };
				notes.listNote( conditions,fixedPage,row,function(err,results){
					callback(null, { "results": results, "pageNav": pageNav});
				});
			});
	    },
	    common: function(callback){
	    	var common = { "title": "Home", "params":req.params};
	        callback(null, common);
	    },
	},
	//finally,render the template
	//results: {categories,notes,common}
	function(err, results){
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
			var conditions = { "_id": noteId, "hidden": false};
			notes.findOneNote( conditions,function(err,results){
				callback(null, results);
			});
	    },
	    common: function(callback){
	    	var common = { "params":req.params };
	        callback(null, common);
	    },
	},
	//finally,render the template
	function(err, results){
		results.common.title = results.note.title; //overwrite the page title
		res.render(template, results);
	});

};

