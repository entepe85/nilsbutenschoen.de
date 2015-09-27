---
layout: page
title: Blog
permalink: /blog/
---

<section class="blog">

<ul class="post-list">
  {% for post in site.posts %}
    <li>
      <span class="post-meta">{{ post.date | date: "%d.%m.%Y" }}{% if post.author %} • <span itemprop="author" itemscope itemtype="http://schema.org/Person"><span itemprop="name">{{ post.author }}</span></span>{% endif %}</span>

      <h2>
        <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
      </h2>
      {% for category in post.categories %}<span class="category-label">{{ category }}</span>{% endfor %}
    </li>
  {% endfor %}
</ul>

<p class="rss-subscribe"><a href="{{ "/feed.xml" | prepend: site.baseurl }}">{% include rss.svg %} RSS</a></p>

</section>
