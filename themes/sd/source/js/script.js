(function() {

	var winWidth = window.outerWidth,
		bannerHeight = 50,
		banner;

	var colors = ['#234', '#245', '#356'];

	var prevA = 0,
		prevB = 0,
		a, b;

	var i = 0;

	a = randomize();
	b = randomize();

	function randomize() {
		return Math.ceil(Math.random() * 30) + 8;
	}

	function createBar() {

		banner.path('M' + (prevA - 2) + ',0H' + a + 'L' + b + ',' + bannerHeight + 'H' + (prevB - 2) + 'Z').attr({
				'class': 'bar',
				fill: colors[i % colors.length]
			});

		prevA = a;
		prevB = b;

		a += randomize();
		b += randomize();

		i++;
	}

	function createBanner() {
		while ( a < winWidth || b < winWidth || prevA < winWidth || prevB < winWidth ) {

			createBar();

		}
	}

	function setupBanner() {
		
		if ( typeof Snap !== 'undefined' ) {
			banner = Snap('#banner');

			banner.attr({
				height: bannerHeight,
				width: winWidth,
				fill: '#999'
			});

			createBanner();
		} else {
			setTimeout(setupBanner, 10);
		}
	}

	setupBanner();

})();