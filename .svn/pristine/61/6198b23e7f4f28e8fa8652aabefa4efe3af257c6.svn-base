module.exports = function(db){
	
	console.log("Database");
	console.log(db);
	
	var express = require('express');
	var path = require('path');
	var favicon = require('static-favicon');
	var logger = require('morgan');
	var cookieParser = require('cookie-parser');
	var bodyParser = require('body-parser');
	var session = require ('express-session');
	var MongoStore = require('connect-mongo')(session);
	var schemas = require('./schemas/schema')();
	var routes = require('./routes')(schemas);
	var crypto = require('crypto');
	var Salt = require('./salt');
	var salt = new Salt();
	
	//var routes = require(__dirname + '/routes/index');
	
	var passport = require('./auth')(schemas);
	//var method_override = require('method-override');
	
	var FlakeIdGen = require('flake-idgen')
	, intformat = require('biguint-format')
	, generator = new FlakeIdGen;
	
	var mongo = require('mongodb');
	var monk = require('monk');
	//var db = monk('localhost:27017/buffer');
	
	var dirname = __dirname;
	
	var app = express();
	
	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.set('port', process.env.PORT || 3000);
	app.set('routes',routes);
	//app.set('run_server',routes.run_server);
	app.use(favicon());
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
	app.use(cookieParser('pi server'));
	app.use(session({
	  genid: function(req) {
	    return ""+intformat(generator.next(), 'dec'); // use UUIDs for session IDs
	  },
	  maxAge: 1*60*1000,
	  secret: 'pi server',
	  cookie: { username: "" },
	  store: new MongoStore({
		  mongoose_connection : db
		})
	}));
	
	/*app.use(express.session({
		secret : 'dridanu danu danai',
		store: new MongoStore({
			mongoose_connection: db
		})
	}) );*/
	
	app.use(passport.initialize());
	app.use(passport.session());
	app.set('session',session);
	
	app.use(logger('combined'));
	//app.use(method_override);
	app.use(express.static(path.join(__dirname, 'public')));
	
	
	//Make our db accessible to our router
	app.use(function(req,res,next){
	    req.db = db;
	    //This needs to be here for the views rendered in angular
	    req.abs_path = dirname;
	    
	    next();
	});
	
	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	    app.use(function(err, req, res, next) {
	        res.status(err.status || 500);
	        res.render('error', {
	            message: err.message,
	            error: err
	        });
	    });
	}
	
	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('error', {
	        message: err.message,
	        error: {}
	    });
	});
	
	app.run_server = function(listener){
		var server = require('socket.io').listen(listener, function() {
		  debug('Express server listening on port ' + server.address().port);
		});
		app.get('/', routes.index);
		app.get('/test', routes.test);
		app.get('/test2', routes.test2);
		app.get('/bt_test', routes.bt_test);
		app.get('/media_player', routes.media_player);
		//app.get('/test/stream_media', routes.stream_media);
		//app.get('/crawl', routes.crawl);
		//app.get('/crawlalt', routes.crawlalt);
		app.get('/foldercontents', routes.folderContents);
		app.get('/filesystem', routes.fileSystem);
		app.get('/player', routes.player);
		app.get('/popup', routes.popup);
		app.get('/popupv2', routes.popupv2);
		app.get('/index', routes.index);
		app.get('/mpl', routes.mpl);
		app.get('/facial_tracking', routes.facial_tracking);
		app.get('/player_test', routes.player_test);
		app.get('/player_test2', routes.player_test2);
		//app.get('/list', routes.ftplist);
		//app.get('/media/:path', routes.media);
		//app.post('/login', passport.authenticate('local', {
		//	failureRedirect: '/error',
		//	successRedirect: '/'
		//}) );	
	};
	
	//This makes sure http doesn't add %2B when it's supposed to add a "+"
	/*app.config(function($httpProvider) {
	  $httpProvider.interceptors.push(function($q) {
	    var realEncodeURIComponent = window.encodeURIComponent;
	    return {
	      'request': function(config) {
	         window.encodeURIComponent = function(input) {
	           return realEncodeURIComponent(input).split("%2B").join("+"); 
	         }; 
	         return config || $q.when(config);
	      },
	      'response': function(config) {
	         window.encodeURIComponent = realEncodeURIComponent;
	         return config || $q.when(config);
	      }
	    };
	  });
	});*/
	
	return app;
};
