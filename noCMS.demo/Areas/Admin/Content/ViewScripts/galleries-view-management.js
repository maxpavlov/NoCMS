app.GalleriesAdminLogic = (function ($) {
    "use strict";

    var MountDivID = "#galleries-management-view";

    function galleryViewModel(itemData, parent) {
        var self = this;
        self.ImageItems = ko.observableArray([]);
        self.ItemName = ko.observable(itemData.Name);
        self.Title = ko.observable(itemData.Title);
        self.Caption = ko.observable(itemData.Caption);
        self.Id = itemData.Id;
        self.TitleChanged = ko.observable(false);
        self.ItemNameChanged = ko.observable(false);
        self.CaptionChanged = ko.observable(false);
        self.RemoveItem = function () {
            parent.RemoveItem(self);
        };
        self.UploaderId = ko.computed(function () {
            return 'uploader-' + self.Id;
        });
        if (itemData.Images != null) {
            $.each(itemData.Images, function(i) {
                self.ImageItems.push(new imageViewModel(itemData.Images[i], self));
            });
        }
        self.AddImage = function (imageId) {
            var url = $('#GetImageInfo').val();
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    imageId: imageId
                },
                success: function (res) {
                    if (res.status === "SPCD: ERROR") {
                        alert("There was an error updating the display name: " + res);
                    }
                    else {
                        if (itemData.Images == null)
                            itemData.Images = ko.observableArray([]);
                        itemData.Images.push(res);
                        self.ImageItems.push(new imageViewModel(res, self));
                    }
                }
            });
        };
        self.SaveItemName = function () {
            var updateNameUrl = $('#UpdateItemNameUrl').val();
            $.ajax({
                type: 'POST',
                url: updateNameUrl,
                data: {
                    galleryId: self.Id,
                    galleryName: self.ItemName()
                },
                success: function (res) {
                    if (res.status === "SPCD: OK") {
                        self.ItemNameChanged(false);
                    } else {
                        alert("There was an error updating the display name: " + res);
                    }
                }
            });
        };
        self.SaveCaption = function () {
            var updateNameUrl = $('#UpdateCaption').val();
            $.ajax({
                type: 'POST',
                url: updateNameUrl,
                data: {
                    galleryId: self.Id,
                    caption: self.Caption()
                },
                success: function (res) {
                    if (res.status === "SPCD: OK") {
                        self.CaptionChanged(false);
                    } else {
                        alert("There was an error updating the display name: " + res);
                    }
                }
            });
        };
        self.SaveTitle = function () {
            var updateNameUrl = $('#UpdateTitle').val();
            $.ajax({
                type: 'POST',
                url: updateNameUrl,
                data: {
                    galleryId: self.Id,
                    title: self.Title()
                },
                success: function (res) {
                    if (res.status === "SPCD: OK") {
                        self.TitleChanged(false);
                    } else {
                        alert("There was an error updating the display name: " + res);
                    }
                }
            });
        };

        self.ItemName.subscribe(function () {
            self.ItemNameChanged(true);
        });
        self.Title.subscribe(function () {
            self.TitleChanged(true);
        });
        self.Caption.subscribe(function () {
            self.CaptionChanged(true);
        });



    }

    function managementViewModel(initData) {
        var self = this;

        self.NewItemName = ko.observable('');
        self.Galleries = ko.observableArray([]);
       
        self.RemoveItem = function (itemToRemoveModel) {

            var removeGalleryUrl = $('#RemoveItemUrl').val();
            $.ajax({
                type: 'POST',
                url: removeGalleryUrl,
                data: {
                    galleryId: itemToRemoveModel.Id
                },
                success: function (res) {
                    if (res.status === "SPCD: RLREMOVED") {
                        self.Galleries.remove(itemToRemoveModel);
                    } else {
                        alert("There was an error adding the item: " + res.status);
                    }
                }
            });
        };



        self.NewItemName = ko.observable('').extend({ required: true });

        var galleriesArray = jQuery.map(initData, function (val, i) {
            self.Galleries.push(new galleryViewModel(val, self));

        });

        self.AddNewItem = function () {
            var addItemUrl = $(MountDivID + ' #AddItemUrl').val();
            $.ajax({
                type: 'POST',
                url: addItemUrl,
                data: {
                    galleryName: self.NewItemName()
                },
                success: function (res) {
                    if (res.status === "SPCD: ITEMADDED") {
                        var item = new galleryViewModel(res.itemToAdd, self);
                        self.Galleries.push(item);
                        self.NewItemName('');
                        
                        $('#uploader-' + res.itemToAdd.Id).attr("action", $("#FileHandlerUrl").val() + "?GalleryId=" + res.itemToAdd.Id);
                        $('#uploader-' + res.itemToAdd.Id).fileupload();
                        $('#uploader-' + res.itemToAdd.Id).fileupload('option', {
                            filesContainer: $('#uploader-' + res.itemToAdd.Id + ' .files'),
                            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp)$/i,
                            formData: { what: 'oblig-content' }
                        });
                    } else {
                        alert("There was an error adding the item: " + res.status);
                    }
                }
            });
        };

        self.AddImageToGallery = function (imageId, galleryId) {
            for (var i = 0; i < self.Galleries().length; i++) {
                if (self.Galleries()[i].Id == galleryId) {
                    self.Galleries()[i].AddImage(imageId);
                }
            }
        };
    }
    function imageViewModel(itemData, parent) {
        var self = this;

        // start image logic
        self.imagePath = "";
        self.imageCaption = ko.observable();
        self.imageId = "";
 
        self.imagePath = "/assets/ObligContent/" + parent.Id + "/" + itemData.Id + itemData.Extension;
        self.imageId = itemData.Id;
        if (itemData.Caption != null) {
            self.imageCaption = ko.observable(itemData.Caption);
        }


        self.GalleryCaptChanged = ko.observable(false);

        self.imageCaption.subscribe(function () {
            self.GalleryCaptChanged(true);
        });

        self.SaveGalleryCapt = function () {
            var updateNameUrl = $('#UpdateImgCapt').val();
            $.ajax({
                type: 'POST',
                url: updateNameUrl,
                data: {
                    imageId: self.imageId,
                    caption: self.imageCaption()
                },
                success: function (res) {
                    if (res.status === "SPCD: OK") {
                        self.GalleryCaptChanged(false);
                    } else {
                        alert("There was an error updating the display name: " + res);
                    }
                }
            });
        };
        self.RemoveImage = function (itemToRemoveModel) {

            var removeGalleryUrl = $('#RemoveImage').val();
            $.ajax({
                type: 'POST',
                url: removeGalleryUrl,
                data: {
                    imageId: itemToRemoveModel.imageId,
                    imagePath: itemToRemoveModel.imagePath
                },
                success: function (res) {
                    if (res.status === "SPCD: RLREMOVED") {
                        parent.ImageItems.remove(itemToRemoveModel);
                    } else {
                        alert("There was an error adding the item: " + res.status);
                    }
                }
            });
        };

    }

    var constructorFunction = function () {

        var initialDataObject = $.parseJSON($(MountDivID + " #initial-galleries-list").val());
        app.GalleriesAdminLogic.ViewModel = new managementViewModel(initialDataObject);
        ko.applyBindings(app.GalleriesAdminLogic.ViewModel, document.getElementById("galleries-management-view"));


        $('#file_upload').corner("right");
        $('#enabler').corner("right");
        // получаем к-во галлерей и инициализируем загрузчик картинок для каждой галлереи
        for (var i = 0; i < initialDataObject.length; i++) {
            $('#uploader-' + initialDataObject[i].Id).attr("action", $("#FileHandlerUrl").val() + "?GalleryId=" + initialDataObject[i].Id);
            $('#uploader-' + initialDataObject[i].Id).fileupload();
            $('#uploader-' + initialDataObject[i].Id).fileupload('option', {
                filesContainer: $('#uploader-' + initialDataObject[i].Id + ' .files'),
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp)$/i,
                formData: { what: 'oblig-content' }
            });
        }

    };

    return { Initialize: constructorFunction };
}($));
