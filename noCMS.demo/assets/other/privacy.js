app.PrivacyLogic = (function ($) {
    "use strict";
    function privacyViewModel() {
        var self = this;

    }

    var constructorFunction = function () {
        app.PrivacyLogic.ViewModel = new privacyViewModel();
        ko.applyBindings(app.PrivacyLogic.ViewModel, document.getElementById("privacy-wraper"));
    };

    return { init: constructorFunction };
}($));

app.Privacy = (function ($) {
    "use strict";
    $(function () {
        app.PrivacyLogic.init();
    });
}($));
