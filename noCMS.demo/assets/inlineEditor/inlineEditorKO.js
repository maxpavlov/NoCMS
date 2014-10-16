﻿app.EditorLogicKO = (function ($) {
    "use strict";

    function InlineEditorViewModel(element, isInAdminMode) {
        var self = this;
        self.element = element;

        self.IsInAdminMode = isInAdminMode;
        self.IsInAdminMode.subscribe(function(newVal) {
            self.ShowEditAllowed(newVal);
            self.ShowSaveAllowed(newVal);
        });

        self.ShowEditAllowed = ko.observable(self.IsInAdminMode());
        self.ShowSaveAllowed = ko.observable(self.IsInAdminMode());
        self.EditButtonVisible = ko.observable(false);
        self.SaveButtonVisible = ko.observable(false);
        self.ShowEditButton = function() {
            if (self.ShowEditAllowed()) {
                self.EditButtonVisible(true);
            }
        };

        self.HideEditButton = function() {
            self.EditButtonVisible(false);
        };

        self.ShowSaveButton = function() {
            if (self.ShowSaveAllowed()) {
                self.SaveButtonVisible(true);
            }
        };

        self.HideSaveButton = function() {
            self.SaveButtonVisible(false);
        };

        self.EnableEdit = function() {
            self.ShowEditAllowed(false);
            self.HideEditButton();
            var editableBlock = $(element).find('.editable-block')[0];
            $(editableBlock).attr('contenteditable', 'true');
            self.editor = CKEDITOR.inline(editableBlock);

            self.editor.on('blur', function() {
                self.ShowSaveAllowed(true);
                self.ShowSaveButton();
            });
        };


        self.SaveEditedContent = function() {
            self.ShowSaveAllowed(false);
            self.HideSaveButton();
            $.ajax({
                url: $('#SaveContentUrl').val(),
                global: false,
                type: "POST",
                data: {
                    key: window.location.pathname + '#' + element.id,
                    data: self.editor.getData()
                }
            }).done(function(resp) {
                if (resp.res == "OK") {
                    self.ShowEditAllowed(true);
                } else {
                    alert(resp.message);
                }
            });


        };
    }

    var init = function(isInAdminMode) {

        window.CKEDITOR_BASEPATH = "/Content/inlineEditor/ckeditor";

        CKEDITOR.on('instanceReady', function(event) {
            event.editor.focus();
        });
        CKEDITOR.on('instanceCreated', function(event) {
            var editor = event.editor,
                element = editor.element;

            editor.on('configLoaded', function() {

                editor.config.language = 'ru';

                editor.config.font_names = editor.config.font_names + ';MyriadPro/MyriadPro-Regular;' + 'MyriadPro Bold/MyriadPro-Bold';

                // Remove unnecessary plugins to make the editor simpler.
                //editor.config.removePlugins = 'colorbutton,find,flash,font,' +
                //    'forms,iframe,image,newpage,removeformat,' +
                //    'smiley,specialchar,stylescombo,templates';

                editor.config.extraPlugins = 'fastimage,div';

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
                    { name: 'radacode', items: ['fastimage', 'div', 'youtube'] }
                ];
            });


            $(".editable-wrapper").each(function() {
                ko.applyBindings(new InlineEditorViewModel(this, app.IsInAdminMode), this);
            });


            return { init: init };
        }($));
    };

    app.EditorLogic = (function ($) {
        "use strict";

        var ready = $(function() {
            app.EditorLogicKO.init(app.IsInAdminMode);
        });
    });
    }($));