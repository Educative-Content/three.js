import { XHRLoader } from './XHRLoader';
import { DefaultLoadingManager } from './LoadingManager';

function ImageLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;
}

ImageLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var scope = this;
	var loader = new XHRLoader(this.manager);
	loader.load(url, function(text)
	{
		scope.parse(JSON.parse(text), onLoad);
	}, onProgress, onError);
}

ImageLoader.prototype.parse = function(json, onLoad)
{
	var image = new Image();
	
	image.name = json.name;
	image.uuid = json.uuid;
	image.format = json.format;
	image.encoding = json.encoding;
	image.data = json.data;
	
	return image;
}
