---
layout: home
---
<div>
<ul>
{% for docs in site.data.docs %}
  <li>
    <a href="https://github.com/{{ docs.title }}">
      {{ docs.docs }}
    </a>
  </li>
{% end %}
</ul>
<div>