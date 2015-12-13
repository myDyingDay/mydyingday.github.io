// var staticDomain = "http://static.mydyingdayrocks.com";
var staticDomain = '';

(function() {

    $('#header').sticky({
        topSpacing: 0
    });

    jQuery(window).scroll(function() {
        if (jQuery(window).width() > 640) {
            if (jQuery(window).scrollTop() > jQuery(window).height() - 200) {} else {}
        }
    });

    var page_nav = '';
    jQuery('a').click(function() {
        page_nav = jQuery(this).attr('href');
        if (page_nav.search('#') >= 0 && page_nav.length > 2 && page_nav !== '#myCarousel') {
            jQuery('html,body').animate({
                'scrollTop': jQuery('' + page_nav).offset().top - 40
            }, 600);
            if (jQuery('html').hasClass('lt-ie9')) {
                jQuery('body').hasClass('no-history');
            } else {
                window.history.pushState(', ', page_nav);
            }
            return false;
        }
    });
    var page_scroll_window_scrolltop = 0;
    var page_scroll_panel = '';
    var page_scroll_link = '';
    var page_scroll_li = '';

    function page_scroll_section() {
        page_scroll_window_scrolltop = jQuery(window).scrollTop();
        jQuery('#site-nav a').each(function() {
            page_scroll_link = jQuery(this);
            page_scroll_li = jQuery(this).parent();
            page_scroll_panel = jQuery(this).attr('href');
            page_scroll_panel = page_scroll_panel.replace('#', '');
            jQuery('.xpanel').each(function() {
                if (page_scroll_window_scrolltop > (jQuery(this).offset().top - 200) && page_scroll_window_scrolltop < (jQuery(this).offset().top + jQuery(this).outerHeight())) {
                    if (jQuery(this).attr('id') === page_scroll_panel) {
                        page_scroll_li.addClass('active');
                    } else {
                        page_scroll_li.removeClass('active');
                    }
                }
            });
        });
    }
    jQuery(window).resize(function() {
        page_scroll_section();
    });
    jQuery(window).scroll(function() {
        page_scroll_section();
    });

    jQuery(window).load(function() {
        var web_address = location.href;
        if (web_address.search('#') > 0) {
            web_address = web_address.split('#');
            page_nav = web_address[1];
            jQuery('html,body').animate({
                'scrollTop': jQuery('#' + page_nav).offset().top - 60
            }, 600);
        }
    });


    var displaylimit = 5;
    var twitterprofile = 'mydyingdayrocks';
    var screenname = 'my dyingDay';
    var showdirecttweets = false;
    var showretweets = false;
    var showtweetlinks = true;
    var showprofilepic = false;
    var showtweetactions = false;
    var showretweetindicator = false;

    var headerHTML = '';
    var loadingHTML = 'Loading tweets ...';
    headerHTML += '';

    $('#twitter-feed').html(headerHTML + loadingHTML);
    $.ajaxSetup({
        cache: true
    });
    $.getJSON('/json/tweets.json',
        function(feeds) {
            var feedHTML = '';
            var feedIndex = '';
            var feedBody = '';
            var displayCounter = 1;
            for (var i = 0; i < feeds.length; i++) {
                var tweetscreenname = feeds[i].user.name;
                var tweetusername = feeds[i].user.screen_name;
                var profileimage = feeds[i].user.profile_image_url_https;
                var status = feeds[i].text;
                var isaretweet = false;
                var isdirect = false;
                var tweetid = feeds[i].id_str;

                if (typeof feeds[i].retweeted_status !== 'undefined') {
                    profileimage = feeds[i].retweeted_status.user.profile_image_url_https;
                    tweetscreenname = feeds[i].retweeted_status.user.name;
                    tweetusername = feeds[i].retweeted_status.user.screen_name;
                    tweetid = feeds[i].retweeted_status.id_str;
                    status = feeds[i].retweeted_status.text;
                    isaretweet = true;
                }


                if (feeds[i].text.substr(0, 1) === '@') {
                    isdirect = true;
                }

                if (((showretweets === true) || ((isaretweet === false) && (showretweets === false))) && ((showdirecttweets === true) || ((showdirecttweets === false) && (isdirect === false)))) {
                    if ((feeds[i].text.length > 1) && (displayCounter <= displaylimit)) {
                        if (showtweetlinks === true) {
                            status = addlinks(status);
                        }
                        var carouselClass = '';
                        if (displayCounter === 1) {
                            carouselClass = 'active';
                        } else {}

                        feedHTML += '<div class="twitter-article" id="tw' + displayCounter + '">';
                        feedHTML += '<div class="twitter-text">';
                        feedHTML += '<p>';
                        feedHTML += '<span class="tweet-time"><a href="https://twitter.com/' + tweetusername + '/status/' + tweetid + '" target="_blank">' + relative_time(feeds[i].created_at) + '</a></span> ';
                        feedHTML += '' + status + '</p>';
                        if ((isaretweet === true) && (showretweetindicator === true)) {
                            feedHTML += '<div id="retweet-indicator"></div>';
                        }
                        if (showtweetactions === true) {
                            feedHTML += '<div id="twitter-actions"><div class="intent" id="intent-reply"><a href="https://twitter.com/intent/tweet?in_reply_to=' + tweetid + '" title="Reply"></a></div><div class="intent" id="intent-retweet"><a href="https://twitter.com/intent/retweet?tweet_id=' + tweetid + '" title="Retweet"></a></div><div class="intent" id="intent-fave"><a href="https://twitter.com/intent/favorite?tweet_id=' + tweetid + '" title="Favourite"></a></div></div>';
                        }

                        feedHTML += '</div>';
                        feedHTML += '</div>';


                        feedIndex += '<li data-target="#carousel-example-generic" data-slide-to="' + (displayCounter - 1) + '" class="' + carouselClass + '"></li>';
                        feedBody += '<div class="item ' + carouselClass + '"><div class="carousel-caption"><small class="text-muted">' + relative_time(feeds[i].created_at) + '</small> ' + status + '</div></div>';


                        displayCounter++;
                    }
                }
            }

            var twrap = '<div id="carousel-example-generic" class="carousel slide" data-ride="carousel"><!-- Indicators --><ol class="carousel-indicators">' + feedIndex + '</ol><!-- Wrapper for slides --><div class="carousel-inner">' + feedBody + '</div><!-- Controls --><a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a><a class="right carousel-control" href="#carousel-example-generic" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a></div>';

            $('#twitter-feed').html(twrap);
            $('.carousel').carousel();

            if (showtweetactions === true) {
                $('.twitter-article').hover(function() {
                    $(this).find('#twitter-actions').css({
                        'display': 'block',
                        'opacity': 0,
                        'margin-top': -20
                    });
                    $(this).find('#twitter-actions').animate({
                        'opacity': 1,
                        'margin-top': 0
                    }, 200);
                }, function() {
                    $(this).find('#twitter-actions').animate({
                        'opacity': 0,
                        'margin-top': -20
                    }, 120, function() {
                        $(this).css('display', 'none');
                    });
                });

                $('#twitter-actions a').click(function() {
                    var url = $(this).attr('href');
                    window.open(url, 'tweet action window', 'width=580,height=500');
                    return false;
                });
            }

        }).error(function(jqXHR, textStatus, errorThrown) {
        var error = '';
        if (jqXHR.status === 0) {
            error = 'Connection problem. Check file path and www vs non-www in getJSON request';
        } else if (jqXHR.status === 404) {
            error = 'Requested page not found. [404]';
        } else if (jqXHR.status === 500) {
            error = 'Internal Server Error [500].';
        } else if (errorThrown === 'parsererror') {
            error = 'Requested JSON parse failed.';
        } else if (errorThrown === 'timeout') {
            error = 'Time out error.';
        } else if (errorThrown === 'abort') {
            error = 'Ajax request aborted.';
        } else {
            error = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log('Error fetching twitter feed: ' + error);
    });


    function addlinks(data) {
        data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
            return '<a href="' + url + '"  target="_blank">' + url + '</a>';
        });

        data = data.replace(/\B@([_a-z0-9]+)/ig, function(reply) {
            return '<a href="http://twitter.com/' + reply.substring(1) + '" style="font-weight:lighter;" target="_blank">' + reply.charAt(0) + reply.substring(1) + '</a>';
        });
        data = data.replace(/\B#([_a-z0-9]+)/ig, function(reply) {
            return '<a href="https://twitter.com/search?q=' + reply.substring(1) + '" style="font-weight:lighter;" target="_blank">' + reply.charAt(0) + reply.substring(1) + '</a>';
        });
        return data;
    }


    function relative_time(time_value) {
        var values = time_value.split(' ');
        time_value = values[1] + ' ' + values[2] + ', ' + values[5] + ' ' + values[3];
        var parsed_date = Date.parse(time_value);
        var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
        var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
        var shortdate = time_value.substr(4, 2) + ' ' + time_value.substr(0, 3);
        delta = delta + (relative_to.getTimezoneOffset() * 60);

        if (delta < 60) {
            return '1m';
        } else if (delta < 120) {
            return '1m';
        } else if (delta < (60 * 60)) {
            return (parseInt(delta / 60)).toString() + 'm';
        } else if (delta < (120 * 60)) {
            return '1h';
        } else if (delta < (24 * 60 * 60)) {
            return (parseInt(delta / 3600)).toString() + 'h';
        } else if (delta < (48 * 60 * 60)) {
            return shortdate;
        } else {
            return shortdate;
        }
    }


})(jQuery);


function OpenAlbum(strAlbum, strTrack) {

    var albumSelector = '';
    var albumTrackList = '';
    var albumCoverUrl = '';
    var albumTitle = '';



    var TrackSelected;

    var albumiTunesID = '';
    var albumiTunesSlug = '';
    var albumSpotifyID = '';

    var iTunesUrl = '';
    var spotifyUrl = '';
    var reverbNationUrl = '';
    var reverbNationSlug = '';

    var bandCampUrl = '';
    var bandCampSlug = '';
    var soundCloudUrl = '';

    var trackTitle = '';

    $('.popover').remove();

    $.ajaxSetup({
        cache: true
    });
    // alert(strAlbum)
    $.getJSON('/json/albums.json',
        function(data) {
            $.each(data.albums, function(i, item) {
                var albumName = item.Name;
                var albumID = item.ID;
                var albumCover = item.Cover;

                if (strAlbum === albumID) {
                    albumSelector += '<a href="javascript:;" onclick="OpenAlbum(\'' + albumID + '\', \'01\')"><img src="' + albumCover + '" class="active" style="width:50px;" /></a> ';
                    albumTitle = albumName;
                    albumCoverUrl = albumCover;

                    albumiTunesID = item.iTunesID;
                    albumiTunesSlug = item.iTunesSlug;

                    var Tracks = item.Tracks;
                    for (var t = 0; t < Tracks.length; t++) {
                        if (strTrack === Tracks[t].number) {
                            TrackSelected = Tracks[t];

                            iTunesUrl = Tracks[t].itunes;
                            spotifyUrl = Tracks[t].spotify;
                            reverbNationUrl = Tracks[t].reverbnation;
                            reverbNationSlug = Tracks[t].reverbslug;
                            bandCampUrl = Tracks[t].bandcamp;
                            bandCampSlug = Tracks[t].bandcampslug;
                            soundCloudUrl = Tracks[t].soundcloud;

                            trackTitle = '<small class="text-muted">' + Tracks[t].number + '</small> ' + Tracks[t].title + ' <small class="text-muted">' + Tracks[t].duration + '</small> ';


                            albumTrackList += '<li class="active"><small>' + Tracks[t].number + '</small> <span class="glyphicon glyphicon-play"></span> ' + Tracks[t].title + ' <small class="text-muted">' + Tracks[t].duration + '</small></li>';

                        } else {
                            albumTrackList += '<li onclick="OpenAlbum(\'' + albumID + '\', \'' + Tracks[t].number + '\');"><small class="text-muted">' + Tracks[t].number + '</small> ' + Tracks[t].title + ' <small class="text-muted">' + Tracks[t].duration + '</small></li>';
                        }

                    }
                } else {
                    albumSelector += '<a href="javascript:;" onclick="OpenAlbum(\'' + albumID + '\', \'01\')"><img src="' + albumCover + '" style="width:50px;" /></a> ';
                }
            });


            var s = '<div id="playerouter" data-container="body" data-toggle="popover" data-placement="left" data-content="Press PLAY to start the track ...">';
            var d = '';

            if (reverbNationUrl.length > 0) {
                s += '<iframe class="widget_iframe" src="http://www.reverbnation.com/widget_code/html_widget/artist_2828114?widget_id=50&pwc[design]=customized&pwc[background_color]=%23000000&pwc[included_songs]=0&pwc[song_ids]=' + reverbNationUrl + '&pwc[photo]=0&pwc[size]=fit" width="100%" height="80" frameborder="0" scrolling="no"></iframe>';
            } else if (spotifyUrl.length > 0) {
                s += ' <iframe class="widget_iframe"  src="https://embed.spotify.com/?uri=spotify:track:' + spotifyUrl + '&theme=dark&view=list" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>';
            } else if (iTunesUrl.length > 0) {

            } else if (bandCampUrl.length > 0) {
                s += '<iframe style="border: 0; width: 100%; height: 142px;" src="http://bandcamp.com/EmbeddedPlayer/track=' + bandCampUrl + '/size=large/bgcol=333333/linkcol=ffffff/tracklist=false/artwork=none/transparent=true/" seamless><a href="http://officialmydyingday.bandcamp.com/track/nihilism">Nihilism by my dyingDay</a></iframe>';
            } else if (soundCloudUrl.length > 0) {
                s += '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + soundCloudUrl + '&amp;auto_play=true&amp;hide_related=true&amp;visual=false&amp;show_artwork=false"></iframe>';
            }

            s += '</div>';




            if (reverbNationUrl.length > 0) {
                d += '<a href="http://www.reverbnation.com/mydyingday/song/' + reverbNationUrl + '-' + reverbNationSlug + '" target="_blank"><img src="' + staticDomain + '/img/badge_reverb-lrg.png" /></a> ';
            }

            if (iTunesUrl.length > 0) {
                d += '<a href="http://itunes.apple.com/dk/album/' + albumiTunesSlug + '/id' + albumiTunesID + '?i=' + iTunesUrl + '" target="_blank"><img src="' + staticDomain + '/img/badge_itunes-lrg.png" /></a> ';
            }

            if (spotifyUrl.length > 0) {
                d += '<a href="https://play.spotify.com/track/' + spotifyUrl + '" target="_blank"><img src="' + staticDomain + '/img/badge_spotify-lrg.png" /></a> ';
            }

            if (bandCampUrl.length > 0) {
                d += '<a href="http://officialmydyingday.bandcamp.com/track/' + bandCampSlug + '" target="_blank"><img src="' + staticDomain + '/img/badge_bandcamp-lrg.png" /></a> ';
            }

            d = '<div class="playerdownloadicons">' + d + '</div>';


            $('#playermodaltitle').html(albumTitle);
            $('#playermodalbody').html('<div class="pull-left playercover"><div class="coverwrapper"><img src="' + albumCoverUrl + '" style="width:100%;" /></div><div id="playeralbums">' + albumSelector + '</div></div><div class="pull-left playercontentcol"><div class="playercontenttitle"><h4>' + trackTitle + '</h4></div>' + s + ' ' + d + '<ul class="albumtracklist"><li class="tracklistheader">Tracklist:</li>' + albumTrackList + '</ul></div><div class="clearfix"></div>');

            $('#playerwin').modal('show');



            setTimeout(function() {
                $('#playerouter').popover('show');
                setTimeout(function() {
                    $('#playerouter').popover('hide');
                }, 2000);
            }, 1000);




            $('#playerwin').on('hide.bs.modal', function(e) {
                $('.popover').remove();
            });


        }).error(function(jqXHR, textStatus, errorThrown) {
        var error = '';
        if (jqXHR.status === 0) {
            error = 'Connection problem. Check file path and www vs non-www in getJSON request';
        } else if (jqXHR.status === 404) {
            error = 'Requested page not found. [404]';
        } else if (jqXHR.status === 500) {
            error = 'Internal Server Error [500].';
        } else if (errorThrown === 'parsererror') {
            error = 'Requested JSON parse failed.';
        } else if (errorThrown === 'timeout') {
            error = 'Time out error.';
        } else if (errorThrown === 'abort') {
            error = 'Ajax request aborted.';
        } else {
            error = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        console.log('Error fetching album data: ' + error);
    });


}

function playVideo(idVid, title) {
    $('#videoplayer').html('<div style="padding:100px;text-align:center;font-size:20px;">Loading video ...</div>');
    var s = '<div style="background-color:rgba(0, 0, 0, 0.5);;border-top:1px solid #FFF"><div class="container"><div class="pull-left" style="width:80%; overflow:hidden;"><h3><span class="glyphicon glyphicon-expand" ></span> Video: ' + title + '</h3></div><div class="pull-right"><span class="close" onclick="$(\'#videoplayer\').html(\'\');" style="font-size: 51px;font-weight: bold;line-height: 1;color: #FFF;text-shadow: 0 1px 0 #fff;opacity: .9;filter: alpha(opacity=90);">&times;</span></div></div></div><div style="border-bottom:1px solid #FFF;padding-bottom:20px;margin-bottom:15px;background-color:rgba(0, 0, 0, 0.5);"><div class="videoembed"><div class="videowrapper"><div class="videocontainer"><iframe class="videoembedx youtube" src="//www.youtube.com/embed/' + idVid + '" frameborder="0" allowfullscreen=""></iframe></div></div></div></div>';
    $('#videoplayer').html(s);


}
