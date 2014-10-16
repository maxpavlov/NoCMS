app.TermsLogic = (function ($) {
    "use strict";
    function termsViewModel() {
        var self = this;

    }

    var constructorFunction = function () {
        app.TermsLogic.ViewModel = new termsViewModel();
        ko.applyBindings(app.TermsLogic.ViewModel, document.getElementById("terms-wraper"));
    };

    return { init: constructorFunction };
}($));

app.Terms = (function ($) {
    "use strict";
    $(function () {
        app.TermsLogic.init();
    });
}($));
