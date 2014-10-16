var app = window.app || { models: {} };
app.Lang = RadaCode.Lang;

app.GlobalLogic = (function ($) {
    "use strict";

    function appRootViewModel() {
        var self = this;

        self.IsLoadingVisible = ko.observable(false);
    }

   

    var ready = $(function() {
        app.NoCountryRedirectQueryStringParameter = $('#no-redirect-qs-param').val();
        app.IsInAdminMode = ko.observable($('#is-in-admin-mode').val() != "False");
        app.CurrentLanguage = ko.observable($('#current-language').val());
        app.DefaultLanguage = ko.observable($('#default-language').val());

        app.IsLoadingVisible = ko.observable(false);

        app.CurrentLanguageAlias = ko.computed(function () {
                return app.CurrentLanguage() + '/';
        });

        document.onkeydown = function (e) {
            e = e || event;
            if (e.ctrlKey && e.keyCode == 13) {
                $("html, body").animate({ scrollTop: 0 }, "slow");
                $('.admin-wrap').slideToggle();
                return false;
            }
            return e;
        };

        app.CurrentLanguage.subscribe(function(newLang) {
            var supportedLanguages = $.parseJSON($("#supported-languages").val());

            var curPath = location.pathname;

            var firstElementInPath = curPath.substring(1, 6).toLowerCase();

            var isLanguage = ($.inArray(firstElementInPath, supportedLanguages) != -1);

            if (isLanguage) {
                curPath = location.pathname.substr(6);
            }

            var noRedirectCookieName = $('#no-redirect-cookie-name').val();

            $.removeCookie(noRedirectCookieName, { path: '/' });

            var resHref = location.origin + '/' + newLang.toLowerCase() + curPath + '?' + 'doNCR';
            location.href = resHref;
        });
        

        app.GetUrl = $('#GetContentUrl').val();
        app.SaveUrl = $('#SaveContentUrl').val();
        app.OnConfigLoaded = function (editor) {
            editor.config.language = 'en';
            editor.config.font_names = 'Archive;' + 'Open Sans Light';
            editor.config.extraPlugins = 'fastimage,div,youtube,rdcgallery,rdcimage';


            // Rearrange the layout of the toolbar.
            editor.config.toolbar = [
                { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                { name: 'colors', items: ['TextColor', 'BGColor'] },
                '/',
                { name: 'clipboard', groups: ['clipboard', 'undo'], items: ['PasteText', '-', 'Undo', 'Redo'] },
                { name: 'editing', items: ['Bold', 'Italic', '-', 'Link', 'Unlink'] },
                '/',
                { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
                { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
                { name: 'links', items: ['Link', 'Unlink'] },
                '/',

                { name: 'radacode', items: ['fastimage', 'Templates', 'Youtube', 'Table', 'rdcimage'] }
            ];
        };

        app.UrlExists = function(url)
        {
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            return http.status!=404;
        }
    });

    app.Root = new appRootViewModel();

    ko.bindingHandlers.stopBinding = {
        init: function () {
            return { controlsDescendantBindings: true };
        }
    };

    ko.virtualElements.allowedBindings.stopBinding = true;
    ko.applyBindings(app.Root);

}($));


