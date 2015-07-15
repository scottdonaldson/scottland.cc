---
title: A More Concise get_post_meta()
class: no-image
layout: post
---

If you're a WordPress developer who builds sites using a lot of custom fields*, you're likely familiar with WordPress' [`get_post_meta()`](http://codex.wordpress.org/Function_Reference/get_post_meta) function. It's used to display custom post information (that is, data other than title, body content, author, etc.) on the front end. If you need the function often, writing it can quickly grow tedious. Here's a way to tighten it up and not repeat yourself every time you call it.

The function takes three arguments:

{% highlight php %}
get_post_meta($ID, $key, bool);
{% endhighlight %}

Where `$ID` and `$key` are the ID of the post you want to pull from, and the key of the custom field, respectively. The boolean determines if the function will return an array —-- if `false` (that is, if there's more than one value for a given key), or a string —-- if `true` (if there's only one value for the given key).

In the majority of the cases I use this function:

- I want to pull from the post that's being displayed (i.e. on any given post, you *probably* don't want to grab information from another post), and
- I want to get a single result for the given key.

So, in the interest of not including the 1st and 3rd inputs every time, you can paste this code into functions.php and, with the new meta() function, only have to input the key you want the value for.

{% highlight php linenos %}
// Get post meta shortcut
function meta($key) {
    return get_post_meta($post->ID, $key, true);
}
{% endhighlight %}

Now the meta() function only takes one argument for the custom field key. You can still use get_post_meta() if you want to pull from another post, or if you have multiple values for a given key.

<small>Note that if you're an acolyte of [Elliot Condon](https://twitter.com/elliotcondon)'s incredible, indispensable [Advanced Custom Fields plugin](http://www.advancedcustomfields.com/), `the_field()` and `get_field()` work in just about the same way — but if ACF is overkill for a certain project where you plan on using custom fields, you still might want a shortcut for `get_post_meta()`.</small>
