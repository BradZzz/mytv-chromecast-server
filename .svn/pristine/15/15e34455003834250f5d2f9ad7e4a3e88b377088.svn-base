var mongoose = require('mongoose');

mongoose.connect('localhost:27017/pi_server', function(err) {
    if (err){ 
    	console.log(err);
    }
    else {
    	console.log('DB success');
    }
});
//mongoose.connect('mongodb://tester:tester123@ds035137.mongolab.com:35137/trendsettr');
//'localhost:27017/buffer'

console.log(mongoose.connection);

module.exports = mongoose.connection;