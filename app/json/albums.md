{% assign albums = (site.data.albums | where: 'published','y') %}

{% if albums.size == 0 %}
{% endif %}

{% for album in albums %}
// {{ cover.slug }}
// {{ cover.cover }}
// {{ cover.artist }}
// {{ cover.title }}
// {{ album.cover_medium }}

{% for track in album.tracks %}
// track.number
// track.duration
// track.title
{% endfor %}


{% endfor %}
