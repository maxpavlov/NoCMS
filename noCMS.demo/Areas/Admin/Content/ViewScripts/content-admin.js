app.ContentAdminLogic = (function ($) {
    "use strict";

    function itemViewModel(data, parent) {
        var self = this;

        self.Id = data.Id;
        self.Title = ko.observable(data.Title);
        self.Description = ko.observable(data.Description);
        self.Version = ko.observable(data.Version);

        self.ImageSrc = ko.observable("/assets/ObligContent/ContentItemImages/" + self.Id + ".png?v=" + self.Version());
        

        self.Title.subscribe(function() {
            self.UpdateItem();
        });

        self.Description.subscribe(function () {
            self.UpdateItem();
        });

        self.UpdateItem = function() {
            var updateContentItemUrl = $('#UpdateContentItemUrl').val();
            $.ajax({
                type: 'POST',
                url: updateContentItemUrl,
                data: {
                    title: self.Title(),
                    id: self.Id,
                    description: self.Description()
                },
                success: function (res) {
                    if (res.status === "OK") {
                    } else {
                        alert("There was an error update the item");
                    }
                }
            });
        };

        self.uploadImage = function (e, isBigImage) {
            var fd = new window.FormData();
            fd.append('file', e);
            $.ajax({
                type: 'POST',
                url: $('#FileHandlerUrl').val() + "?ContentItemId=" + self.Id,
                data: fd,
                processData: false,
                contentType: false,
                success: function () {

                    var updateContentItemVersionUrl = $('#UpdateItemVersionUrl').val();
                    $.ajax({
                        type: 'POST',
                        url: updateContentItemVersionUrl,
                        data: {
                            id: self.Id
                        },
                        success: function (res) {
                            if (res.status === "OK") {
                                self.Version(res.version);

                                self.ImageSrc("/assets/ObligContent/ContentItemImages/" + self.Id + ".png?v=" + self.Version());
                                
                            } else {
                                alert("There was an error update the item");
                            }
                        }
                    });
                }
            });
        };

        self.Remove = function() {
            var removeContentItemUrl = $('#RemoveContentItemUrl').val();
            $.ajax({
                type: 'POST',
                url: removeContentItemUrl,
                data: {
                    id: self.Id
                },
                success: function (res) {
                    if (res.status === "OK") {
                        parent.RemoveItem(self);
                    } else {
                        alert("There was an error update the category");
                    }
                }
            });
        };
    };

    function categoryViewModel (data, parent) {
        var self = this;

        self.Id = data.Id;
        self.CategoryName = ko.observable(data.CategoryName);

        self.Selected = ko.observable(false);
        self.Items = ko.observableArray([]);
        
        if (data.Items != null) {
            var contentItemsArray = jQuery.map(data.Items, function (val, i) {
                var contentItem = new itemViewModel(val, self);

                self.Items().push(contentItem);
            });
        }
        
        self.CategoryName.subscribe(function() {
            self.UpdateCategory();
        });

        self.ToggleContentItems = function() {
            if (!self.Selected()) {
                parent.DeselectOtherCategories(self.Id);
                self.Selected(true);
                self.LoadContentItems();
            }
            return true;
        };

        self.LoadContentItems = function() {
            parent.Items.removeAll();

            if (self.Items() != null) {
                ko.utils.arrayForEach(self.Items(), function (item) {
                    parent.Items().push(item);
                });
                parent.Items.valueHasMutated();
            }      
        };

        self.UpdateCategory = function() {
            var updateCategoryUrl = $('#UpdateCategoryUrl').val();
            $.ajax({
                type: 'POST',
                url: updateCategoryUrl,
                data: {
                    title: self.CategoryName(),
                    id: self.Id
                },
                success: function (res) {
                    if (res.status === "OK") {
                    } else {
                        alert("There was an error update the category");
                    }
                }
            });
        };

        self.Remove = function () {
            var removeCategoryUrl = $('#RemoveCategoryUrl').val();
            $.ajax({
                type: 'POST',
                url: removeCategoryUrl,
                data: {
                    id: self.Id
                },
                success: function (res) {
                    if (res.status === "OK") {
                        parent.RemoveCategory(self);
                    } else {
                        alert("There was an error update the category");
                    }
                }
            });
        };

        self.RemoveItem = function(item) {
            self.ContentItems.remove(item);
            parent.RemoveItem(item.Id);
        };
    }

    function contentManagementViewModel(initData) {
        var self = this;

        self.NewCategoryName = ko.observable('');

        self.Categories = ko.observableArray([]);

        self.Items = ko.observableArray([]);
        self.SelectedCategoryId = ko.observable('');
        self.ContentItemsVisible = ko.observable(false);

        if (initData.Categories != null) {
            var categoriesArray = jQuery.map(initData.Categories, function (val, i) {
                self.Categories().push(new categoryViewModel(val, self));
            });
        }
        
        self.RemoveCategory = function (category) {
            self.Categories.remove(category);
        };

        self.AddNewCategory = function () {
            var addCategoryUrl = $('#AddCategoryUrl').val();
            $.ajax({
                type: 'POST',
                url: addCategoryUrl,
                data: {
                    title: self.NewCategoryName()
                },
                success: function (res) {
                    if (res.status === "OK") {

                        var category = new categoryViewModel(res.data, self);
                        self.Categories.push(category);

                        self.NewCategoryName('');
                    } else {
                        alert("There was an error adding the role: " + res);
                    }
                }
            });
        };

        self.AddNewItem = function () {
            var addItemUrl = $('#AddContentItemUrl').val();
            $.ajax({
                type: 'POST',
                url: addItemUrl,
                data: {
                    categoryId: self.SelectedCategoryId(),

                },
                success: function (res) {
                    if (res.status === "OK") {
                        ko.utils.arrayForEach(self.Categories(), function (category) {
                            if (category.Id == self.SelectedCategoryId()) {
                                var contentItem = new itemViewModel(res.data, category);

                                category.Items().push(contentItem);
                                self.Items.push(contentItem);
                            }
                        });
                        
                    } else {
                        alert("There was an error adding the role: " + res);
                    }
                }
            });
        };

        self.RemoveItem = function(itemId) {
            ko.utils.arrayForEach(self.Items(), function (item) {
                if (item.Id == itemId) {
                    self.Items.remove(item);
                }
            });
        };

        self.DeselectOtherCategories = function (categoryId) {
            self.ContentItemsVisible(true);

            self.SelectedCategoryId(categoryId);
            ko.utils.arrayForEach(self.Categories(), function (category) {
                category.Selected(false);
            });
        };

    }

    var constructorFunction = function () {
        var initialContentDataObject = $.parseJSON($('#initial-content-list').val());
        $('#initial-content-list').remove();

        app.ContentAdminLogic.ViewModel = new contentManagementViewModel(initialContentDataObject);
        ko.applyBindings(app.ContentAdminLogic.ViewModel, document.getElementById("content-management-view"));
    };

    return { init: constructorFunction };
}($));

app.ContentAdmin = (function ($) {
    "use strict";
    $(function () {
        app.ContentAdminLogic.init();
    });
}($));