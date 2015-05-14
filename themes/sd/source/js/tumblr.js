(function(){

function init() {
    window.addEventListener('scroll', tryToGetMorePosts, false);

    if ( progress ) {
        if ( postID ) {
            getPost(postID);
        } else {
            if ( !!+progress.getAttribute('data-show-all') ) showAll = true;
            getPosts(showAll ? 20 : 4);
        }
    }
}

// Tumblr
var progress = document.getElementById('in-progress-images'),
    postID = false, // by default, assume we're not looking at just 1 post
    url = 'https://api.tumblr.com/v2/blog/scottlandinprogress.tumblr.com/posts',
    api_key = 'og7kklRhXgkAdQFT8S0fQpRVYIUAXmUyhCG8DIXBKMrMajGwky',
    showAll = false, // by default, assume we are not showing all (rather just 4)
    max = 20, // the most posts we can get at one time
    gottenPosts = 0, // the # of posts we have retrieved
    totalPosts,
    haveTried = []; // the URLs we've already queried (so we don't double hit)

// we might be looking at a single post
if ( location.hash.length > 0 ) {
    postID = location.hash.slice(1);
}

// mini-library for JSONP
var AJAX = (function() {
    var that = {};

    that.get = function(url, callback) {

        url += '&callback=dummy';

        var timeout_trigger = window.setTimeout(function(){
            window.dummy = function(){};
            on_timeout();
        }, 1000);

        window.dummy = function(data) {
            window.clearTimeout(timeout_trigger);
            callback(data);
            delete window.dummy;
        };

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = url;

        document.getElementsByTagName('head')[0].appendChild(script);
    }

    return that;
})();

// Easy peasy - show 1 post
function showPost(data) {

    gottenPosts++;

    var post = data.response.posts[0];
    var layout = document.createElement('div');
    layout.classList.add('container', 'row');
    layout.innerHTML = '<div class="two columns hide-s"></div>' +
        '<div class="eight columns aligncenter">' +
        '<img class="anim-fade lazy-load" src="' + post.photos[0].alt_sizes[0].url + '">' +
        (post.caption.length > 0 ? '<div class="caption">' + post.caption + '</div>' : '') +
        '</div><div class="two columns hide-s"></div></div>' +
        '<div class="container row"><div class="two columns"></div><div class="eight columns"><a class="caption" href="/visuals">&larr; Back to Assorted Visuals</a></div><div class="two columns"></div>';

    progress.appendChild(layout);
    utils.lazyLoad();
}

function showPosts(data) {

    var postsHere = data.response.posts.length;

    totalPosts = data.response.total_posts;

    var iter = 0,
        progressImages = [];

    data.response.posts.forEach(function(post) {

        var url = post.photos[0].alt_sizes[1].url,
            height = post.photos[0].alt_sizes[1].height,
            width = post.photos[0].alt_sizes[1].width,
            caption = post.caption,
            postID = post.id;

        progressImages.push({
            url: url,
            height: height,
            width: width,
            id: totalPosts - iter - gottenPosts,
            postID: postID,
            caption: caption
        });

        iter++;

        // every 4 images or at the end, lay out and reset
        if ( iter % 4 === postsHere % 4 ) {
            testLayouts(progressImages);
            progressImages = [];
        }
    });

    gottenPosts += postsHere;

}

function makeLayout(images, layout) {

    var progressTemplate = '',
        toSplice = [],
        sortedImages = [null, null, null, null];

    // sort images so they match the given layout
    images.forEach(function(image, i) {

        var aspect = image.width / image.height > 1 ? 'h' : 'v';

        for ( var j = 0; j < layout.length; j++ ) {

            if ( !!layout[j].type ) {

                // if it matches, fill it in
                if ( layout[j].type === aspect && !sortedImages[j] ) {

                    // add the iterator to the toSplice array
                    toSplice.push(i);

                    sortedImages[j] = image;
                    break;
                }
            // if there are no types in the layout, we can just return the images
            } else {
                return sortedImages = images;
            }
        }
    });

    toSplice.reverse().forEach(function(i) {
        images.splice(i, 1);
    });

    // if there are unmatched images, fill them in without checking for aspect
    images.forEach(function(image) {
        sortedImages.forEach(function(sortedImage, i) {
            if ( sortedImage === null ) {
                sortedImages[i] = image;
            }
        });
    });

    sortedImages.forEach(function(image, i) {

        if ( i === 0 ) {
            progressTemplate = '<div class="container maintain row">';
        }

        var numColumns = layout[i].cols,
            columns = utils.numberToWord(layout[i].cols),
            nextImageColumns = sortedImages[i + 1] ? utils.numberToWord(layout[i + 1].cols) : false;

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
            }

            openDiv = '<div class="' + columns + ' ' + columns + '-s ' + colClass + ' in-progress" style="' + style + '">';
        }

        if ( nextImageColumns !== 'zero' ) {
            closeDiv += '</div>';
        }

        if ( i === 3 ) {
            closeDiv += '</div>';
        }

        progressTemplate += openDiv +
            '<a href="/visuals#' + image.postID + '">' +
            '<div class="image anim-fade lazy-load" style="background-image:url(' + image.url + ');"></div>' +
            '<img src="' + image.url + '">' +
            '<div class="cover abs t0 l0"><div class="vcenter"><p class="bold lead">#' + image.id + '</p>' +
            '</div></div></a>' + closeDiv;

    });

    var dummy = document.createElement('div');
    dummy.innerHTML = progressTemplate;
    progress.appendChild(dummy);

    utils.lazyLoad();
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

        if ( want.h === have.h && want.v === have.v ) {
            masterLayout = layout;
            break;
        }
    }

    return makeLayout(images, masterLayout);

};

function getPost(id) {
    var theUrl = url + '?api_key=' + api_key + '&id=' + postID
    AJAX.get(theUrl, showPost);
}

function getPosts(limit) {

    var toTry = url + '?api_key=' + api_key + '&limit=' + limit + '&offset=' + gottenPosts;

    if ( haveTried.indexOf(toTry) === -1 ) {

        AJAX.get(toTry, showPosts);

        haveTried.push(toTry);
    }
}

function tryToGetMorePosts() {

    console.log('trying to get more');
    console.log('conditions are', showAll, document.body.clientHeight, document.body.scrollTop - 100, window.innerHeight)

    // only try if we're going to show all
    if ( showAll && document.body.clientHeight - document.body.scrollTop - 100 < window.innerHeight ) {
        getPosts(20);
    }
}

document.addEventListener('DOMContentLoaded', init);

})();
