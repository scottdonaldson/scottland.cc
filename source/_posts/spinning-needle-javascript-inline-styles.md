title: Spinning the Needle with JavaScript and Inline Styles
date: 2013/02/21
banner: '## assets ##/2013/08/abide-banner.jpg'
---

<div class="container">

    <div class="two columns"></div>
    <div class="eight columns">
        <p><strong>Updated August 2013: This article was originally titled “Spinning the Needle with jQuery and CSS Transforms.” While those are still in play here, the title has been updated to reflect the shift from setting data attributes with jQuery and styling with CSS, to directly using inline styles — cutting the size of the stylesheet in half.</strong></p>
        <p>Parsley &amp; Sprouts recently redesigned the website for the <a href="http://www.abide-idea.com" target="_blank">Abide Idea Company</a>, an idea generation/strategic development consultant. The headline for the site reads, “A trusted guide on your journey to develop&nbsp;new&nbsp;ideas,” and we pushed this metaphor with a graphic of a compass that stays fixed on the page as you scroll down.</p>
        <p>One interactive element that I was really happy with was making the needle of the compass spin so that it’s always pointing at your cursor as you browse the site.</p>

    <img src="## assets ##/2013/02/abide1.png" class="aligncenter">

    <h3>HTML</h3>
    {% code  %}
    <section id="masthead" class="full-width" role="masthead">
    <div class="full-content">
        <div class="content">
            <h2>A trusted guide on your journey to develop new ideas.</h2>
            <div class="compass_container">
                <div id="compass">
                    <img class="compass" src="compass.png">
                    <img class="needle" src="needle.png">
                    <img class="circle" src="circle.png">
                </div>
            </div>
            <h3>A friend to ideas and the people who have them.</h3>
            </div>
    </div>
    </section>
    {% endcode %}
    <p>The compass consists of three separate image files — one for the compass itself, one for the needle, and one small circle at the center of the needle. All are located in the masthead, so that the compass can be positioned relative when you're at the top of the screen. Then, once you scroll down far enough that it hits the center of the screen, the JavaScript adds a class of "fixed," which does what you'd expect &mdash; fixes it in the center. We listen for any mouse moving and, based on that, set an inline style that rotates the needle a certain number of degrees (calculated based on the mouse's position relative to the center of the needle).</p>
    <h3>JS</h3>
    {% code %}
    var mouseX, mouseY, needleX, needleY, angle;
    var needle = $('.needle');

    $(document).mousemove(function(e){
        mouseX = e.pageX;
        mouseY = e.pageY - $(window).scrollTop();
        needleX = needle.offset().left + needle.width()/2;
        needleY = needle.offset().top - $(window).scrollTop() + needle.height()/2;
        if (mouseX &gt; needleX) {
            angle = Math.atan((mouseY - needleY)/(mouseX - needleX));
            angle = 180 * angle/Math.PI + 90;
        } else {
            angle = Math.atan((mouseY - needleY)/(mouseX - needleX));
            angle = 180 * angle/Math.PI + 270;
        }
        // Don't set the angle if the mouse is hovering over it
        if (!(Math.abs(mouseX - needleX) &lt; 80 &amp;&amp; Math.abs(mouseY - needleY) &lt; 80)) {
            needle.css({
                'transform': 'rotate(' + angle + 'deg)',
                '-ms-transform': 'rotate(' + angle + 'deg)',
                '-webkit-transform': 'rotate(' + angle + 'deg)'
            });
        }
    });
    {% endcode %}
                <p>First I set some variables — the x and y positions of both the cursor and the needle, and the angle between them. The &#8216;needle&#8217; variable is, of course, the needle. Whenever the mouse is moved, these variables are recalculated. For the y position of both the cursor and the needle, the amount the window has scrolled from the absolute top of the page also needs to be recalculated — otherwise the jQuery .offset() method gives us the position relative to the page, <i>not</i> the window. For the needle, both the x and y values have got 1/2 of the width and height (respectively) of the image added, so that the position is calculated from the center of it, not the top left corner.</p>
                <p>Once we&#8217;ve got those four variables, we can calculate the angle formed between the center of the needle and the cursor. <del>Thinking back to high school trigonometry</del> Googling brought me to the <a href="http://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Application:_finding_the_angle_of_a_right_triangle" target="_blank">arctangent function</a>. Imagine a right triangle drawn with two points at the center of the needle and the cursor, and the third formed where orthogonal lines from those points intersect:</p>

    <img src="## assets ##/2013/02/abide2.png" class="aligncenter">
    <p>Subtracting the needle's y position from the mouse's y position (and needle x from mouse x) gives us the lengths of the triangle's two legs, which is what we need for our arctan function. One thing to note is that the output of arctan changes depending on if the horizontal component is positive or negative (if the cursor is to the left or the right of the needle). Obviously we don't want this to happen, so I separated the angle output into two different cases to compensate for this. Then we calculate the angle in each by taking the arctangent, converting to degrees (arctan outputs radians by default &mdash; degrees are just easier on the eyes), and adding either 90 or 270, depending on if we're to the right or left. This value comes from the fact that 0 degrees is actually straight out to the right, and we want the needle's resting state to be straight up.</p>
    <p>The last if statement checks to make sure the user is not hovering over the needle. Without it in place, as you get closer to the needle, the needle will start acting really volatile, spinning all over the place wildly depending on where exactly the cursor is. This statement locks it in its current place (where it was when the cursor entered its space) until the cursor moves out again. If the mouse is anywhere else on the page, we set an inline CSS style (with vendor prefixes for IE9 and Webkit browsers) that transform rotates the needle to that angle. Voilà!</p>
    <p>And all of this is re-done every time you move the mouse.</p>
    <p>Transforms actually have <a href="http://caniuse.com/#search=transform" target="_blank">pretty decent browser support</a>, which the exception of IE8 and below. This is really a prime example of progressive enhancement — users on older version of Internet Explorer will see a fixed compass and needle (pointing straight up), which still furthers the &#8220;guide&#8221; metaphor without the interactivity. As an added bonus, although touch screens don&#8217;t have cursors, they do call .mousemove() whenever the user taps on the screen, so the needle <em>will</em> change its position to point where you tap. Most probably won't notice it, but it's a nice feature for those who do.</p>
    <p>So, put this all together, and you've got yourself one heck of a nice spinning needle. Don&#8217;t get too dizzy.</p>
    </div>
</div>
