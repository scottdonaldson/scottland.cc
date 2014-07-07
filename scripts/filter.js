// replace {{ assets }} with the config assets URL
hexo.extend.filter.register('before_post_render', function(data, callback){

	data.content = data.content.replace(/## assets ##/g, hexo.config.assets);
	callback(null, data);

});