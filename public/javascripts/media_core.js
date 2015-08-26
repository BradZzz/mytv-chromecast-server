
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

var module = angular.module('media_module', ['ui.bootstrap','ngFx']).controller('mediaController', function($scope, $http, $window) {
	
	$scope.media = {}
	$scope.features = {}
	$scope.curMedia = {}
	$scope.television = true
	$scope.scopeMediaSelected = ""
	$window.$scope = $scope
	var popup = 'popup'
	//popup or popupv2
	
	$scope.load = function(){
		$http({
		    url: '/filesystem', 
		    method: "GET",
		    params: {root: "tv2/"},
			headers: {
				'Content-Type': 'json'
			}
		 }).success(function(data) {
			$scope.folders = data
			console.log($scope.folders)
			_.each($scope.folders, function(value, key, obj) { 
				 //console.log(key);
				 $scope.getMediaMeta(key, true);
			});
		}).error(function(data) {
			console.log('Error1: ' + data)
		});
		
		$http({
	    url: '/foldercontents', 
	    method: "GET",
	    params: {root: "movies2/"},
	    headers: {
	    	'Content-Type': 'json'
	    }
		 }).success(function(data) {
			 console.log(data)
			 _.each(data, function(value) { 
				 //console.log(value);
				 $scope.getMediaMeta(value, false);
			});
		 }).error(function(data) {
			console.log('Error1: ' + data)
		});
	};
	
	$scope.setShow = function(show) {
		console.log("Setting Show")
		console.log(show)
		console.log($scope.media[show].Poster)
		$scope.safeApply(function(){
			$scope.curMedia = $scope.media[show]
		})
	}
	
	/*$scope.castEpisode = function(episode) {
		console.log(episode)
	}*/
	
	$scope.formatEpisode = function(episode) {
		var parts = episode.split('/').clean("")
		return parts[parts.length-1]
	}
	
	$scope.safeApply = function(fn) {
	  var phase = this.$root.$$phase;
	  if(phase == '$apply' || phase == '$digest') {
	    if(fn && (typeof(fn) === 'function')) {
	      fn();
	    }
	  } else {
	    this.$apply(fn);
	  }
	};
	
	$scope.showSelection = function(is_television){
		return $scope.television === is_television
	}
	
	$scope.getMediaMeta = function(metaString, television) {
		//console.log("MetaString")
		//console.log(metaString.replace(/_/g, ' '))
		
		var media_path = ""
		
		if ($scope.television) {
			media_path = metaString
		}
		
		metaString = metaString.replace("movies2/","").replace("/","")
		
		return $http({
	    url: 'http://www.omdbapi.com/', 
	    method: "GET",
	    params: { t : metaString.replace(/_/g, '+'), y : '', plot : 'short', r : 'json'},
			headers: {
				'Content-Type': 'json'
			}
		 }).success(function(data) {
			 //console.log("Returned: " + metaString)
			 //console.log(data)
			 if (data.Response === "True") {
				 if (television) {
					 $scope.media[data.Title] = {
							 Runtime : data.Runtime ,
							 Rating : data.imdbRating ,
							 Votes : data.imdbVotes ,
							 Genre : data.Genre,
							 Summary : data.Plot,
							 Eps : $scope.folders[metaString] ,
							 Poster : data.Poster,
							 isTelevision : true,
					 }
				 } else {
					 $scope.media[data.Title] = {
							 Runtime : data.Runtime ,
							 Rating : data.imdbRating ,
							 Votes : data.imdbVotes ,
							 Genre : data.Genre,
							 Summary : data.Plot,
							 Poster : data.Poster,
							 s3_mid : media_path,
							 isTelevision : false,
					 }
				 }
				 //console.log($scope.media[data.Title])
			 } else {
				 //We didn't get a response. The media string isn't formatted correctly
				 if (television) {
					 $scope.media[metaString] = {
							 Runtime : "0" ,
							 Rating : "?" ,
							 Votes : "?" ,
							 Genre : "" ,
							 Summary : "No Summary Found" ,
							 Eps : $scope.folders[metaString] ,
							 Poster : "http://i.imgur.com/5H4cX6G.jpg",
							 isTelevision : true,
					 }
				 } else {
					 $scope.media[metaString] = {
							 Runtime : "0" ,
							 Rating : "?" ,
							 Votes : "?" ,
							 Genre : "" ,
							 Summary : "No Summary Found" ,
							 Poster : "http://i.imgur.com/5H4cX6G.jpg",
							 s3_mid : media_path,
							 isTelevision : false,
					 }
				 }
				 $scope.media.full_path = ""
				 //console.log($scope.media[metaString])
			 }
		 }).error(function(data) {
			console.log('Error1: ' + data)
		 });
	}
	
	$scope.launchViewer = function() {
		if ($scope.curMedia['full_path'] !== "") {
		  //console.log(popup)
			//console.log($scope.curMedia['full_path'])
			var popupWindow = window.open(popup)
		  popupWindow.mothership_data = $scope.curMedia['full_path']
		}
	}
	
	$scope.selectMedia = function(ep) {
		//console.log(ep)
		//console.log($scope.scopeMediaSelected)
		return ep === $scope.scopeMediaSelected
	}
	
	$scope.play = function(ep) {
		console.log(ep)
		//https://s3.amazonaws.com/mytv.media/1001.mkv
		//https://s3.amazonaws.com/mytv.media.out.video/test/1001.mp4
		//loadCustomMedia( "http://d1xdkehzbn1ea2.cloudfront.net/test/1001.mkv" )
		if ($scope.scopeMediaSelected === ep || !(ep.indexOf("tv2/") > -1)) {
			$scope.scopeMediaSelected = ""
			var prefix = "http://d1xdkehzbn1ea2.cloudfront.net/"
			var suffix = "index.mkv"
			console.log(prefix + ep + suffix)
			$scope.curMedia['full_path'] = prefix + ep + suffix
			loadCustomMedia( prefix + ep + suffix )
			var epLabel = ep.replace("tv2/","").replace("movies2/","").slice(0, - 1).replace("/"," (").replace(/_/g, ' ').capitalize()
			if(ep.indexOf("tv2/") > -1){
				epLabel += ')'
			}
			$('.current-media').text(epLabel)
		} else {
			$scope.scopeMediaSelected = ep
		}
	}
	
	/*
  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    console.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };*/
  
  var down=false;
  var scrollTop=0;
  var y = 0;
  
  $('.hold_scrollable').mousedown(function(e) {
      down = true;
      scrollTop = this.scrollTop;
      y = e.clientY;
  }).mouseup(function() {
      down = false;
  }).mousemove(function(e) {
      if (down) {
         this.scrollTop = scrollTop + y - e.clientY;
      }
  }).mouseleave(function() {
      down = false;
  });

  $scope.changeTelevision = function(change_to_television){
  	if (change_to_television) {
  		$scope.safeApply(function(){
    		$scope.television = true
  		})
  		$('.movies_placeholder').removeClass( "active" )
  		$('.television_placeholder').addClass( "active" )
  		for (var key in $scope.media) {
  			console.log(key)
    		console.log($scope.media[key])
  			if ($scope.media[key].isTelevision) {
  				$scope.curMedia = $scope.media[key]
  				break;
  			}
  		}
  	} else {
  		$scope.safeApply(function(){
    		$scope.television = false
  		})
  		$('.movies_placeholder').addClass( "active" )
    	$('.television_placeholder').removeClass( "active" )
    	for (var key in $scope.media) {
    		console.log(key)
    		console.log($scope.media[key])
  			if (!$scope.media[key].isTelevision) {
  				$scope.curMedia = $scope.media[key]
  				console.log("Switched!")
  				console.log($scope.curMedia)
  				break;
  			}
  		}
  	}
  }
  
  $scope.showOverlay = function(){
  	$(".overlay").css('background-color', 'rgba(0, 0, 0, 0.5)')
  	$(".overlay").css('opacity', '1')
  }
  
  $scope.hideOverlay = function(){
  	$(".overlay").css('background-color', 'rgba(0, 0, 0, 0)')
  	$(".overlay").css('opacity', '0')
  }
  
	$scope.load()
	
});

module.config(function($httpProvider) {
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
});