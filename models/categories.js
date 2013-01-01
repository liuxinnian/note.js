/**
 * The categories model
 */

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var categoriesSchema = new Schema({
    categoryName: String,
    parentId: ObjectId,
    child: [ { _id: ObjectId, categoryName: String } ]
});

var categoriesModel = mongoose.model('categories', categoriesSchema);


/**
 * add a new category
 * 添加一个新分类
 * @access private
 * @param {object}   item
 * @param {Function} callback
 * @return {object} 
 */
var _addCategory = function(category,callback) {

	var item = new categoriesModel({
						categoryName: category.categoryName,
						parentId: category.parentId
					});
	item.save(function (err, result) {
		if(err) return callback(err);
		callback(null,result);
	}); 
};

/**
 * add child for category
 * 为category添加子分类
 * @access private 
 * @param {object}   category
 * @param {Function} callback
 * @return {object} 
 */
var _addChild = function(category,callback){

	categoriesModel.update(
		{ _id: category.parentId },
		{ $push: { child : { _id:category._id, categoryName: category.categoryName  } } },
		{ safe: true },
		function (err, numberAffected, raw) {
			if(err) return callback(err);
			callback(null, { 'child': category , 'numberAffected': numberAffected , 'raw': raw });
		}
	);
}

/**
 * remove a category
 * 删除一个分类
 * @param  {object}   category
 * @param  {Function} callback
 * @return {object} 
 */
var _removeCategory = function(category,callback) {

	categoriesModel.remove({ _id: category._id }, function (err) {
	  if (err) return callback(err);
	  callback(null,category);
	});
};

/**
 * remove the category from parent
 * 在父分类中删除分类
 * @param  {object}   category
 * @param  {Function} callback
 * @return {object} 
 */
var _removeChild = function(category,callback) {

	categoriesModel.update(
		{ _id: category.parentId },
		{ $pull: { child : { _id: category._id } } },
		{ safe: true },
		function (err, numberAffected, raw) {
			if(err) return callback(err);
			callback(null, { 'child': category , 'numberAffected': numberAffected , 'raw': raw });
		}
	);
};


var async = require('async');

/**
 * add a new category and update parent
 * 添加分类并更新父分类
 * @param  {object}   item
 * @param  {Function} callback
 * @return {object} 
 */
exports.addCategory = function(category,callback){

	async.waterfall(
	    [
	        function(callback) {
				_addCategory(category,function(err,childCategory){
					if(err) return callback(err);
					callback(null, childCategory);
				});
	        },
	        function(childCategory,callback) {
	        	_addChild(childCategory,function(err,result){
	        		if(err) return callback(err);
	        		callback(null, result);
	        	});
	        }
	    ],
	    function (err, result) {
	    	if(err) return callback(err);
	        callback(null, result);
	    }
	);
	return this;
}; 

/**
 * remove a category and update parent
 * 删除分类并更新父分类
 * @param  {object}   category
 * @param  {Function} callback
 * @return {object} 
 */
exports.removeCategory = function(category,callback){

	async.waterfall(
	    [
	        function(callback) {
				_removeCategory(category,function(err,childCategory){
					if(err) return callback(err);
					callback(null, childCategory);
				});
	        },
	        function(childCategory,callback) {
	        	_removeChild(childCategory,function(err,result){
	        		if(err) return callback(err);
	        		callback(null, result);
	        	});
	        }
	    ],
	    function (err, result) {
	    	if(err) return callback(err);
	        callback(null, result);
	    }
	);
	return this;
}; 

/**
 * find categories
 * 查找分类数据
 * @param  {object}   conditions 
 * @param  {Function} callback
 * @return {object}
 */
exports.findCategory = function(conditions,callback){

	categoriesModel.find(conditions).lean().exec(function (err, result) {
		if(err) return callback(err);
		callback(null,result);
	});
	return this;
};

