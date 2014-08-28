(function() {

	var win = $(window),
		body = $('body');

	// Lazy loading for large background images
	var backgrounds = $('[data-background]');
	backgrounds.each(function(){
		var $this = $(this),
			background = $this.attr('data-background');

		$('<img>').attr('src', background).load(function(){
			$this.css({ 'background-image': 'url(' + background + ')' });
		});
	});

	// Elements that are not links but have data-go-to attrs should act like links
	function goTo() {
		location.assign(this.getAttribute('data-go-to'));
	}
	$('[data-go-to]').click(goTo);

	// Off-canvas nav
	var canvas = $('.offcanvas'),
		nav = $('.offcanvas-nav'),
		show = $('.show-offcanvas-nav'),
		exit = $('.exit-offcanvas');

	function enterOffCanvas() {
		
		canvas.addClass('offcanvas-active').animate({
			left: nav.outerWidth()
		});

		show.parent().animate({
			left: '+=' + nav.outerWidth()
		});

	}

	function exitOffCanvas(e) {
		
		// Allow escape key to be pressed to close canvas
		if ( e.type !== 'keydown' || e.keyCode === 27 ) {
			
			canvas.removeClass('offcanvas-active').animate({ 
				left: 0
			});

			show.parent().animate({
				left: '-=' + nav.outerWidth()
			});

		}
	}

	show.click( enterOffCanvas );

	exit.click( exitOffCanvas );

	win.keydown( exitOffCanvas );

})();