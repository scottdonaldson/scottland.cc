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
