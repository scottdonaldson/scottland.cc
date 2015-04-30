hexo.extend.filter.register('before_post_render', function(data, callback) {

	var content = data.content,
		title = data.title,
		date = data.date;

	// Title and date
	content =
		(title && date ?
			'<h1 class="bold">' + title + '</h1>' +
			'<p data-date="' + date + '" class="caption"></p>' :
			''
		) +
		content;

	data.content = content;

	callback(null, data);

});

hexo.extend.filter.register('after_post_render', function(data, callback) {

	var content = data.content,
		banner = data.banner,
		width = data.width;

	// Banner
	function makeBanner() {

		var output = '';

		if ( banner ) {

	        output += '<div class="padded bg-white row"><img class="anim-fade lazy-load" src="' + banner + '"></div>';
	    }
		return output;
	}

	// Layout container
	if ( !width ) {

		content =
			'<div class="row container">' +
				'<div class="two columns spacer"></div>' +
				'<div class="eight columns">' + content + '</div>' +
			'</div>';
	} else if ( data.width === 'full' ) {

		var titleRegex = /(<h1.*class="caption"><\/p>)/;

		content = content.replace(titleRegex, '<div class="container">' +
			'<div class="two columns spacer"></div>' +
			'<div class="eight columns">$1</div>' +
		'</div>');
	}

	// Banner goes at the top (before layout container)
	content = makeBanner() + content;

    // replace ## assets ## with the config assets URL
	content = content.replace(/## assets ##/g, hexo.config.assets);

	// replace <br> tags with nothing
	content = content.replace(/<br>/g, '');
	// replace empty <p> tags
	content = content.replace(/<p><\/p>/g, '');
	// replace $$ with single quote '
	content = content.replace(/\$\$/g, "'");

	// set content again
	data.content = content;

    callback(null, data);

});
