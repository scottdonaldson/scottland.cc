var groups = [];

// Create an array -- groups -- with the number of distinct .same-height groups
$('.same-height[data-group]').each(function(){
    var $this = $(this);
    if ($.inArray($this.attr('data-group'), groups) === -1) {
        groups.push($this.attr('data-group'));
    }
});
function makeSameHeight() {
    var targetHeight = 0,
        sameHeight;
    for (var i = 0; i < groups.length; i++) {
        sameHeight = $('.same-height[data-group="' + groups[i] + '"]');

        sameHeight.height('auto').each(function() {
            var $this = $(this);
            targetHeight = $this.height() > targetHeight ? $this.height() : targetHeight;
        });
        sameHeight.height(targetHeight).find('.text').each(function(){
            var $this = $(this);
            if ($this.closest('.bar').length > 0) {
                $this.css('padding-top', 0.5 * ($this.parent().height() - $this.height()));
            }
        });
    }
}
// Call this a bunch of times -- there's some weird cross-browser issues
$(document).ready(makeSameHeight);
win.on('load resize', makeSameHeight);
