title: A More Concise get_post_meta()
date: 2013/06/13
layout: no-image
---

<p>If you're a WordPress developer who builds sites using a lot of custom fields*, you're likely familiar with WordPress' <a href="http://codex.wordpress.org/Function_Reference/get_post_meta" target="_blank">get_post_meta() function</a>. It's used to display custom post information (that is, data other than title, body content, author, etc.) on the front end. If you need the function often, writing it can quickly grow tedious. Here's a way to tighten it up and not repeat yourself every time you call it.</p>
<p>The function takes three arguments:</p>
{% code %}get_post_meta($ID, $key, bool);{% endcode %}
<p>Where $ID and $key are the ID of the post you want to pull from, and the key of the custom field, respectively. The boolean determines if the function will return an array — if <em>false</em> (that is, if there's more than one value for a given key), or a string — if <em>true</em> (if there's only one value for the given key).</p>
<p>In the majority of the cases I use this function:</p>
<ul>
	<li>I want to pull from the post that's being displayed (i.e. on any given post, you probably don't want to grab information from another post), and</li>
	<li>I want to get a single result for the given key.</li>
</ul>
<p>So, in the interest of not including the 1st and 3rd inputs every time, you can paste this code into functions.php and, with the new meta() function, only have to input the key you want the value for.</p>
{% code %}
// Get post meta shortcut
function meta($key) {
    return get_post_meta($post->ID, $key, true);
}
{% endcode %}
<p>Now the meta() function only takes one argument for the custom field key. You can still use get_post_meta() if you want to pull from another post, or if you have multiple values for a given key.</p>
<small>*Note that if you're an acolyte of <a href="https://twitter.com/elliotcondon" target="_blank">Elliot Condon</a>'s incredible, indispensable <a href="http://www.advancedcustomfields.com/" target="_blank">Advanced Custom Fields plugin</a>, the_field() and get_field() work in just about the same way — but if ACF is overkill for a certain project where you plan on using custom fields, you still might want a shortcut for get_post_meta().</small>
