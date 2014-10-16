
app.FooterLogic = (function ($) {
    "use strict";
    function footerManagementViewModel(data) {
        var self = this;
        self.BuyHref = ko.observable(data.ContentMarkup);
        self.BuyHref.subscribe(function (newValue) {
            if (newValue.length > 0) {
                self.UpdateLink();
            }
        });
        self.UpdateLink = function () {
            var url = $('#SetPressKitLinkUrl').val();
            $.ajax({
                type: 'POST',
                url: url,
                data: {
                    data: self.BuyHref(),
                },
                success: function (res) {
                    if (res.status === "OK") {


                    }
                }
            });
        }
    }

    var constructorFunction = function () {
        var initialDataObject = $.parseJSON($("#footer-data").val());
        $("#footer-data").remove();
        app.FooterLogic.ViewModel = new footerManagementViewModel(initialDataObject);
        ko.applyBindings(app.FooterLogic.ViewModel, document.getElementById("footer-container"));
    };

    return { init: constructorFunction };
}($));

app.Footer = (function ($) {
    "use strict";
    app.FooterLogic.init();
}($));

$(document).ready(function () {

    $("#future-banner .gototop").click(function () {
        $('html, body').animate({ scrollTop: 0 }, 350);
        return false;
    });

    var selectCountries = $('#select-country');
    selectCountries.selectpicker({
        size: 10
    });
    selectCountries.val(app.CurrentLanguage());
    selectCountries.selectpicker('render');

    $('#select-country').change(function () {
        app.CurrentLanguage(selectCountries.val());
    });

    $("#footer-container .select-country").show();

});
