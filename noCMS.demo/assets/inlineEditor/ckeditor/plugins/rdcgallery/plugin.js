var galleryGuid = RadaCode.Guid();
var compression = 0; // на сколько сжимать картинку, 0 не сжимать
var compressType = [['Без сжатия'], ['Маленький'], ['Средний'], ['Большой']];
var galleryPosition = [['Слева'], ['Стандартно'], ['Справа']];
var galleryPositionText = "clear:both;";
var imageCount = 0;
var areaName = $("#area-name").val();

//#region поля для обнуления значений
var select;
var radio;
//#endregion
(function () {
    CKEDITOR.plugins.add('rdcgallery', {
        lang: 'ru',
        requires: 'dialog',
        icons: 'rdcgallery',
        init: function (editor) {
            CKEDITOR.dialog.add('rdcgallery', function (editor) {
                return {
                    data: null,
                    ratio: 0,
                    dialog: null,
                    originalCanvas: null,
                    title: editor.lang.rdcgallery.title,
                    resizable: CKEDITOR.DIALOG_RESIZE_NONE,
                    height: 530,
                    contents: [
						{
						    id: 'uploadimage',
						    elements: [
							   {
							       type: 'vbox',
							       align: 'center',
							       children: [
									   {
									       type: 'select',
									       label: 'Выберите уровень сжатия изображения',
									       items: compressType,
									       'default': 'Без сжатия',
									       onChange: function () {
									           select = this;
									           //TODO надо найдти как искать индекс массива по значению, если массив содержит массив массивов
									           switch (this.getValue()) {
									               case "Без сжатия":
									                   compression = 0;
									                   break;
									               case "Маленький":
									                   compression = 1;
									                   break;
									               case "Средний":
									                   compression = 2;
									                   break;
									               case "Большой":
									                   compression = 3;
									                   break;
									           }
									       }
									   },
									   {
									       type: 'html',
									       html: ' <form  id="rdc-fileupload" method="POST" enctype="multipart/form-data" action="/Areas/' + areaName + '/FileHandler/Handler.ashx?GalleryId="'+ galleryGuid + '></form>'
									   },
									   {
									       type: 'hbox',
									       align: 'center',
									       children: [

                                                 {
                                                     type: 'radio',
                                                     label: 'Выберите позицию галереи',
                                                     items: galleryPosition,
                                                     'default': 'Стандартно',
                                                     onChange: function () {
                                                         radio = this;
                                                         switch (this.getValue()) {
                                                             case "Стандартно":
                                                                 galleryPositionText = "clear:both;";
                                                                 break;
                                                             case "Слева":
                                                                 galleryPositionText = "float:left;";
                                                                 break;
                                                             case "Справа":
                                                                 galleryPositionText = "float:right;";
                                                                 break;

                                                         }
                                                     }
                                                 }
									       ]
									   }
							       ]
							   }
						    ]

						}
                    ],
                    onShow: function (event) {
                        $("#rdc-fileupload").empty();
                        galleryGuid = RadaCode.Guid();
                        var htmlValue = '<div id="image-container"></div><div class="fileupload-buttonbar"> ' +
                            '<span class="btn btn-success fileinput-button" style="padding: 10px;"><span style="color:white">Выберите изображения</span>' +
                            ' <input id="rdc-image" onchange="uploading(this)" type="file" accept="image/x-png, image/gif, image/jpeg"  multiple>' +
                            ' </span> </div>';
                        $("#rdc-fileupload").append(htmlValue);

                        var range = editor.getSelection().getRanges()[0];
                        var el = editor.document.createElement('div');
                        el.append(range.cloneContents());
                        if ($(el.getHtml()).attr('class') != null && $(el.getHtml()).attr('class').length > 0) { // если выделена галлерея
                            galleryGuid = $(el.getHtml()).attr('class');
                            var value = '<div style="clear:both"><span id="remove-gallery" class="btn btn-danger" style="padding: 10px;cursor:pointer" onClick="galleryDelete()"><span style="color:white;cursor:pointer">Удалить галлерею</span></span></div>';
                            $("#rdc-fileupload").append(value);
                            $.ajax({
                                type: 'POST',
                                url: "/Content/GetCountImageInGallery",
                                data: { id: galleryGuid },
                                success: function (res) {
                                    imageCount = res.count;
                                    for (var i = 1; i <= imageCount; i++) {
                                        var img = "<div id ='img-container-" + i + "' style='display: block;float: left; margin: 10px;height: 100px;'><img src='/assets/ObligContent/Galleries/"
                                            + galleryGuid + "/" + i + ".jpg' height='100' width='100' style='height: 100px;' />" +
                        '<button class="btn btn-danger" type="button" style=" color: white; padding: 7px 13px; position: absolute; margin-left: -35px;cursor:pointer" id="' + i + '" onClick="imageDelete(this)">X</button></div>';
                                        $("#image-container").append(img);
                                    }

                                }
                            });
                        }



                        if (select)
                            select.setValue('Без сжатия');
                        document.getElementById("rdc-image").value = "";
                        imageCount = 0;
                        if (radio)
                            radio.setValue('Стандартно');
                    },
                    onOk: function (event) {
                        var width = $("#" + galleryGuid).width();
                        var height = $("#" + galleryGuid).height();

                        width = width == null ? "500" : width; // если создаем новую галерею или ширина не считана задаем 500 пикселей иначе оставляем прежнюю ширину
                        height = height == null ? "500" : height;
                        $("#" + galleryGuid).remove();
                        if (galleryGuid != null) {
                            var value = CKEDITOR.dom.element.createFromHtml('<div id="' + galleryGuid + '" class="radacode-gallery" data-bind="rdcGallery:{id: \'' + galleryGuid + '\' }, stopBinding: true" ' +
                                'style="width:' + width + 'px;height:' + height + 'px;'+ galleryPositionText+'"></div> <br/> <br/>');
                            editor.insertElement(value);
                            ko.applyBindings(new function () { }, document.getElementById(galleryGuid));
                        }

                        return true;
                    }
                };
            });
            editor.addCommand('gallery-popup', new CKEDITOR.dialogCommand('rdcgallery', {
                allowedContent: 'img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}',
                requiredContent: 'img[alt,src]',
                contentTransformations: [
					['img{width}: sizeToStyle', 'img[width]: sizeToAttribute'],
					['img{float}: alignmentToStyle', 'img[align]: alignmentToAttribute']
                ]
            }));
            editor.ui.addButton('rdcgallery', {
                label: editor.lang.rdcgallery.btnTitle,
                command: 'gallery-popup',
                toolbar: 'rdcgallery'
            });
        }
    });

})();

CKEDITOR.on('dialogDefinition', function (dialogDefinitionEvent) {
    var dialogDefinition = dialogDefinitionEvent.data.definition;
    dialogDefinition.dialog.on('cancel', function (cancelEvent) {
        return false;
    }, this, null, -1);
});

function uploading(e) {
    var fd = new window.FormData();
    uploadFiles = e;
    for (var i = 0; i < e.files.length; i++) {
        fd.append('file', e.files[i]);
    }
    $.ajax({
        type: 'POST',
        url: "/Areas/" + areaName + "/FileHandler/Handler.ashx?GalleryId=" + galleryGuid + "&Compression=" + compression,
        data: fd,
        processData: false,
        contentType: false,
        success: function (res) {
            for (var i = 0; i < e.files.length; i++) {
                var img = "<div id ='img-container-" + (imageCount + 1) + "' style='display: block;float: left; margin: 10px;height: 100px;'><img src='/assets/ObligContent/Galleries/" + galleryGuid
                    + "/" + (imageCount + 1) + ".jpg' height='100' width='100' style='height: 100px;' />" +
		            '<button class="btn btn-danger" type="button" style=" color: white; padding: 7px 13px; position: absolute; margin-left: -35px;cursor:pointer" id="' + (imageCount + 1) + '" onClick="imageDelete(this)">X</button></div>';
                $("#image-container").append(img);
                imageCount++;
            }

        }
    });

};

function galleryDelete() {
    $.ajax({
        type: 'POST',
        url: "/Content/DeleteGallery",
        data: { guid: galleryGuid },
        success: function () {
            $("#" + galleryGuid).remove();
            galleryGuid = null;
            $("#image-container").empty();
            $("#remove-gallery").text("Галлерея была успешно удалена из сервера");
            $('#remove-gallery').attr('disabled', true);
            $("#image-container").remove();
            $(".fileupload-buttonbar").remove();
        }
    });
}

function imageDelete(element) {
    $.ajax({
        type: 'POST',
        url: "/Content/DeleteImage",
        data: {
            imageName: element.id,
            guid: galleryGuid
        },
        success: function (res) {
            if (res.status === "OK")
                $('#img-container-' + element.id).remove();
            imageCount--;
        }
    });
}