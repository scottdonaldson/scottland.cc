var win = $(window),
    doc = $(document);

var utils = {
    numberToLetter: function(num) {
        return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'][num];
    },
    show: function() {
        var el = $(this.getAttribute('data-show'));
        el.stop().fadeIn();

        // add an event listener in case
        el.mouseover(function(){
            $(this).stop().fadeIn();
        }).on('mouseout click', function() {
            $(this).stop().fadeOut().off('mouseover mouseout click');
        });
    },
    hide: function() {
        $(this.getAttribute('data-show')).stop().fadeOut();
    },
    lazyLoad: function() {
        $('.lazy-load').each(function(){
            var $this = $(this);
            if ( $this.is('img') ) {
                imagesLoaded($this).on('done', function() {
                    $this.removeClass('lazy-load');
                });
            } else if ( $this.css('background-image').slice(0, 3) === 'url' ) {
                var url = $this.css('background-image').replace('url(', '').replace(')', ''),
                    img = $('<img src="' + url + '">');
                imagesLoaded(img).on('done', function() {
                    $this.removeClass('lazy-load');
                });
            }
        });
    }
};

doc.ready(utils.lazyLoad);

$('[data-show]').mouseover(utils.show).mouseout(utils.hide);

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function compareDates(a, b) {
    // return the number of days different between a and b
    return ( (a.getTime() - b.getTime()) / (24*60*60*1000) );
}

function parseDate() {
    var date = this.getAttribute('data-date'),
        now = new Date(),
        text,
        relative = false;
    date = new Date(date);

    var daysPassed = compareDates(now, date);

    if ( daysPassed < 1 ) {
        var hours = Math.ceil(daysPassed * 24),
            plural = hours === 1 ? '' : 's';

        text = (hours.toString()) + ' hour' + plural + ' ago';

    } else {
        daysPassed = Math.floor(daysPassed);
        if ( daysPassed === 1 ) {
            text = 'Yesterday';
            relative = true;
        } else if ( daysPassed === 2 ) {
            text = 'The day before yesterday';
            relative = true;
        } else if ( daysPassed > 2 && daysPassed < 9) {
            text = 'Last week';
            relative = true;
        } else {
            text = months[date.getMonth()] + ' ' + date.getDate();
        }
    }

    if ( now.getFullYear() !== date.getFullYear() && !relative ) {
        text += ', ' + date.getFullYear();
    }

    this.innerHTML = text;
}
$('[data-date]').each(parseDate);
