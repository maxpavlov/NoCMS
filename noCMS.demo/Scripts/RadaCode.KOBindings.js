$(function () {

    /* DESCRIPTION FOR radacodeRichEditor binding
		Used to bind RichEditor to div
	*/
    /* USAGE EXAMPLE FOR radacodeRichEditor binding
		<div data-bind="radacodeRichEditor: { getUrl: GetUrl, saveUrl: SaveUrl, id: Id, isEditable: IsInAdminMode, onConfigLoaded: OnConfigLoaded, selectByCountry: true/false }">
			
		</div>
	 */
    ko.bindingHandlers.radacodeRichEditor = {

        init: function (element, valueAccessor, allBindingsAccessor) {
            function radacodeRichEditorViewModel(element, isInAdminMode, getUrl, saveUrl, contentId, onLoaded, byCountry ) {
                var self = this;
                self.element = element;

                self.IsInAdminMode = isInAdminMode;
                self.IsInAdminMode.subscribe(function (newVal) {
                    self.ShowEditAllowed(newVal);
                    self.ShowSaveAllowed(newVal);
                });

                self.ShowEditAllowed = ko.observable(self.IsInAdminMode());
                self.ShowSaveAllowed = ko.observable(self.IsInAdminMode());
                self.EditButtonVisible = ko.observable(true);
                self.SaveButtonVisible = ko.observable(false);
                self.ShowEditButton = function () {
                    if (self.ShowEditAllowed()) {
                        self.EditButtonVisible(true);
                    }
                };

                self.HideEditButton = function () {
                    self.EditButtonVisible(false);
                    self.SaveButtonVisible(true);
                };

                self.ShowSaveButton = function () {
                    if (self.ShowSaveAllowed()) {
                        self.SaveButtonVisible(true);
                    }
                };

                self.HideSaveButton = function () {
                    self.SaveButtonVisible(false);
                };

                self.EnableEdit = function () {
                    //$(document).unbind('click.fb-start'); // выключаем fancybox на время  редактирования контента

                    self.ShowEditAllowed(false);
                    self.HideEditButton();
                    var editableBlock = $(element).find('.editable-block')[0];
                    $(editableBlock).attr('contenteditable', 'true');
                    self.editor = CKEDITOR.inline(editableBlock);

                    onLoaded(self.editor);
                    self.editor.on('blur', function () {
                        self.ShowSaveAllowed(true);
                        self.ShowSaveButton();
                    });
                };


                self.SaveEditedContent = function () {
                    //$('.fancybox-image-container').fancybox(); // и вновь включаем fancybox
                    self.editor.destroy();
                    self.ShowSaveAllowed(false);
                    self.HideSaveButton();
                    var editableBlock = $(element).find('.editable-block')[0];
                    $(editableBlock).attr('contenteditable', 'false');
                    $.ajax({
                        url: saveUrl,
                        global: false,
                        type: "POST",
                        data: {
                            key: contentId,
                            data: self.editor.getData(),
                            byCountry: byCountry
                        }
                    }).done(function (res) {
                        if (res.res == "OK") {
                            self.ShowEditAllowed(true);
                            var galleryElement = $("#" + contentId).find(".radacode-gallery");
                            for (var i = 0; i < galleryElement.length; i++) {
                                if (galleryElement[i].id != null) // если
                                    ko.applyBindings(new function () { }, document.getElementById(galleryElement[i].id)); //инитим заново галерею при сохранении контента
                            }

                        } else {
                            alert(res.error);
                        }

                    });
                };
            };

            var shouldEnableEdit = ko.utils.unwrapObservable(valueAccessor().isEditable);
            var getContentUrl = ko.utils.unwrapObservable(valueAccessor().getUrl);
            var saveContentUrl = ko.utils.unwrapObservable(valueAccessor().saveUrl);
            var contentId = ko.utils.unwrapObservable(valueAccessor().id);
            var onLoaded = ko.utils.unwrapObservable(valueAccessor().onConfigLoaded);
            var byCountry = ko.utils.unwrapObservable(valueAccessor().selectByCountry);

            var editableDiv;
            if (shouldEnableEdit) {

                editableDiv = $("<div id='" + contentId + "' class='editable-wrapper'><div class='editable-block'></div><button class='btn edit-button ' " +
                    "type='button' data-bind='click: EnableEdit, fadeVisible: EditButtonVisible'><span>Edit</span></button><button class='btn save-button '" +
                    " type='button' data-bind='click: SaveEditedContent, fadeVisible: SaveButtonVisible'><span>Save</span></button></div>");
            }

            else {
                editableDiv = $("<div id='" + contentId + "' class='editable-wrapper'><div class='editable-block'></div></div>");
            }
            $(element).prepend(editableDiv);

            window.CKEDITOR_BASEPATH = "/assets/inlineEditor/ckeditor/";
            CKEDITOR.on('instanceCreated', function (event) {
                var editor = event.editor;

                onLoaded(editor);
            });
            CKEDITOR.on('instanceReady', function (event) {
                event.editor.focus();
            });
            editableDiv = $(element).children().first();
            $('#loading-container').show();
            $.ajax({
                type: 'GET',
                url: getContentUrl,
                data: {
                    key: contentId,
                    byCountry: byCountry
                },
                success: function (res) {
                    editableDiv.children('.editable-block').html(res);
                    var viewModel = new radacodeRichEditorViewModel(element, app.IsInAdminMode, getContentUrl, saveContentUrl, contentId, onLoaded, byCountry);
                    ko.applyBindings(viewModel, editableDiv[0]);
                    $('#loading-container').hide();
                }
            });



        }
    };



    ko.bindingHandlers.fade = {

        init: function (element, valueAccessor) {
            // initially don't show the element        
            $(element).hide();
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (typeof element.attributes.src == 'undefined') { // если первый запуск
                $(element).attr("src", value); // запускаем картинку сразу без блика
            } else {
                $(element).fadeOut(100, function () {
                    $(element).attr("src", value);
                    $(element).fadeIn(100);
                });
            }

        }
    };


    /* DESCRIPTION FOR globalLoading binding
	Used to bind standard loading panel functionality to an element
	*/
    /* USAGE EXAMPLE FOR globalLoading binding
		<div data-bind="globalLoading: IsLoading">
			I am a loading panel
		</div>
	 */

    ko.bindingHandlers.globalLoading = {
        init: function (element, valueAccessor) {

            var isLoading = valueAccessor();
            if (isLoading()) {
                var height = $(document).height();
                $(element).css('height', height);
                $(element).css('display', 'block');

            } else {
                $(element).delay(200).queue(function (next) {
                    $(this).css('display', 'none');
                    next();
                });
            }
        },
        update: function (element,
			valueAccessor) {

            var isLoading = valueAccessor();
            if (isLoading()) {
                var height = $(document).height();
                $(element).css('height', height);
                $(element).css('display', 'block');

            } else {
                $(element).delay(200).queue(function (next) {
                    $(this).css('display', 'none');
                    next();
                });
            }
        }
    };

    /* DESCRIPTION FOR singleClick binding
		Used to replace standard click binding to allow smart sinlge click and double click procession
	*/
    /* USAGE EXAMPLE FOR singleClick binding
		<div data-bind="singleClick: clicked, event : { dblclick: double }">
			Click Me
		</div>
	 */
    ko.bindingHandlers.singleClick = {
        init: function (element, valueAccessor) {
            var handler = valueAccessor(),
				delay = 200,
				clickTimeout = false;

            $(element).click(function () {
                if (clickTimeout !== false) {
                    clearTimeout(clickTimeout);
                    clickTimeout = false;
                } else {
                    clickTimeout = setTimeout(function () {
                        clickTimeout = false;
                        handler();
                    }, delay);
                }
            });
        }
    };


    ko.bindingHandlers.inlineTextArea = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var target = $(element);
            var input = $('<textarea />', { 'class': target.attr('class') + ' inline-input', 'style': 'display:none' });

            ko.applyBindingsToNode(target.get(0), { html: valueAccessor() });

            var shouldEnableEdit = ko.utils.unwrapObservable(allBindingsAccessor().inAdminMode);
            if (shouldEnableEdit) {

                target.after(input);

                ko.applyBindingsToNode(input.get(0), { value: valueAccessor() });

                target.click(function () {
                    input.width(target.width());
                    target.hide();
                    input.show();
                    input.focus();
                });

                input.blur(function () {
                    target.show();
                    input.hide();
                });

                input.keypress(function (e) {
                    if (e.keyCode == 13) {
                        target.show();
                        input.hide();
                    }
                    ;
                });
            }
        }
    };

    ko.bindingHandlers.inlineInputDoubleClick = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var target = $(element);
            var input = $('<input />', { 'type': 'text', 'class': target.attr('class') + ' inline-input', 'style': 'display:none' });

            ko.applyBindingsToNode(target.get(0), { html: valueAccessor() });

            var shouldEnableEdit = ko.utils.unwrapObservable(allBindingsAccessor().inAdminMode);
            if (shouldEnableEdit) {

                target.after(input);

                ko.applyBindingsToNode(input.get(0), { value: valueAccessor() });

                target.dblclick(function () {
                    input.width(target.width());
                    target.hide();
                    input.show();
                    input.focus();
                });

                input.blur(function () {
                    target.show();
                    input.hide();
                });

                input.keypress(function (e) {
                    if (e.keyCode == 13) {
                        target.show();
                        input.hide();
                    }
                    ;
                });
            }
        }
    };

    ko.bindingHandlers.inlineInput = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var target = $(element);
            var input = $('<input />', { 'type': 'text', 'class': target.attr('class') + ' inline-input', 'style': 'display:none' });

            ko.applyBindingsToNode(target.get(0), { html: valueAccessor() });

            var shouldEnableEdit = ko.utils.unwrapObservable(allBindingsAccessor().inAdminMode);
            if (shouldEnableEdit) {

                target.after(input);

                ko.applyBindingsToNode(input.get(0), { value: valueAccessor() });

                target.click(function () {
                    input.width(target.width());
                    target.hide();
                    input.show();
                    input.focus();
                });

                input.blur(function () {
                    target.show();
                    input.hide();
                });

                input.keypress(function (e) {
                    if (e.keyCode == 13) {
                        target.show();
                        input.hide();
                    }
                    ;
                });
            }
        }
    };

    /* USAGE EXAMPLE FOR jqAutocomple binding

	<input data-bind="jqAuto: { autoFocus: true },  
				jqAutoSource: CodesContainer,
				jqAutoQuery: GetCodes, 
				jqAutoValue: CurrentCode" />

				*/

    //jqAuto -- main binding (should contain additional options to pass to autocomplete)
    //jqAutoSource -- the array to populate with choices (needs to be an observableArray)
    //jqAutoQuery -- function to return choices
    //jqAutoValue -- where to write the selected value
    //jqAutoSourceLabel -- the property that should be displayed in the possible choices
    //jqAutoSourceInputValue -- the property that should be displayed in the input box
    //jqAutoSourceValue -- the property to use for the value
    ko.bindingHandlers.jqAuto = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var options = valueAccessor() || {},
				allBindings = allBindingsAccessor(),
				unwrap = ko.utils.unwrapObservable,
				modelValue = allBindings.jqAutoValue,
				source = allBindings.jqAutoSource,
				query = allBindings.jqAutoQuery,
				valueProp = allBindings.jqAutoSourceValue,
				inputValueProp = allBindings.jqAutoSourceInputValue || valueProp,
				labelProp = allBindings.jqAutoSourceLabel || inputValueProp;

            //function that is shared by both select and change event handlers
            function writeValueToModel(valueToWrite) {
                if (ko.isWriteableObservable(modelValue)) {
                    modelValue(valueToWrite);
                } else {  //write to non-observable
                    if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['jqAutoValue'])
                        allBindings['_ko_property_writers']['jqAutoValue'](valueToWrite);
                }
            }

            //on a selection write the proper value to the model
            options.select = function (event, ui) {
                writeValueToModel(ui.item ? ui.item.actualValue : null);
            };

            //on a change, make sure that it is a valid value or clear out the model value
            options.change = function (event, ui) {
                var currentValue = $(element).val();
                var matchingItem = ko.utils.arrayFirst(unwrap(source), function (item) {
                    return unwrap(inputValueProp ? item[inputValueProp] : item) === currentValue;
                });

                if (!matchingItem) {
                    writeValueToModel(null);
                }
            };

            //hold the autocomplete current response
            var currentResponse = null;

            //handle the choices being updated in a DO, to decouple value updates from source (options) updates
            var mappedSource = ko.dependentObservable({
                read: function () {
                    var mapped = ko.utils.arrayMap(unwrap(source), function (item) {
                        var result = {};
                        result.label = labelProp ? unwrap(item[labelProp]) : unwrap(item).toString();  //show in pop-up choices
                        result.value = inputValueProp ? unwrap(item[inputValueProp]) : unwrap(item).toString();  //show in input box
                        result.actualValue = valueProp ? unwrap(item[valueProp]) : item;  //store in model
                        return result;
                    });
                    return mapped;
                },
                write: function (newValue) {
                    source(newValue);  //update the source observableArray, so our mapped value (above) is correct
                    if (currentResponse) {
                        currentResponse(mappedSource());
                    }
                },
                disposeWhenNodeIsRemoved: element
            });

            if (query) {
                options.source = function (request, response) {
                    currentResponse = response;
                    query.call(this, request.term, mappedSource);
                };
            } else {
                //whenever the items that make up the source are updated, make sure that autocomplete knows it
                mappedSource.subscribe(function (newValue) {
                    $(element).autocomplete("option", "source", newValue);
                });

                options.source = mappedSource();
            }


            //initialize autocomplete
            $(element).autocomplete(options);
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            //update value based on a model change
            var allBindings = allBindingsAccessor(),
				unwrap = ko.utils.unwrapObservable,
				modelValue = unwrap(allBindings.jqAutoValue) || '',
				valueProp = allBindings.jqAutoSourceValue,
				inputValueProp = allBindings.jqAutoSourceInputValue || valueProp;

            //if we are writing a different property to the input than we are writing to the model, then locate the object
            if (valueProp && inputValueProp !== valueProp) {
                var source = unwrap(allBindings.jqAutoSource) || [];
                var modelValue = ko.utils.arrayFirst(source, function (item) {
                    return unwrap(item[valueProp]) === modelValue;
                }) || {};
            }

            //update the element with the value that should be shown in the input
            $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());
        }
    };

    ko.bindingHandlers.timeago = {
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var $this = $(element);

            // Set the title attribute to the new value = timestamp
            $this.attr('title', value);

            // If timeago has already been applied to this node, don't reapply it -
            // since timeago isn't really flexible (it doesn't provide a public
            // remove() or refresh() method) we need to do everything by ourselves.
            if ($this.data('timeago')) {
                var datetime = $.timeago.datetime($this);
                var distance = (new Date().getTime() - datetime.getTime());
                var inWords = $.timeago.inWords(distance);

                // Update cache and displayed text..
                $this.data('timeago', { 'datetime': datetime });
                $this.text(inWords);
            } else {
                // timeago hasn't been applied to this node -> we do that now!
                $this.timeago();
            }
        }
    };

    ko.bindingHandlers.chosen = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            var allBindings = allBindingsAccessor();
            var attrList = { placeholderText: options.PlaceholderText };
            $.extend(attrList, allBindings.chosen);
            if (options.AddPlaceholder) {
                $(element).attr('data-placeholder', attrList.placeholderText).addClass('chzn-select');
            } else {
                $(element).addClass('chzn-select');
            }
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            $(element).chosen(options.ChosenOptions);
            $(element).trigger("liszt:updated");
        }
    };

    ko.bindingHandlers.datepicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            //initialize datepicker with some optional options
            var options = allBindingsAccessor().datepickerOptions || {};

            var initialize = true;

            if ((allBindingsAccessor().inAdminMode !== undefined)) {
                initialize = ko.utils.unwrapObservable(allBindingsAccessor().inAdminMode);
            }

            if (initialize) {

                $(element).datepicker(options);

                //handle the field changing
                ko.utils.registerEventHandler(element, "change", function () {
                    var observable = valueAccessor();
                    if (!options.dateFormat) {
                        observable($(element).datepicker("getDate"));
                    } else {
                        observable($.datepicker.formatDate(options.dateFormat, $(this).datepicker("getDate")));
                    }
                });

                //handle disposal (if KO removes by the template binding)
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(element).datepicker("destroy");
                });
            }
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var initialize = true;

            if ((allBindingsAccessor().inAdminMode !== undefined)) {
                initialize = ko.utils.unwrapObservable(allBindingsAccessor().inAdminMode);
            }

            if (initialize) {
                var value = ko.utils.unwrapObservable(valueAccessor()),
					current = $(element).datepicker("getDate");

                if (value - current !== 0) {
                    $(element).datepicker("setDate", value);
                }
            }
        }
    };

    ko.bindingHandlers.jQRangePicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            //do in a setTimeout, so the applyBindings doesn't bind twice from element being copied and moved to bottom
            setTimeout(function () {

                $(element).rangeSlider(options);
                $(element).bind("valuesChanged", function (event, data) {
                    if (isNaN(data.values.max) || isNaN(data.values.min)) return;
                    var value = allBindingsAccessor().value;
                    value(options.resultInterpreter(data.values));
                });

                if (options.prohibitLeftChange) {
                    $(element).bind("valuesChanging", function (event, data) {
                        if (options.leftFix != data.values.min) {
                            $(element).rangeSlider("min", options.leftFix);
                        }
                    });
                }
            }, 0);
        }
    };

    ko.bindingHandlers.tagsinput = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            //do in a setTimeout, so the applyBindings doesn't bind twice from element being copied and moved to bottom
            setTimeout(function () {
                options.onChange = function (obj, tagslist) {
                    var value = allBindingsAccessor().value;
                    var arrayOfTags = obj.val().split(',');
                    value(arrayOfTags);
                };

                $(element).tagsInput(options);

                if (options.defaultTags && options.defaultTags()) {
                    $(element).importTags(options.defaultTags().join(","));
                }

            }, 0);

        }
    };

    ko.bindingHandlers.dialog = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor()) || {};
            //do in a setTimeout, so the applyBindings doesn't bind twice from element being copied and moved to bottom
            setTimeout(function () {
                options.close = function () {
                    allBindingsAccessor().dialogVisible(false);
                };
                options.autoOpen = ko.utils.unwrapObservable(allBindingsAccessor().dialogVisible);
                $(element).dialog(options);
            }, 0);

            //handle disposal (not strictly necessary in this scenario)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).dialog("destroy");
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var shouldBeOpen = ko.utils.unwrapObservable(allBindingsAccessor().dialogVisible);
            if ($(element).data('uiDialog')) {
                $(element).dialog(shouldBeOpen ? "open" : "close");
            }
        }
    };

    ko.bindingHandlers.ckeditor = {
        init: function (element, valueAccessor, allBindingsAccessor, context) {
            var options = allBindingsAccessor().ckeditorOptions || {};
            var modelValue = valueAccessor();
            var value = ko.utils.unwrapObservable(valueAccessor());

            $(element).html(value);
            $(element).ckeditor();

            var editor = $(element).ckeditorGet();

            editor.on('blur', function (e) {
                var self = this;
                if (ko.isWriteableObservable(self)) {
                    self($(e.listenerData).val());
                }
            }, modelValue, element);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                var existingEditor = CKEDITOR.instances[element.name];
                existingEditor.destroy(true);
            });
        }
    };

    ko.bindingHandlers.executeOnEnter = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var allBindings = allBindingsAccessor();
            $(element).keypress(function (event) {
                var keyCode = (event.which ? event.which : event.keyCode);
                if (keyCode === 13) {
                    allBindings.executeOnEnter.call(viewModel);
                    return false;
                }
                return true;
            });
        }
    };

    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();
            $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function (element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();
            ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    ko.bindingHandlers.stopBinding = {
        init: function () {
            return { controlsDescendantBindings: true };
        }
    };

    ko.bindingHandlers.fileupload = {
        update: function (element, valueAccessor) {
            var options = valueAccessor() || {};

            //initialize
            $(element).fileupload(options);
        }
    };

    /* Функция для отключения обработчика при изменении поля */
    //  You would add this to an observable like:
    //  self.name = ko.observable("Bob").withPausing();
    //  Then you would update it without notifications by doing:
    //  self.name.sneakyUpdate("Ted");

    ko.observable.fn.withPausing = function () {
        this.notifySubscribers = function () {
            if (!this.pauseNotifications) {
                ko.subscribable.fn.notifySubscribers.apply(this, arguments);
            }
        };

        this.sneakyUpdate = function (newValue) {
            this.pauseNotifications = true;
            this(newValue);
            this.pauseNotifications = false;
        };

        return this;
    };

    ko.bindingHandlers.rdcGallery = {

        init: function (element, valueAccessor) {

            function radaCodeGalleryViewModel(id) {
                var self = this;
                self.Id = id;
                self.ImageItems = ko.observableArray([]); // массив картинок

                $.ajax({ // узнаем сколько картинок в папке галлереи и заполняем массив картинок
                    type: 'POST',
                    url: "/Content/GetCountImageInGallery",
                    data: { id: id },
                    success: function (res) {
                        for (var i = 1; i <= res.count; i++) {
                            self.ImageItems.push(new imageViewModel(i, self));
                        }
                        if (res.count > 1) { // если в галереи больше чем 1 картинка, включаем слайдер
                            $('#gallery-' + self.Id).slidesjs({
                                navigation: false,
                                pagination: false
                            });
                        }

                    }
                });


            }

            function imageViewModel(imgId, parent) {
                var self = this;
                self.source = "/assets/ObligContent/Galleries/" + parent.Id + "/" + imgId + ".jpg";;
                self.parentId = parent.Id;
            }

            $(element).empty(); // очищаем все что было в нутри галлереи
            var blokId = "gallery-" + valueAccessor().id;
            //вставляем html в галлерею
            var value = "<div  id='" + blokId + "' data-bind=\"template:{ name: 'gallery-images',foreach:ImageItems }\"  style='position: relative; width: inherit;height: inherit;' >" +
                "</div>";
            $(element).prepend(value);
            var viewModel = new radaCodeGalleryViewModel(valueAccessor().id);
          
            ko.applyBindings(viewModel, document.getElementById(blokId)); // биндимся к вьюмодели галлереи
            $("#" + blokId).append("<a id='gallery-prev-button' class='slidesjs-previous slidesjs-navigation' ></a>" +
                "<a id='gallery-next-button' class='slidesjs-next slidesjs-navigation' ></a>");
        }
    };
});