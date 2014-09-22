---
layout: home
---

<div class="index-content project">
    <div class="section">
        <ul class="artical-cate">
            <li class="on" ><a href="/projects/u3d"><span>U3D</span></a></li>
            <li style="text-align:center"><a href="/projects/cocos"><span>Cocos2dx</span></a></li>
            <li style="text-align:right"><a href="/projects/android"><span>Android</span></a></li>
        </ul>

        <div class="cate-bar"><span id="cateBar"></span></div>

        <ul class="artical-list">
        {% for post in site.categories.u3d %}
            <li>
                <h2>
                    <a href="{{ post.url }}">{{ post.title }}</a>
                </h2>
                <div class="title-desc">{{ post.description }}</div>
            </li>
        {% endfor %}
        
        </ul>
    </div>
    <div class="aside">
    </div>
</div>
