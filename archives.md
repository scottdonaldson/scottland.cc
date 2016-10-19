---
layout: default
title: Archives
permalink: /archives/
---

<div class="container stack full-width">

{% for post in site.posts  %}

    {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
    {% capture next_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}

    {% if forloop.first %}
    <div class="section container">
        <div class="two two-s columns normalize">
            <h3 class="secondary">{{ this_year }}</h3>
        </div>
        <div class="ten nine-s columns normalize no-underline">
    {% endif %}

    <div class="row">
        <h3 class="tight">
        {% if post.layout == "link" %}
            <a href="{{ post.link }}" target="_blank">{{ post.title }}</a>
        {% else %}
            <a href="{{ post.url }}">{{ post.title }}</a>
        {% endif %}
        </h3>
        <span class="caption" data-date="{{ post.date }}"></span>
    </div>

    {% if forloop.last %}

        </div><!-- .ten -->
        </div><!-- .section -->

    {% else %}
        {% if this_year != next_year %}

        </div><!-- .ten -->
        </div><!-- .section -->

        <div class="section container">
            <div class="two two-s columns normalize">
                <h3 class="secondary">{{ next_year }}</h3>
            </div>
            <div class="ten nine-s columns normalize no-underline">

        {% endif %}
    {% endif %}
{% endfor %}

</div>
