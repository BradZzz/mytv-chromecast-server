module.exports = function(schemas){
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
	var users = schemas.user;
	var _ = require('underscore');
	
	passport.use(new LocalStrategy({
			passReqToCallback: true,
		    usernameField: 'user',
		    passwordField: 'service'
	    }, function(req, user, service, done){
	    	
	    	//console.log(req.headers.json);
	    	//var header = JSON.parse(req.headers.json);
	    	
	    	var new_user = {
				user : user,
				service : service,
				birthday: "",
				gender: "",
				picture: ""
			};
	    	
	    	console.log("Checking User");
	    	console.log(new_user);
	    	
			if(!user || !service){
				if (req.session.passport.user === undefined){
					res.status(401).json({status: 'not logged in'});
					return done(null, false);
				} else {
					return done(null, req.session.passport.user);
				}
			} else {
				users.findOne({user: user, service: service})
				.exec(function(err, user){ 
					console.log(err);
					console.log(user);
					if(err){
						res.json({status: 'error', message: 'database access error'});
						return null;
					} else if(user && user.user){
						
						/*if(!user.gender && header["gender"]){
							user.gender = header["gender"];
						}
					
						if(!user.birthday && header["birthday"]){
							user.birthday = new Date(header["birthday"]).getTime();
						}
						
						if(header["picture"] && 0 != header["picture"].length){
							user.picture = header["picture"];
						}*/
						
						users.find()
						.exec(function(err, users){
							_.each(users, function(userFound, idx){
								if(userFound.user === user.user){
									user.save();
									return done(null, user); 
								}
							});
						});
					} else {
						console.log('no users found!');
						if(!err && (user === null || !user.length)){
							var user = new users(new_user);
							user.save(function(err){
								if (err){
									console.log(err);
									return done(null, false);
									//res.status(500).json({status: 'fail'});
								} else {
									console.log('New user created!');
									console.log(user);
									return done(null, user); 
									//res.json({status: 'success'});
								}
							});
						}else{
							return done(null, false);
						}
					}
				});
			}
		}
	));

	passport.serializeUser(function(user, done){
		done(null, user.user);
	});

	passport.deserializeUser(function(user, done){
		done(null, {user: user});
	});
	
	return passport;
}	
	
