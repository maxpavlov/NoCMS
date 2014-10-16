app.PageHeaderLogic = (function ($) {
    "use strict";

    function pageHeaderViewModel(data) {
        var self = this;

        self.PageKey = ko.observable(data.PageKey);
        self.LinkPath = ko.observable(data.LinkPath);
        self.Version = ko.observable(data.Version);
        self.VideoSrc = ko.observable("/assets/ObligContent/PageVideos/" + self.PageKey() + ".mp4?v=" + self.Version());

        self.IsHomePage = ko.observable(data.IsHomePage);
        self.IsDarkColor = ko.observable(data.IsDarkColor);

        self.WatchTextStyle = ko.computed(function() {
            return self.IsDarkColor() ? 'watch-text-dark' : 'watch-text-light';
        });

        self.LinkPath.subscribe(function () {
            self.UpdatePageHeader();
        });

        self.UpdatePageHeader = function () {
            app.Root.IsLoadingVisible(true);

            var updatePageHeaderUrl = $('#UpdatePageHeaderUrl').val();
            $.ajax({
                type: 'POST',
                url: updatePageHeaderUrl,
                data: {
                    linkPath: self.LinkPath(),
                    pageKey: self.PageKey()
                },
                success: function (res) {
                    if (res.status === "OK") {
                        app.Root.IsLoadingVisible(false);
                    } else {
                        alert("There was an error update the item");
                    }
                }
            });
        };

        self.uploadItemMovie = function (e) {
            app.Root.IsLoadingVisible(true);

            var fd = new window.FormData();
            fd.append('file', e);
            $.ajax({
                type: 'POST',
                url: $('#FileHandlerUrl').val() + "?VideoId=" + self.PageKey(),
                data: fd,
                processData: false,
                contentType: false,
                success: function () {
                    self.Version(self.Version() + 1);

                    self.VideoSrc("/assets/ObligContent/PageVideos/" + self.PageKey() + ".mp4?v=" + self.Version());
                    app.Root.IsLoadingVisible(false);
                    $('#video-wrap').html("");
                    self.InitVideoContainer();
                }
            });
        };

        self.Player = {
            Video: null,
            SoundState: function () {
                var item = $("#video-container");

                if ($.cookie('sound-state') == 'mute') {

                    item.find('.unmute').addClass('mute');
                    self.Player.Video.muted = true;

                } else if ($.cookie('sound-state') == 'unmute') {
                    self.Player.Video.muted = false;

                    $(this).removeClass('mute');
                }
            }
        };

        self.InitVideoContainer = function () {
            var url = $("#GetVideoPageUrl").val();
            $.ajax({
                url: url,
                cache: false,
                type: "POST",
                success: function (data) {
                    $('#video-wrap').html(data);
                    var logo = document.getElementById('video');
                    logo.setAttribute('src', app.PageHeaderLogic.ViewModel.VideoSrc());
                    app.PageHeaderLogic.ViewModel.InitVideoPlayer();

                },
                error: function (reponse) {
                    alert("error : " + reponse);
                }
            });
        };

        self.InitVideoPlayer = function (reload) {
            var item = $("#video-container");

            $("#video").bind("loadedmetadata", function () {
                self.Player.Video = $(this)[0];
                var $video = $(this);
                var $videoProgress = item.find('.video-progress');
                var $videoControls = item.find('.video-controls');
                var width = $(window).width() / 100 * parseInt($(".ui.modal").css('width'));
                var $videoWidth = width - 80;
                $videoControls.css("width", ($videoWidth) + "px");



                self.Player.updProgWidth = 0;

                $videoProgress.width($videoControls.width() - 25);

                if ($videoProgress.width() > $videoWidth - 25) {
                    $videoProgress.width($videoProgress.width() - ($videoWidth - $videoProgress.width()));
                }

                self.Player.progWidth = $videoProgress.width() - 7;

                // The timing function, updates the time.
                var timeUpdate = function ($ignore) {

                    // The current time of the video based on progress bar position
                    var time = Math.round((item.find('.progress-bar').width() / self.Player.progWidth) * self.Player.Video.duration);

                    // The 'real' time of the video
                    var curTime = self.Player.Video.currentTime;

                    // Updated progress width
                    self.Player.updProgWidth = (curTime / self.Player.Video.duration) * self.Player.progWidth;

                    // A variable set which we'll use later on
                    if ($ignore != true) {
                        item.find('.progress-bar').css({ 'width': (self.Player.updProgWidth) + 'px' });
                        item.find('.progress-button').css({ 'left': ((self.Player.updProgWidth)) + 'px' });
                    }

                    // If playing update buffer value
                    if (self.Player.Video.currentTime > 0 && self.Player.Video.paused == false && self.Player.Video.ended == false) {

                    }

                };

                // Run the timing function twice, once on init and again when the time updates.
                timeUpdate();

                $video.unbind('timeupdate');
                self.Player.Video.addEventListener('timeupdate', timeUpdate);

                item.find('.play-pause-button').unbind('click');
                // When the user clicks play, bind a click event	
                item.find('.play-pause-button').bind('click', function () {

                    if (self.Player.Video.paused || self.Player.Video.ended) {
                        self.Player.Video.play();

                        $(this).addClass('played').removeClass('paused');
                    } else {
                        self.Player.Video.pause();

                        $(this).addClass('paused').removeClass('played');
                    }
                });

                self.Player.SoundState();

                item.find('.unmute').unbind('click');
                item.find('.unmute').bind('click', function () {

                    if (self.Player.Video.muted) {
                        self.Player.Video.muted = false;

                        $.cookie('sound-state', 'unmute', { path: '/' });
                        $(this).removeClass('mute');
                    } else {
                        self.Player.Video.muted = true;

                        $.cookie('sound-state', 'mute', { path: '/' });
                        $(this).addClass('mute');
                    }
                });


                $videoProgress.unbind('mousedown');
                // Bind a function to the progress bar so the user can select a point in the video
                $videoProgress.bind('mousedown', function (e) {

                    // The x position of the mouse in the progress bar 
                    var x = e.pageX - $videoProgress.offset().left;

                    // Update current time
                    var currentTime = (x / self.Player.progWidth) * self.Player.Video.duration;

                    self.Player.Video.currentTime = currentTime;
                });

                $video.unbind('ended');
                // When the video ends the play button becomes a pause button
                self.Player.Video.addEventListener('ended', function () {
                    item.find('.play-pause-button').addClass('paused').removeClass('played');
                });

                if (reload) {
                    item.find('.play-pause-button').addClass('paused').removeClass('played');
                }

            });

        };

        self.StopVideo = function () {

            if (self.Player.Video != null) {

                app.PageHeaderLogic.ViewModel.Player.Video.pause();
                app.PageHeaderLogic.ViewModel.Player.Video.currentTime = 0;
            } else {

                var vid = document.getElementById("video");
                vid.pause();
                vid.currentTime = 0;
            }

        };
        self.PlayVideo = function () {


            if (self.Player.Video != null) {
                if ($.cookie('sound-state') == null) {
                    self.Player.Video.muted = false;
                    $.cookie('sound-state', 'unmute', { path: '/' });
                }
                $(".ui.dimmer").css("visibility", "visible");
                $("#video-wrap").show();
                $('.modal').modal({
                    selector: {
                        close: '#close-video'
                    },

                }).modal("show");
                $('.modal').modal({
                    onHide: function () { // при закрытии окна будет останавливаться видео
                        self.StopVideo();
                    },
                });

                self.Player.Video.play();
            } else {
                alert("Video not found...");
            }


        };
    }

    var constructorFunction = function () {
        var initialDataObject = $.parseJSON($("#initial-pageheader").val());
        $("#initial-pageheader").remove();

        app.PageHeaderLogic.ViewModel = new pageHeaderViewModel(initialDataObject);
        ko.applyBindings(app.PageHeaderLogic.ViewModel, document.getElementById("top-bleen-controls"));
    };

    return { init: constructorFunction };
}($));

app.PageHeader = (function ($) {
    "use strict";

    $(function () {

    });

    $(function () {
        app.PageHeaderLogic.init();
        $('.modal').modal({ duration: 0 });
        app.PageHeaderLogic.ViewModel.InitVideoContainer();

    });

}($));
