var win = $(window);

var groups = [];

// Create an array -- groups -- with the number of distinct .same-height groups
$('.same-height[data-group]').each(function(){
    var $this = $(this);
    if ($.inArray($this.attr('data-group'), groups) === -1) {
        groups.push($this.attr('data-group'));
    }
});
function makeSameHeight() {
    var sameHeight, targetHeight;
    for (var i = 0; i < groups.length; i++) {

        sameHeight = $('.same-height[data-group="' + groups[i] + '"]');
        targetHeight = 0;

        sameHeight.height('auto').each(function() {
            var $this = $(this);
            targetHeight = $this.height() > targetHeight ? $this.height() : targetHeight;
            $this.height(targetHeight);
        });
    }
}
// Call this a bunch of times -- there's some weird cross-browser issues
$(document).ready(makeSameHeight);
win.on('load resize', makeSameHeight);

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function compareDates(a, b) {
    // return the number of days different between a and b
    return ( (a.getTime() - b.getTime()) / (24*60*60*1000) );
}

function parseDate() {
    var date = this.getAttribute('data-date'),
        showYear = this.getAttribute('data-show-year'),
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
            text = months[date.getMonth()] + ' ' + date.getDay() + ( !!+showYear ? ', ' + date.getFullYear() : '' );
        }
    }

    if ( now.getFullYear() !== date.getFullYear() && !relative ) {
        text += ', ' + date.getFullYear();
    }

    this.innerHTML = text;
}
$('[data-date]').each(parseDate);

// Tumblr
var progress = $('#in-progress-images'),
    progressImages = [],
    progressAspects = [];

function progressTemplate(image, permalink) {
    return '<div class="three columns progress-square"><a href="' + permalink + '" target="_blank"><img src="' + image + '"></a></div>';
}

if ( progress ) {

    var iter = 0, max = 4;

    $.ajax({
        url: 'http://api.tumblr.com/v2/blog/scottlandinprogress.tumblr.com/posts',
        data: {
            api_key: 'og7kklRhXgkAdQFT8S0fQpRVYIUAXmUyhCG8DIXBKMrMajGwky'
        },
        dataType: 'jsonp',
        success: function(data) {
            var totalPosts = data.response.total_posts;

            if ( iter < max ) {
                data.response.posts.forEach(function(post) {

                    var url = post.photos[0].alt_sizes[1].url,
                        height = post.photos[0].alt_sizes[1].height,
                        width = post.photos[0].alt_sizes[1].width,
                        permalink = post.image_permalink;

                    progressImages.push({
                        url: url,
                        height: height,
                        width: width,
                        id: totalPosts - iter,
                        permalink: permalink
                    });
                    progressAspects.push(width / height);

                    iter++;
                });
            }

            // only use 1st four images
            for ( iter = 0; iter < max; iter++ ) {
                // console.log(progressAspects[iter]);
                progress.append(progressTemplate(progressImages[iter].url, progressImages[iter].permalink))
            }

        }
    });

}
