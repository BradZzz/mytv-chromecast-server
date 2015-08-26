#!/usr/bin/env node

//Remember to always uglify your client-side code before putting it on the interwebs!

module.exports = function(schemas){
	var express = require('express');
	var router = express.Router();
	var _ = require('underscore');
	var Client = require('ftp');
	
	router.index = function(req, res){
		res.sendfile(req.abs_path + '/views/promojis.html')
	};
	
	router.bt_test = function(req, res){
		res.sendfile(req.abs_path + '/views/btapp_test.html');
	};
	
	 router.player_test = function(req, res){
	    res.sendfile(req.abs_path + '/views/player_test.html');
	  };
	  
	  router.player_test2 = function(req, res){
      res.sendfile(req.abs_path + '/views/player_test2.html');
    };
	
	router.media_player = function(req,res) {
		var WebTorrent = require('webtorrent')
		var client = new WebTorrent()
		var magnetUri = 'magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36'
		client.add(magnetUri, function (torrent) {
		  // Got torrent metadata!
		  console.log('Torrent info hash:', torrent.infoHash)
		  // Let's say the first file is a webm (vp8) or mp4 (h264) video...
		  var file = torrent.files[0]
		  // Create a video element
		  var video = document.createElement('video')
		  video.controls = true
		  document.body.appendChild(video)
		  // Stream the video into the video tag
		  file.createReadStream().pipe(video)
		})
		res.sendfile(req.abs_path + '/views/media_player.html');
	}
	
	router.test = function(req, res){
		res.sendfile(req.abs_path + '/views/media_source_test.html');
	};
	
	function loop_folder(prefix) {
		var AWS = require('aws-sdk')
		var s3 = new AWS.S3()
		var delimiter = '/'
		var Q = require('q')
		var deferred = Q.defer();
			
		s3.listObjects({ Bucket: 'mytv.media.out.video', MaxKeys: 10000, Prefix: prefix, Delimiter: delimiter }, function(err, data) {
			var folders = []
			if (err) {
				console.log(err, err.stack)
				deferred.reject(err);
			}
		  for (var prefix in data.CommonPrefixes ) {
		  	folders.push(data.CommonPrefixes[prefix].Prefix)
		  }
		  deferred.resolve(folders)
		});
		return deferred.promise
	}
	
	router.folderContents = function(req, res) {
		var root = req.query.root
		if (root) {
			var Q = require('q')
			var media = {}
			loop_folder(root).then(function(results){
				console.log(results);
				res.json(results)
			})
		}
	}
	
	router.fileSystem = function(req, res) {
		var root = req.query.root
		if (root) {
			var Q = require('q')
			var media = {}
			loop_folder(root).then(function(results){
				var promises = []
				for (var result in results ) {
					promises.push(loop_folder(results[result]))
				}
				Q.all(promises).then(function(results) {
					var returnValue = {}
					for (var result in results) {
						if (results[result].length > 0) {
							var show = results[result][0].split('/')
							returnValue[show[1]] = results[result]
						}
					}
					res.json(returnValue)
				});
			})
		}
	}
	
	router.index = function(req, res){
		res.sendfile(req.abs_path + '/views/index.html');
	};
	
	router.mpl = function(req, res){
		res.sendfile(req.abs_path + '/views/mpl.html');
	};
	
	/*function checkSuffix(filename){
		var media_header_conversion = {
			'avi':'video/avi',
	 		'mpeg':'video/mpeg',
	 		'mp4':'video/mp4',
	 		'ogg':'video/ogg',
	 		'mov':'video/quicktime',
	 		'webm':'video/webm',
	 		'mkv':'video/x-matroska',
	 		'wmv':'video/x-ms-wmv',
	 		'flv':'video/x-flv',
		}
		
		var suffix = filename.substring(filename.lastIndexOf(".")+1)
		if(suffix in media_header_conversion){
			return { name:filename, header:media_header_conversion[suffix] }
		}else{
			return { name:filename, header:false }
		}
	}*/
	
	router.test2 = function(req, res){

		var test_magnet = "magnet:?xt=urn:btih:6A03D75FA2F258DA2DBFD0B848447DF5BE3993C3"
		var tracker_servers = [
		                   		"&tr=udp%3a%2f%2fexplodie.org%3a6969%2fannounce",
		                   		"&tr=udp%3a%2f%2fcoppersurfer.tk%3a6969%2fannounce",
		                   		"&tr=udp%3a%2f%2ftracker.prq.to%2fannounce",
		                   		"&tr=udp%3a%2f%2ftracker.token.ro%3a80%2fannounce",
		                   		"&tr=udp%3a%2f%2ftracker.leechers-paradise.org%3a6969%2fannounce",
		                   		"&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce",
		                   		"&tr=udp%3a%2f%2fipv4.tracker.harry.lu%3a80%2fannounce"
		                   	]
		
		for (server in tracker_servers){
			test_magnet += tracker_servers[server]
		}
		
		var webTorrent = require('webtorrent')
		var fileSystem = require('fs')

		var client = new webTorrent()

		client.add(test_magnet, function (torrent) {
		  // Got torrent metadata!
		  console.log('Torrent info hash:', torrent.infoHash)

		  // Let's say the first file is a webm (vp8) or mp4 (h264) video...
		  var maxFile = 0
		  var mediaFile
		  for(var file in torrent.files){
		  	var headerData = checkSuffix(torrent.files[file].name)
		  	if(maxFile <= torrent.files[file].length && headerData.header){
		  		console.log('New match')
		  		maxFile = torrent.files[file].length
		  		mediaFile = torrent.files[file]
		  	}
		  }
		  
		  console.log('File data')
		  console.log(mediaFile)
		  
		  res.writeHead(200, {
        'Content-Type': 'audio/mpeg', 
        'Content-Length': mediaFile.length
	    })
	    
	    var readStream = fileSystem.createReadStream(mediaFile)
	    // We replaced all the event handlers with a simple call to util.pump()
	    util.pump(readStream, res)

		  //Need to return file here
		  //Do rest of the work on the client side
		  
		  
		  // Create a video element
		  //var video = document.createElement('video')
		  //video.controls = true
		  //document.body.appendChild(video)

		  // Stream the video into the video tag
		  //file.createReadStream().pipe(video)
		})
		
		res.send("Test completed");
	};
	
	router.player = function(req, res){
		res.sendfile(req.abs_path + '/views/media_player.html');
	};
	
	router.facial_tracking = function(req, res){
    res.sendfile(req.abs_path + '/views/facial_tracking.html');
  };
	
	router.popup = function(req, res){
		res.sendfile(req.abs_path + '/views/popup_player.html');
	};
	
	router.popupv2 = function(req, res){
    res.sendfile(req.abs_path + '/views/popup_playerv2.html');
  };
	
	/*router.crawl = function(req, res){
		res.sendfile(req.abs_path + '/views/crawler_test.html');
	};
	
	router.crawlalt = function(req, res){
		res.sendfile(req.abs_path + '/views/mediaStreaming/index.html');
	};
	
	router.stream_media = function(req, res){
		var BinaryServer = require('binaryjs').BinaryServer;
		var fs = require('fs');
		var Client = require('ftp');
		var path = "ftp://69.122.11.113:2000/USB_Storage/TV/Arrow/Arrow.S01E01.HDTV.XviD-AFG.avi"
		
		  var c = new Client();
		  c.on('ready', function() {
			  var file = fs.createReadStream(path);
			  client.send(file); 
		    c.get(path, function(err, stream) {
		      if (err) throw err;
		      stream.once('close', function() { c.end(); });
		      stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
		    });
		  });
		  // connect to localhost:21 as anonymous
		  c.connect();
		
		var server = BinaryServer({port: 9000});
		server.on('connection', function(client){   
		  var file = fs.createReadStream(path);
		  client.send(file); 
		});
		
		res.send("Created!");
	};*/
	
	//router.media = function(req, res){
	//	console.log(req)
		/*<video width="320" height="240" controls>
		  <source src="ftp://69.122.11.113:2000/shares/" type="video/mp4">
		  <source src="movie.ogg" type="video/ogg">
		Your browser does not support the video tag.
		</video>
		res.send();*/
	//};
	
	/*router.ftplist = function(req, res){
		  var initial_list = JSON.parse(req.query.list)
		  console.log(initial_list)
		  var directoryList = [];
		  var fileList = [];
		  var c = new Client();
		  var call_count = 0;
		  var calls = initial_list.length;
		  c.on('ready', function() {
			var check_calls = function(){
				  call_count++;
				  if(call_count>=calls){
					  call_count = 0;
					  c.end();
					  console.log(fileList);
					  console.log(directoryList);
					  var composite = directoryList.concat(fileList);
					  console.log(composite);
					  res.json(composite);
				  }
			}
			var iterate_list = function(root_list){
				for(var item in root_list){
					retrieve_list(root_list[item])
				}
			}
				var retrieve_list = function(list_item){
					list_item = list_item.substr(-1) === '/' ? list_item : list_item + '/'
					c.list(list_item,function(err, list) {
					      if (err) throw err;
					      for(var file in list){
					    	  var fileString = list[file].name;
					    	  if(list[file].type === 'd'){
					    		  //console.log('Directory')
					    		  //console.log(initial_list[item] + fileString + '/')
					    		  directoryList.push(list_item + fileString + '/')
					    	  }else{
					    		  //console.log('File')
					    		  //console.log(initial_list[item] + fileString + '/')
					    		  fileList.push(list_item + fileString);
					    	  }
					      }
					      check_calls();
					});
				}
			iterate_list(initial_list);
		  });
		  var config = {
				  "user" : "admin",
				  "password" : "Mmauy64k",
				  "host" : "69.122.11.113",
				  "port" : "2000"
		  }
		  c.connect(config, function(result){
			  console.log("Returned!");
			  res.json(result);
		  });
	};*/
	
	return router;

};