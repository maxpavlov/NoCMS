app.AboutLogic = (function ($) {
    "use strict";

    function aboutPersonViewModel(data, parent) {
        var self = this;

        self.Id = data.Id;
        self.Position = ko.observable(data.Position);
        self.FullName = ko.observable(data.FullName);
        self.Description = ko.observable(data.Description);
        self.Version = ko.observable(data.Version);

        self.Position.subscribe(function () {
            self.UpdateItem();
        });

        self.FullName.subscribe(function () {
            self.UpdateItem();
        });

        self.Description.subscribe(function () {
            self.UpdateItem();
        });

        self.ImageSrc = ko.observable(window.location.origin + "/assets/ObligContent/" + self.Id + ".png?v=" + self.Version());

        self.UpdateItem = function () {
            app.Root.IsLoadingVisible(true);

            var updatePersonItemUrl = $('#UpdatePersonItemUrl').val();
            $.ajax({
                type: 'POST',
                url: updatePersonItemUrl,
                data: {
                    fullName: self.FullName(),
                    id: self.Id,
                    description: self.Description(),
                    position: self.Position()
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

        self.RemoveItem = function (category) {
            app.Root.IsLoadingVisible(true);

            var removePersonItemUrl = $('#RemovePersonItemUrl').val();
            $.ajax({
                type: 'POST',
                url: removePersonItemUrl,
                data: {
                    id: self.Id
                },
                success: function (res) {
                    if (res.status === "OK") {
                        parent.RemoveItem(self);

                        app.Root.IsLoadingVisible(false);
                    } else {
                        alert("There was an error remove the item");
                    }
                }
            });
        };

        self.uploadImage = function (e) {
            app.Root.IsLoadingVisible(true);

            var fd = new window.FormData();
            fd.append('file', e);
            $.ajax({
                type: 'POST',
                url: $('#FileHandlerUrl').val() + "?PersonItemId=" + self.Id,
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

                                self.ImageSrc(ko.observable(window.location.origin + "/assets/ObligContent/" + self.Id + ".png?v=" + self.Version()));
                                    

                                app.Root.IsLoadingVisible(false);
                            } else {
                                alert("There was an error update the item");
                            }
                        }
                    });
                }
            });
        };

    }

    function aboutViewModel(initialDataObject) {
        var self = this;

        self.PersonList = ko.observableArray([]);

        var itemsArray = jQuery.map(initialDataObject.PersonItems, function (val, i) {
            var item = new aboutPersonViewModel(val, self);

            self.PersonList().push(item);
        });

        self.AddPersonItem = function () {
            app.Root.IsLoadingVisible(true);

            var addPersonItemUrl = $('#AddPersonItemUrl').val();
            $.ajax({
                type: 'POST',
                url: addPersonItemUrl,
                success: function (res) {
                    if (res.status === "OK") {

                        var category = new aboutPersonViewModel(res.data, self);
                        self.PersonList.push(category);

                        app.Root.IsLoadingVisible(false);
                    } else {
                        alert("There was an error adding the person: " + res);
                    }
                }
            });
        };

        self.RemoveItem = function (item) {
            self.PersonList.remove(item);

            self.PersonList.valueHasMutated();
        };

    }

    var constructorFunction = function () {

        var initialDataObject = $.parseJSON($("#initial-data").val());
        $("#initial-data").remove();


        app.AboutLogic.ViewModel = new aboutViewModel(initialDataObject);
        ko.applyBindings(app.AboutLogic.ViewModel, document.getElementById("about-wrapper"));
    };

    return { init: constructorFunction };
}($));

app.About = (function ($) {
    "use strict";

    $(function () {
        app.AboutLogic.init();
    });

}($));
