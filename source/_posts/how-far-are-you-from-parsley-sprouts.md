title: How Far Are You from Parsley & Sprouts?
date: 2012/07/12
layout: no-image
---

<div class="row container">
    <div class="two columns spacer"></div>
    <div class="eight columns">
        <h1 class="bold">{{ title }}</h1>
        <p data-date="{{ date }}" class="caption"></p>
        <p>Last Friday, Lisa and I launched the official Parsley &amp; Sprouts website, after having been freed from our day jobs and hard at work on it for several weeks. Since it's our own site, we had the freedom to do with it whatever we wanted, so in addition to our design, branding, copy, and photos, there are plenty of fun details that we hope we'll keep on building off of in the coming weeks and months. One of the pieces we were happiest about was the distance calculator on the About page.</p>

        <img alt="Where can we find you?" src="## assets ##/2012/07/St-Paul-MN.png" class="aligncenter"><p>By inputting your city and state, you can find out how far (in miles) you are from us — specifically, Lowertown St. Paul, right next to Golden's Deli.</p>

        <p>Initially I had envisioned using the Google Maps API (which I had just worked with a bit on another Parsley &amp; Sprouts project, the mobile site for College Park Car Wash). However, it turns out Google has some weird terms of service when it comes to using the API but not displaying actual Google maps, as well as needing to have their logo visible on the page. The solution turned out to be simpler.

        <p>I knew I would have to use some sort of autofill on the form &mdash; I figured if someone were trying to type in 'Minneapolis' but instead inputted 'Minneaplois,' there's little chance it would work correctly (and even a slim chance that their typo could be an actual city somewhere else, in which case it would work, but calculate the <em>wrong</em> distance). In doing so, I stumbled on a <a href="https://github.com/agarzola/jQueryAutocompletePlugin">demo of a jQuery autocomplete plugin</a> that uses <a href="http://www.geonames.org/">GeoNames</a> &mdash; an online database with hundreds of thousands of entries of cities, countries, and other geographical entities &mdash; coincidentally, exactly what I was looking for!</p>

        <p>You can check out the above demo to get a decent overview of setting up an input box that will autocomplete a city and state (within the U.S.), and allow the user to select it. The next step for was to figure out how to calculate the distance between the user's selection and the Parsley &amp; Sprouts headquarters — needing the latitude and longitude of both locations. That was easy enough to find <a href="http://whatsmylatlng.com/">here</a> (to a scary amount of specificity). And fortunately, GeoNames data comes with latitude and longitude, so that information is retrieved whenever the user selects the city. So how do we get the distance between the two? The answer:</p>

        <blockquote class="twitter-tweet" lang="en"><p>The haversine formula!</p>&mdash; Scottland (@scottpdonaldson) <a href="https://twitter.com/scottpdonaldson/status/210800316592041984">June 7, 2012</a></blockquote>
        <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

        <small>(I tweeted that out of sheer joy upon discovering that it was so [relatively] easy that there was a name for it.)</small>

        <p>The mathematical formula itself goes like this:</p>

        <img class="aligncenter" src="## assets ##/2012/07/haversine.png">

        <p>Where <em>haversin</em> is the haversine function, defined by:</p>

        <img class="aligncenter" src="## assets ##/2012/07/haversine-function.png" />

        <p>Those two equations are great, and easy enough if you're working with raw numbers and a calculator, but not so great on the web. There we need Javascript. I wasn't about to go and recreate this from scratch, so fortunately I found an example over at <a href="http://www.movable-type.co.uk/scripts/latlong.html">Movable Type Scripts</a>. Here's the original code:</p>
        {% code %}
        var R = 6371; // km
        var dLat = (lat2-lat1).toRad();
        var dLon = (lon2-lon1).toRad();
        var lat1 = lat1.toRad();
        var lat2 = lat2.toRad();

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        {% endcode %}
        <p>The first step was to replace that 6,371 on the top line with 3,959 — the Earth's radius in miles as opposed to kilometers (those pesky Brits). Next I replaced the instances of <em>lat1</em> and <em>lon1</em> with the latitude and longitude of Parsley &amp; Sprouts: 44.949316 and -93.086241. And rather than include the new function for converting to radians, I just replaced the four instances of it with its (relatively simple) execution, multiplying by pi and dividing by 180:</p>
        <pre>Math.PI/180</pre>
        <p>Almost there. The last step was to bring over the data from GeoNames. This meant adding two extra parameters, <em>lat</em> and <em>lng</em>, when calling the data for the city. So our new haversine formula, specific to the coordinates of Parsley &amp; Sprouts, became:</p>
        {% code %}
        var R = 3959; // mi
        var dLat = (data.lat-44.949316)*Math.PI/180;
        var dLon = (data.lng+93.086241)*Math.PI/180;
        var lat1 = 44.949316*Math.PI/180;
        var lat2 = data.lat*Math.PI/180;

        var a = ( Math.sin(.5*dLat) * Math.sin(.5*dLat) ) +
                ( Math.sin(.5*dLon) * Math.sin(.5*dLon) * Math.cos(lat1) * Math.cos(lat2) );
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = Math.ceil(R * c);
        {% endcode %}
        <p>Our output, <em>d</em>, is the distance as the crow flies between the selected city and where I'm sitting as I write this. Success! Now to figure out how to display the results in an interesting, meaningful way. It was Lisa's idea to write different responses depending on how far great <em>d</em> ended up being. For example, if the user is less than 10 miles away (basically just St. Paul, Minneapolis, and a handful of suburbs), they get a result that reads, "You're practically in our backyard! Ready to <a title="Parsley and Sprouts - Contact" href="http://www.parsleyandsprouts.com/contact" target="_blank">get started</a>?" From there, moving up, there are different answers that reflect how far away the visitor is — from greater Minnesota all the way out to Alaska, thousands of miles away (we're not yet doing business internationally...). If you're savvy, you can read the code to see all the different responses. Otherwise, I hope you'll check out the <a title="Parsley and Sprouts - About" href="http://www.parsleyandsprouts.com/about">About page</a> yourself and try a few different cities.</p>
    </div>
</div>
