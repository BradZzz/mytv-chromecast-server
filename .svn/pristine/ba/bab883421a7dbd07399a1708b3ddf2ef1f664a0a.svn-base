var mongoose = require('mongoose');

module.exports = function(){
	var models = {};
	
	models.user = mongoose.model('user', {
		user: String,
		service: String,
		birthday: String,
		gender: String,
		picture: String,
		token: String,
		token_exp: String,
		admin: Boolean
	});
	
	models.buffer_message = mongoose.model('buffer_message', {
		user: {type: String, ref: 'user'},
		message: String,
		type: String,
		payload: String
	});
	
	models.buffer_image = mongoose.model('buffer_image', {
		user: {type: String, ref: 'user'},
		message: String,
		type: String,
		payload: String
	});
	
	models.buffer_media = mongoose.model('buffer_media', {
		user: {type: String, ref: 'user'},
		type: String,
		data: String,
		payload: String
	});
	
	models.buffer_error = mongoose.model('buffer_error', {
		user: {type: String, ref: 'user'},
		asset: String,
		error: String,
		payload: String
	});
	
	return models;
};