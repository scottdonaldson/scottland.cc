var win = $(window);

function show() {
    var el = $(this.getAttribute('data-show'));
    el.stop().fadeIn();

    // add an event listener in case
    el.mouseover(function(){
        $(this).stop().fadeIn();
    }).on('mouseout click', function() {
        $(this).stop().fadeOut().off('mouseover mouseout click');
    });
}
function hide() {
    $(this.getAttribute('data-show')).stop().fadeOut();
}
$('[data-show]').mouseover(show).mouseout(hide);

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

// Tumblr
var progress = $('#in-progress-images'),
    progressImages = [];

var utils = {
    numberToLetter: function(num) {
        return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'][num];
    }
};

var conditions = [
    // three horizontal and one vertical image:
    // one six col image, two stacked in three, one in three by itself
    {
        want: {
            h: 3,
            v: 1
        },
        layout: [
            {
                type: 'h',
                cols: 6
            },
            {
                type: 'h',
                cols: 3
            },
            {
                type: 'h',
                cols: 0
            },
            {
                type: 'v',
                cols: 3
            }]
    },
    // four horizontal:
    // just put 'em in three columns each
    {
        want: {
            h: 4,
            v: 0
        },
        layout: [
            { cols: 3 },
            { cols: 3 },
            { cols: 3 },
            { cols: 3 }
        ]
    },
    // four vertical: same as above
    {
        want: {
            h: 0,
            v: 4
        },
        layout: [
            { cols: 3 },
            { cols: 3 },
            { cols: 3 },
            { cols: 3 }
        ]
    },
    // two and two:
    // two stacked in six, one in three, one in three
    {
        want: {
            h: 2,
            v: 2
        },
        layout: [
            {
                type: 'h',
                cols: 5
            },
            {
                type: 'h',
                cols: 0
            },
            {
                type: 'v',
                cols: 4
            },
            {
                type: 'v',
                cols: 3
            }
        ]
    },
    // three vertical, one horizontal:
    // all side by side but staggered a little
    {
        want: {
            h: 1,
            v: 3
        },
        layout: [
            {
                type: 'v',
                cols: 2
            },
            {
                type: 'h',
                cols: 5
            },
            {
                type: 'v',
                cols: 2
            },
            {
                type: 'v',
                cols: 3
            }
        ]
    }
];

function makeLayout(images, layout) {

    var progressTemplate = '';

    var sortedImages = [];

    images.forEach(function(image, i) {

        var aspect = image.width / image.height > 1 ? 'h' : 'v';

        for ( var i = 0; i < layout.length; i++ ) {
            if ( layout[i].type ) {
                if ( layout[i].type === aspect && !sortedImages[i] ) {
                    sortedImages[i] = image;
                    break;
                }
            } else {
                sortedImages[i] = image;
                break;
            }
        }
    });

    sortedImages.forEach(function(image, i) {

        var numColumns = layout[i].cols,
            columns = utils.numberToLetter(layout[i].cols),
            nextImageColumns = sortedImages[i + 1] ? utils.numberToLetter(layout[i + 1].cols) : false;

        // classes to add to the div
        var classes = '',
            innerClasses = '';
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
                style = 'flex-direction: column; justify-content: space-between;';
                // we also do not want a background class now,
                // but we do want it on the inner stuff
                innerClasses = classes;
                classes = '';
            }

            openDiv = '<!-- opening --><div class="' + columns + ' ' + colClass + ' in-progress' + classes + '" style="' + style + '">';
        }

        if ( nextImageColumns !== 'zero' ) {

            closeDiv = '</div><!-- closing -->';
        }

        progressTemplate += openDiv +
            '<a href="' + image.permalink + '" target="_blank" class="' + innerClasses + '">' +
            '<img src="' + image.url + '">' +
            '<div class="cover abs t0 l0"><div class="vcenter">Works in Progress:&nbsp;#' + image.id + '<br>' + image.caption + '</div></div></a>' + closeDiv;

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
