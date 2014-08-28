hexo.extend.filter.register('after_post_render', function(data, callback){

	// replace ## assets ## with the config assets URL
	data.content = data.content.replace(/## assets ##/g, hexo.config.assets);
	// replace <br> tags with nothing
	data.content = data.content.replace(/<br>/g, '');
	// replace empty <p> tags
	data.content = data.content.replace(/<p><\/p>/g, '');
	callback(null, data);

});