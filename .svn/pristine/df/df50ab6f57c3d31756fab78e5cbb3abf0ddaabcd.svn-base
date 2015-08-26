angular.module('popup_media_module', ['ui.bootstrap']).controller('popup_mediaController', function($scope, $http, $window) {
		$scope.player = null
		$scope.current_url = "http://d1xdkehzbn1ea2.cloudfront.net/tv/broad_city/0109/index.m3u8"
		$scope.player_id = "mytv_streamer"

		$scope.loadStream = function(url) {
			$scope.stop();
			$scope.current_url = url
			$scope.load(url)
		}

		$scope.load = function(url) {
			console.log($scope.player)
			if ($scope.player != null) {
				$scope.player.playerLoad(url)
			}
		}
		
		$scope.play = function(url) {
			if($scope.player != null) {
				$scope.player.playerPlay()
		  }
		}

		$scope.pause = function() {
			if($scope.player != null) {
				$scope.player.playerPause()
		  }
		}

		$scope.resume = function() {
			if($scope.player != null) {
				$scope.player.playerResume()
		  }
		}
		
		$scope.stop = function() {
			if($scope.player != null) {
				$scope.player.stop()
		  }
		}
		
		function onManifest(duration) {
		  console.log("Something Else!");
		}
		
		function initMovieObject(){
			
			console.log($window)
			console.log($window.mothership_data)
			
			$scope.current_url = $window.mothership_data
			current_path = $window.window.document.location.pathname.replace("/","")
			console.log($scope.current_url)
			
			console.log($window.window.document.location.pathname)
			
			if (current_path === 'popup') {
		     if (window.document[$scope.player_id])
		      {
		        $scope.player = window.document[$scope.player_id]
		      }
		      if (navigator.appName.indexOf("Microsoft Internet")==-1)
		      {
		        if (document.embeds && document.embeds[$scope.player_id])
		        {
		          $scope.player = document.embeds[$scope.player_id]
		        }
		      }
		      else
		      {
		        $scope.player = document.getElementById($scope.player_id)
		      }
			}  else if (current_path === 'popupv2') {
			 flowplayer("player", "/libs/player/flowplayer.swf", {
			 // configure the required plugins
			 wmode: 'direct',
			 plugins: {
			 httpstreaming: {
			 url: '/libs/player/flashlsFlowPlayer.swf',
			 hls_debug : false,
			 hls_debug2 : false,
			 hls_lowbufferlength : 3,
			 hls_minbufferlength : -1,
			 hls_maxbufferlength : 300,
			 hls_startfromlevel : -1,
			 hls_seekfromlevel : -1,
			 hls_live_flushurlcache : false,
			 hls_seekmode : "ACCURATE",
			 hls_fragmentloadmaxretry : -1,
			 hls_manifestloadmaxretry : -1,
			 hls_capleveltostage : false,
			 hls_maxlevelcappingmode : "downscale"
			 }
			 },
			 clip: {
			 accelerated: true,
			 url: $scope.current_url,
			 ipadUrl: $scope.current_url,
			 urlResolvers: "httpstreaming",
			 lang: "fr",
			 provider: "httpstreaming",
			 autoPlay: false,
			 autoBuffering: true
			 },
			 log: {
			 level: 'debug',
			 filter: 'org.flowplayer.controller.*'
			 }
			 }).ipad();
			}
		}
		
		initMovieObject();
		
});