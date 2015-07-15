---
title: Data Visualization with the Wikipedia API and Snap.svg
layout: post
banner: 2014/05/invisibles-banner.gif
---

This post describes the process and ideas behind visualizing data from Wikipedia using Snap.svg. Not the nitty-gritty.

If you're looking for that, the full code for this project is available on [GitHub](https://github.com/scottdonaldson/dfe/blob/master/invisibles.js).

<hr>

I recently worked with Design for Equality on the Invisibilities project, a discussion and Wikipedia edit-a-thon meant to highlight "architects, movements, ideas or project that have been dismissed, forgotten, or discriminated against by the discipline of architecture" in the digital realm.

The gender gap in Wikipedia's editors (reported by *The Atlantic* in 2013 as being 90% male) has recently come [under](http://nymag.com/thecut/2014/02/closing-wikipedias-gender-gap-reluctantly.html) [scrutiny](http://www.nytimes.com/2011/01/31/business/media/31link.html?_r=0). As a widely used source of information on the Internet, this leads to a bias with a tremendous impact.

For the Invisibilities project, we wanted to illustrate the imbalance by showing the difference in edit activity (how often a Wikipedia page is updated) for different pages --- notably between architects and designers of different genders.

<style>main ol li { margin: 1em 0; } main ol li h2 { margin-bottom: 0.25em; }</style>

1. ## The List

    Based on suggestions from online activists, the Invisibilities web page prints a list of names of Wikipedia pages (or, if a page doesn't exist yet, an "invisible" page for users to add and edit). The code runs through the list and, depending on whether or not a page exists, retrieves meta-data from Wikipedia about that page.

2. ##Wikipedia API

    Wikipedia (through MediaWiki) provides an [API](http://www.mediawiki.org/wiki/API:Main_page) specifically for this purpose. By default, a query for a page will only return information about the latest/current revision. However, we can specify a numerical `rvlimit` parameter of up to 500 to get information about the most recent 500 edits. If there are more than 500, the response will tell us that, and specify an `rvcontinue` (offset) at which to continue our query.

3. ## Retrieve the Data

    To reduce the amount of data we have to process, we only look for a timestamp for each revision. These we store in a global object with keys for every page whose value is an array of revision timestamps. For some pages who have thousands of revisions, the array quietly grows in the background (as we retrieve in batches of 500). Once we have gotten all the revisions --- Wikipedia tells us that there are no more --- we begin to organize the data in order to visualize it. I had worked casually with [Snap.svg](http://snapsvg.io/) on a few personal projects in the past. Snap uses jQuery-like methods and selectors to easily display and animate SVGs, browser support for which has [never been better](http://caniuse.com/#feat=svg). Snap also allows for associating data with an SVG element, which is extremely useful here.

4. ## Organize the Data

    With all the revision data in hand, we set up an SVG element for each page and loop through the corresponding revisions. For three time ranges --- the past 24 hours, 30 days, and 12 months --- we loop (with hours, days, or months as our iterators) through the data, adding the revision if it fits into corresponding time unit. For a fourth range, all time, after adding each revision, we loop again monthly *from the first instance*, to fill in blanks where there might have been no revisions\*. Each of the four ranges gets its own data object that we associate with the SVG element.

    <small>\*Since in this case we are iterating by revision, not by unit of time, it is not guaranteed that we will have each consecutive month accounted for.</small>

5. ## Visualize the Data

    Now, with the revision data categorized into time ranges, we can generate the bar graph. By default, we look at edits over the past twelve months. The width of each bar, then, will be the width of the graph (in pixels\*), divided by twelve. The height for each bar, of course, depends on the number of edits. While generating the graph, we also associate the time unit and number of edits with each bar element through Snap, so that on hover it displays this information.</li>

    <small>\*Somewhat ironically, the dimensions of SVG elements are pixel-based, so we also listen in the background for any window resizing and adjust the bar width accordingly.</small>

6. ## Revisualize the Data

    The function to display the graph can also take, as an input, one of our other time ranges. In this case, it wipes the existing SVG graph clean, and repeats the above step with a different set of data, number of bars, and width of each bar. Both this step and the step above include animating the height of each bar, so that they grow and shrink when the graph is being generated or wiped.

    I took as my inspiration for these graphs Runkeeper's method of displaying user activities over time:

    <img class="section aligncenter" src="{{ site.assets }}/2014/05/runkeeper-graph.gif">

While this project was successful, there's definitely ways of better organizing the data while looping through and parsing timestamps, and I wonder if [d3.js](http://d3js.org/) might have been a better choice than Snap, given its focus on data. On the other hand, Snap is able to take over a lot of DOM manipulation from jQuery (fading, animating, displaying modals) that d3 might not be able to.

Again, this post isn't meant to describe in detail every line of code used, rather to explain the technical process and modes of thinking required to process data and dynamically visualize it. Hope you've enjoyed.
