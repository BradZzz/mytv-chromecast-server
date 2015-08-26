var IncludeJS = function(scripts, settings){
	var i = 0;
	var preloaded, root, localFolder, dev;
	
	if(!window.includeJS){
		window.includeJSGLOBAL = preloaded = function(){
			var files = [];

			update = function(path){
				files.push(path);
			}

			check = function(path){
				var i = 0;

				while(i < files.length){
					if(path === files[i]){
						return true
					}

					i++;
				}

				return false; 
			}

			return {
				update: update,
				check: check
			}
		}();
	} else {
		window.includeJSGLOBAL.load(scripts, settings ? (settings.folder || '') : '');
		return window.includeJSGLOBAL;
	}

	if(settings && typeof settings === 'object'){ 
		dev = dev || settings.dev || false;
		root = root || settings.root || '';
		localFolder = settings.folder ? '/' + settings.folder + '/' : '/';
	}
	
	this.load = function(files, folder){
		var i = 0; 
		var folder = folder ? '/' + folder: localFolder;

		if(files instanceof Array){
			while(i < files.length){
				inject(folder + files[i++]);
			}
		} else {
			inject(folder + files);
		}
	};
	
	var log = function(message){
		if(dev)
			console.error(message);
	}
	
	var ajax = function(url, callback){
		var r = new XMLHttpRequest();
		r.open("GET", url, false);
		r.send(null);
	
		return callback.call(callback, r.responseText);
	};
	
	var inject = function(file){
		var self = this;
		var path = root + file + '.js';

		if(!preloaded.check(path)){
			log('loading ' + path)	
			ajax(path, function(data){
				document.write('<script>' + data + '</script>');
				preloaded.update(path);
			});
		} else {
			log(path + ' is already loaded');
		}
	};

	if(scripts && scripts.length){
		while(i < scripts.length){
			this.load(scripts[i]);
			i++;
		}
	}
}