hexo.extend.filter.register('after_post_render', function(data, callback){

	var banner;

    if ( data.banner ) {
        banner = data.banner;

        data.content = '<div class="padded bg-white row"><img class="anim-fade lazy-load" src="' + banner + '"></div>' + data.content;
    }

    // replace ## assets ## with the config assets URL
	data.content = data.content.replace(/## assets ##/g, hexo.config.assets);

	// replace <br> tags with nothing
	data.content = data.content.replace(/<br>/g, '');
	// replace empty <p> tags
	data.content = data.content.replace(/<p><\/p>/g, '');
	// replace $$ with single quote '
	data.content = data.content.replace(/\$\$/g, "'");

    callback(null, data);

});
