title: "@ColHeightsMetro, or 'My First Twitterbot'"
date: 2014/03/24
---

<div class="row padded bg-white">
    <img class="anim-fade lazy-load" src="## assets ##/2014/03/colheights-banner.png">
</div>

<div class="row container">
    <div class="two columns spacer"></div>
    <div class="eight columns">
        <h1 class="bold">{{ title }}</h1>
        <p data-date="{{ date }}" class="caption"></p>
        <p>Inspired lately by <a href="http://tinysubversions.com/" target="_blank">Darius Kazemi</a>'s (veritable army of) Twitterbots, I decided to take on the project of building one for myself. I had already played around with Washington Metropolitan Area Transit Authority (WMATA)'s API a few months ago, and thought it could provide excellent fodder for a regularly updating bot. I live closest to the Columbia Heights Metro station, so I set out to write a script that would find the trains that would be arriving soonest at the station and tweet their destinations and times to arrival &mdash; the two main things travelers are looking for in a schedule, and fortunately two things that the API returns quite handily.</p>
        <h2>Part I: WMATA API</h2>
        <p>WMATA has an <a href="http://developer.wmata.com/API_Get_Started" target="_blank">impressively open API</a> and seems to encourage developers to make the most of it. After registering a key, I was ready to get started.</p>
        <p>There are three main methods within the API &mdash; to get information about buses, trains, and incidents (of which there are many). The rail method contains different endpoints for general information about lines, stations, and paths (basically a system map, rendered as JSON data), and specific information for station predictions. To get this for Columbia Heights, I first had to find the station&#8217;s three-digit code within the system. To do this, I made a call to the stations endpoint requesting complete information on all the stations:</p>
        {% code %}
        http://api.wmata.com/Rail.svc/json/jStations?api_key=my_key
        {% endcode %}
        <p>By just visiting that in browser (with my actual key in place of <em>my_key</em>), I was able to see an array of all the stations, and find the code for Columbia Heights, <b>E04</b>. With that I was now able to get information specifically for Columbia Heights at the following URL:</p>
        {% code %}
http://api.wmata.com/StationPrediction.svc/json/GetPrediction/E04?api_key=my_key{% endcode %}
        <p>Which returns a JSON object like:</p>

        {% code %}{"Trains":[{"Car":"8", "Destination":"Brnch Av", "DestinationCode":"F11", "DestinationName":"Branch Avenue", "Group":"2", "Line":"GR", "LocationCode":"E04", "LocationName":"Columbia Heights", "Min":"4"}, {"Car":"6", "Destination":"Grnbelt", "DestinationCode":"E10", "DestinationName":"Greenbelt", "Group":"1", "Line":"GR", "LocationCode":"E04", "LocationName":"Columbia Heights", "Min":"8"}, {"Car":"6", "Destination":"Ft.Tottn", "DestinationCode":"B06", "DestinationName":"Fort Totten", "Group":"1", "Line":"YL", "LocationCode":"E04", "LocationName":"Columbia Heights", "Min":"14"}, {"Car":"6", "Destination":"Hntingtn", "DestinationCode":"C15", "DestinationName":"Huntington", "Group":"2", "Line":"YL", "LocationCode":"E04", "LocationName":"Columbia Heights", "Min":"15"}]}{% endcode %}

<p>Give or take, depending on how complete the information is at the time it's being requested. The JSON looks messy, but it's essentially an array of trains, ordered ascending by when they will arrive at the station, with additional information for each &mdash; such as number of cars on the train, destination, and line (i.e. green, yellow, red). For some reason the entire thing is wrapped in a redundant object with a 'Trains' key, but otherwise it's easy enough to parse &mdash; all we're interested in is the first few trains that are listed. With this information in hand, it was time to figure out how to build something that would tweet it succinctly and at regular intervals.</p>
        <h2>Part II: The Twitterbot</h2>
        <p>Twitter made some changes to its API last spring, resulting in needing to implement oAuth in every case where you want to post tweets, and in most cases even when you only want to read them, which means server-side rather than client-side authentication. On top of that, a server is needed to run a cron job to regularly post tweets through the API.</p>
        <p>Fortunately, in addition to being a source of inspiration for his work, Darius Kazemi has also written about the <a href="http://tinysubversions.com/2013/09/how-to-make-a-twitter-bot/" target="_blank">process of building a Twitterbot</a>, and through digging through the comments that post I was able to find another article by <a href="https://twitter.com/LightAesthetic" target="_blank">Patrick Rodriguez</a> on <a href="http://thelightaesthetic.com/making-twitterbots-with-google-apps-script-part-1/" target="_blank">using Google Apps Scripts to power the bot</a>. As it turns out, Google Apps Scripts run a language that's virtually identical to JavaScript, so I didn't have to learn anything new syntactically to get it up and running. And Patrick's article links to a terrific boilerplate bot, with one key function that can be called at determined intervals (from once a year all the way up to every minute), which will send out the tweet.</p>
<p>After creating a new account for <a href="http://twitter.com/colheightsmetro" target="_blank">@ColHeightsMetro</a> and setting up an app to allow tweets to be posted to it (read more on that step at either of the above links), all that was left was to generate a tweet from the station schedule information. Here's the code I ended up with:</p>
{% code %}function buildString( trains ) {
 
  var output = '',
      placeholder,
      i = 0;
 
  // Ignore certain destination names (not taking on any passengers)
  var badDests = ['', 'Train', 'No Passenger'];
  
  for ( var i = 0; i < trains.length; i++ ) {
 
      placeholder = output;
 
      var min = trains[i].Min,
      line = trains[i].Line === 'YL' ? 'Yellow line' : 'Green line', // only yellow and green operate out of Col. Heights
      dest = trains[i].DestinationName,
      plural = min === 1 || min === '1' ? '' : 's';
 
      // Make sure destination is not in badDests array
      // and minutes is not an empty string
      if ( badDests.indexOf( dest ) === -1 && min !== '' ) {
 
          if ( min === 'BRD' ) {
 
              output += line + ' to ' + dest + ' boarding now. ';
 
          } else if ( min === 'ARR' ) {
 
              output += line + ' to ' + dest + ' arriving now. ';
 
          } else {
 
              output += line + ' to ' + dest + ' arriving in ' + min + ' minute' + plural + '. ';
 
          }
 
      }
 
      if ( output.length > 140 ) {
 
          output = placeholder;
          break;
 
      }
 
  }
 
  return output;
}{% endcode %}
        <p>It loops through all the trains that have been returned (up to as many as 6 or 7 that I&#8217;ve seen), and attempts to build onto a string with a sentence for each. I say attempts because a statement at the end checks to make sure that it hasn't exceeded Twitter's 140-character limit, and if it has, it reverts to the previous iteration (without the most recently added sentence), which should be under that limit.</p>
        <p>Columbia Heights only operates Green and Yellow line trains, so I check the line, and if it isn't Yellow, it must be Green.</p>
        <p>There are a few cases for destination that usually mean a train is coming through but not picking anyone up, such as <a href="https://twitter.com/ColHeightsMetro/status/448278406266753025" target="_blank">'No Passenger'</a>, 'Train,' and an empty string, so it ignores it if that is the case.</p>
        <p>There are a few minutiae with minutes to arrival. First, the API sometimes returns an empty string, so we have to ignore that. Then there's the common problem of needing to differentiate between plurals (5 minutes) and singular (1 minute). WMATA also includes two special cases: 'BRD' for a train that is currently boarding, and 'ARR' for a train that is arriving in under 1 minute.</p>
        <p>With all of these cases taken care of, the bot now provides a fairly accurate real-time schedule for trains going through Columbia Heights Metro. Tweeting every ten minutes, it's a little noisy, but will be useful if you want to know when the next trains will be at at this station. After this, it would be interesting to make a bot that responds to specific questions about any given station with schedule or incident information.</p>
    </div>
</div>
