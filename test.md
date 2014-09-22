---
layout: home
---
<div>
<ul>
{% for doc in site.data.docs %}
  <li>
    <a href="https://github.com/{{ doc.title }}">
      {{ doc.docs }}
    </a>
  </li>
{% end %}
</ul>
<div>