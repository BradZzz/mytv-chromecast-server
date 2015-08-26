function Salt() {
	this.symbol_array = [];
	for(var idx = 0; idx < 10; ++idx){
		this.symbol_array.push(String.fromCharCode('0' + idx));
	}
	for(idx = 10; idx < 36; ++idx){
		this.symbol_array.push(String.fromCharCode('a' + idx - 10));
	}
};

Salt.prototype.random_string = function(string_length){
	var buf = [];

	for (var idx = 0; idx <= string_length; idx++){
		buf.push(this.symbol_array[Math.floor((Math.random() * string_length) + 1)]);
	}
	
	return buf;
};

module.exports = Salt;