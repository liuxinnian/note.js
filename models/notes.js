/**
 * The categories model
 */

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var notesSchema = new Schema({
	title: 	String,
	body:   String,
	date: 	{ type: Date, default: Date.now },	
	hidden: { type: Boolean, default: false },
	author: {
		_id: ObjectId, 
		authorName: String 
	},
	category: {
		_id: ObjectId,
		categoryName: String
	}
});

var notesModel = mongoose.model('notes', notesSchema);

/**
 * find notes
 * 查找笔记
 * @param  {object}   conditions 
 * @param  {Function} callback
 * @return {object}
 */
exports.listNote = function(conditions,page,row,callback){

	var skip = (page -1) * row;

	notesModel.find(conditions).skip(skip).limit(row).lean().exec(function (err, result) {
		if(err) return callback(err);
		callback(null,result);
	});
	return this;
};

/**
 * find notes
 * 查找笔记
 * @param  {object}   conditions 
 * @param  {Function} callback
 * @return {object}
 */
exports.countNote = function(conditions,callback){
	
	notesModel.count(conditions).exec(function (err, result) {
		if(err) return callback(err);
		callback(null,result);
	});
	return this;
};

/**
 * find notes
 * 查找笔记
 * @param  {object}   conditions 
 * @param  {Function} callback
 * @return {object}
 */
exports.findOneNote = function(conditions,callback){

	notesModel.findOne(conditions).lean().exec(function (err, result) {
		if(err) return callback(err);
		callback(null,result);
	});
	return this;
};

/**
 * add a new category
 * 添加一个新分类
 * @access private
 * @param {object}   item
 * @param {Function} callback
 * @return {object} 
 */
exports.addNote = function(note,callback) {
	var item = new notesModel(note);
	item.category = note.category; //is this so? no idea about: http://mongoosejs.com/docs/subdocs.html
	item.author = note.author; //is this so?
	item.save(function (err, result) {
		if(err) return callback(err);
		callback(null,result);
	}); 
};