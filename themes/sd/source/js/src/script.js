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
    progressImages = [];

var utils = {
    numberToLetter: function(num) {
        return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'][num];
    }
};

var layouts = {};

var conditions = [
    // three horizontal and one vertical image:
    // one six col image, two stacked in three, one in three by itself
    {
        want: {
            h: 3,
            v: 1
        },
        layout: [6, 3, 0, 3]
    },
    // four horizontal:
    // just put 'em in three columns each
    {
        want: {
            h: 4,
            v: 0
        },
        layout: [6, 3, 0, 3]
    }
]

function makeLayout(images, layout) {

    var progressTemplate = '';

    images.forEach(function(image, i) {

        var numColumns = layout[i],
            columns = utils.numberToLetter(layout[i]),
            nextImageColumns = images[i + 1] ? utils.numberToLetter(layout[i + 1]) : false;

        // classes to add to the div
        var classes = '';
        if ( image.tags.length > 0 ) {
            image.tags.forEach(function(tag) {
                classes += ' ' + tag;
            });
            // if there are no tags (classes), give it a white background
        } else {
            classes = ' bg-white';
        }

        var style = '';

        var colClass = 'column';
        colClass += (columns === 'one') ? '' : 's';

        var openDiv = '',
        closeDiv = '';

        // zero columns means that we're remaining within the last div
        if ( columns !== 'zero' ) {

            if ( nextImageColumns === 'zero' ) {
                // make 'em stack in a column
                style = 'flex-direction: column;';
                // we also do not want a background class now
                classes = '';
            }

            openDiv = '<!-- opening --><div class="' + columns + ' ' + colClass + ' in-progress' + classes + '" style="' + style + '">';
        }

        if ( nextImageColumns !== 'zero' ) {

            closeDiv = '</div><!-- closing -->';
        }

        progressTemplate += openDiv +
            '<a href="' + image.permalink + '" target="_blank">' +
            '<img src="' + image.url + '">' +
            '<div class="cover abs t0 l0"><div class="vcenter">#' + image.id + '<br>' + image.caption + '</div></div></a>' + closeDiv;
    });
    progress.append(progressTemplate);
}

function testLayouts(images) {
    var masterLayout;

    for ( var i = 0; i < conditions.length; i++ ) {
        var c = conditions[i];
        var want = c.want,
            have = {
                h: 0,
                v: 0,
            },
            layout = c.layout;

        images.forEach(function(image) {
            var aspect = image.width / image.height;
            if ( aspect > 1 ) {
                have.h++;
            } else {
                have.v++;
            }
        });

        if (want.h === have.h && want.v === have.v) {
            masterLayout = layout;
            break;
        }
    }

    return makeLayout(images, masterLayout);

};

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


            data.response.posts.forEach(function(post) {

                if ( iter < max ) {

                var url = post.photos[0].alt_sizes[1].url,
                    height = post.photos[0].alt_sizes[1].height,
                    width = post.photos[0].alt_sizes[1].width,
                    caption = post.caption,
                    permalink = post.image_permalink,
                    tags = post.tags;

                progressImages.push({
                    url: url,
                    height: height,
                    width: width,
                    id: totalPosts - iter,
                    caption: caption,
                    permalink: permalink,
                    tags: tags
                });

                iter++;

                }
            });

            // only use 1st four images
            testLayouts(progressImages)
            // progress.append(progressTemplate(progressImages[iter]))

        }
    });

}
