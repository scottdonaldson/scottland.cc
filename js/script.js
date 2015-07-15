(function() {

function init() {
    // lazy load images
    utils.lazyLoad();

    // parse dates
    var dates = document.querySelectorAll('[data-date]');
    forEach(dates, parseDate);

    var show = document.querySelectorAll('[data-show]');
    forEach(show, function() {
        // remove leading # to get id and query, then add event listener
        this.addEventListener('click', utils.toggle, false);
        this.addEventListener('mouseover', utils.show, false);
        this.addEventListener('mouseout', utils.hide, false);
    });
}

var tick;
function fade(el, target, orig) {

    if ( el.style.display === 'none' ) el.style.display = 'block';

    var last = +new Date();
    tick = function() {
        var next = +new Date();
        el.style.opacity = +el.style.opacity + (target > orig ? (next - last) : (last - next)) / 250;
        last = next;

        if ( (target > orig && +el.style.opacity < target) || (target < orig && +el.style.opacity > target) ) {
            requestAnimationFrame(tick);
        }

        // if done fading out, hide it all the way
        if ( target === 0 && +el.style.opacity <= 0 ) el.style.display = 'none';
    }
    tick();
}

function fadeIn(el) {
    return fade(el, 1, 0);
}

function fadeOut(el) {
    return fade(el, 0, 1);
}

function fadeToggle(el) {
    return +el.style.opacity === 0 ? fadeIn(el) : fadeOut(el);
}

function forEach(array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
        callback.call(array[i], i);
    }
};

window.utils = {
    numberToWord: function(num) {
        return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen'][num];
    },
    show: function() {
        var target = document.getElementById(this.getAttribute('data-show').slice(1));
        fadeIn(target);
    },
    hide: function() {
        var target = document.getElementById(this.getAttribute('data-show').slice(1));
        fadeOut(target);
    },
    toggle: function() {
        var target = document.getElementById(this.getAttribute('data-show').slice(1));
        fadeToggle(target);
    },
    lazyLoad: function() {

        var lazyLoaders = document.getElementsByClassName('lazy-load');

        function loadIt() {
            this.classList.remove('lazy-load');
        }

        forEach(lazyLoaders, function() {

            var styles = getComputedStyle(this);

            if ( this.tagName === 'IMG' ) {
                imagesLoaded(this, function(instance) {
                    forEach(instance.elements, loadIt);
                });
            } else if ( styles && styles.backgroundImage && styles.backgroundImage.slice(0, 3) === 'url' ) {

                var url = styles.backgroundImage.replace('url(', '').replace(')', ''),
                    img = document.createElement('img');
                img.src = url;
                imagesLoaded(img)
                    .on('done', loadIt.bind(this))
                    .on('always', loadIt.bind(this));
            }
        });
    }
};

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function compareDates(a, b) {
    // return the number of days different between a and b
    return ( (a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000) );
}

function parseDate() {

    var date = this.getAttribute('data-date'),
        year, month, day,
        now = new Date(),
        text,
        relative = false;

    // get month from date format
    month = date.split(' ')[0].split('-')[1];
    month = +month - 1;
    month = months[month];
    month = month.slice(0, 3);

    date = date.replace(/(\d{4})-\d{2}-(\d{2})/, month + ' $2, $1');

    // include GMT
    date = date.replace(/(-\d{4})/, 'GMT$1');
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

document.addEventListener('DOMContentLoaded', init);

})();
