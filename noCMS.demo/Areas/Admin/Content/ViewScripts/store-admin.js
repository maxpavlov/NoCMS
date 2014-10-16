app.StoreAdminLogic = (function ($) {
    "use strict";

    function itemViewModel(data, parent) {
        var self = this;

        self.Id = data.Id;
        self.Title = ko.observable(data.Title);
        self.Price = ko.observable(data.Price);
        self.Description = ko.observable(data.Description);
        self.Count = ko.observable(data.Count);
        self.Slug = ko.observable(data.Slug);
        self.ShowOnHomePageBanner = ko.observable(data.ShowOnHomePageBanner);
        self.Version = ko.observable(data.Version);

        self.BigImageSrc = ko.observable("/assets/ObligContent/StoreItemImages/" + self.Id + "-big.png?v=" + self.Version());
        self.SmallImageSrc = ko.observable("/assets/ObligContent/StoreItemImages/" + self.Id + "-small.png?v=" + self.Version());

        self.Title.subscribe(function() {
            self.UpdateItem();
        });

        self.Price.subscribe(function () {
            self.UpdateItem();
        });

        self.Description.subscribe(function () {
            self.UpdateItem();
        });

        self.Slug.subscribe(function () {
            self.UpdateItem();
        });

        self.Count.subscribe(function () {
            self.UpdateItem();
        });

        self.ShowOnHomePageBanner.subscribe(function () {
            self.UpdateItem();
        });

        self.UpdateItem = function() {
            var updateStoreItemUrl = $('#UpdateStoreItemUrl').val();
            $.ajax({
                type: 'POST',
                url: updateStoreItemUrl,
                data: {
                    title: self.Title(),
                    id: self.Id,
                    description: self.Description(),
                    price: self.Price(),
                    showOnHomePageBanner: self.ShowOnHomePageBanner(),
                    count: self.Count(),
                    slug: self.Slug()
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
                url: $('#FileHandlerUrl').val() + "?StoreItemId=" + self.Id + "?BigImage=" + isBigImage,
                data: fd,
                processData: false,
                contentType: false,
                success: function () {

                    var updateStoreItemVersionUrl = $('#UpdateItemVersionUrl').val();
                    $.ajax({
                        type: 'POST',
                        url: updateStoreItemVersionUrl,
                        data: {
                            id: self.Id
                        },
                        success: function (res) {
                            if (res.status === "OK") {
                                self.Version(res.version);

                                if (isBigImage) {
                                    self.BigImageSrc("");
                                    self.BigImageSrc("/assets/ObligContent/StoreItemImages/" + self.Id + "-big.png?v=" + self.Version());
                                } else {
                                    self.SmallImageSrc("");
                                    self.SmallImageSrc("/assets/ObligContent/StoreItemImages/" + self.Id + "-small.png?v=" + self.Version());
                                }
                            } else {
                                alert("There was an error update the item");
                            }
                        }
                    });
                }
            });
        };

        self.Remove = function() {
            var removeStoreItemUrl = $('#RemoveStoreItemUrl').val();
            $.ajax({
                type: 'POST',
                url: removeStoreItemUrl,
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
        self.StoreItems = ko.observableArray([]);
        
        if (data.StoreItems != null) {
            var storeItemsArray = jQuery.map(data.StoreItems, function (val, i) {
                var storeItem = new itemViewModel(val, self);

                self.StoreItems().push(storeItem);
            });
        }
        
        self.CategoryName.subscribe(function() {
            self.UpdateCategory();
        });

        self.ToggleStoreItems = function() {
            if (!self.Selected()) {
                parent.DeselectOtherCategories(self.Id);
                self.Selected(true);
                self.LoadStoreItems();
            }
            return true;
        };

        self.LoadStoreItems = function() {
            parent.StoreItems.removeAll();

            if (self.StoreItems() != null) {
                ko.utils.arrayForEach(self.StoreItems(), function (item) {
                    parent.StoreItems().push(item);
                });
                parent.StoreItems.valueHasMutated();
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
            self.StoreItems.remove(item);
            parent.RemoveItem(item.Id);
        };
    }

    function storeManagementViewModel(initData) {
        var self = this;

        self.NewCategoryName = ko.observable('');

        self.Categories = ko.observableArray([]);

        self.StoreItems = ko.observableArray([]);
        self.SelectedCategoryId = ko.observable('');
        self.StoreItemsVisible = ko.observable(false);

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
            var addItemUrl = $('#AddStoreItemUrl').val();
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
                                var storeItem = new itemViewModel(res.data, category);

                                category.StoreItems().push(storeItem);
                                self.StoreItems.push(storeItem);
                            }
                        });
                        
                    } else {
                        alert("There was an error adding the role: " + res);
                    }
                }
            });
        };

        self.RemoveItem = function(itemId) {
            ko.utils.arrayForEach(self.StoreItems(), function (item) {
                if (item.Id == itemId) {
                    self.StoreItems.remove(item);
                }
            });
        };
        

        self.DeselectOtherCategories = function (categoryId) {
            self.StoreItemsVisible(true);

            self.SelectedCategoryId(categoryId);
            ko.utils.arrayForEach(self.Categories(), function (category) {
                category.Selected(false);
            });
        };

    }

    var constructorFunction = function () {
        var initialStoreDataObject = $.parseJSON($('#initial-store-list').val());
        $('#initial-store-list').remove();

        app.StoreAdminLogic.ViewModel = new storeManagementViewModel(initialStoreDataObject);
        ko.applyBindings(app.StoreAdminLogic.ViewModel, document.getElementById("store-management-view"));
    };

    return { init: constructorFunction };
}($));

app.StoreAdminAdmin = (function ($) {
    "use strict";
    $(function () {
        app.StoreAdminLogic.init();
    });
}($));