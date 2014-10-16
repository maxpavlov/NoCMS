app.PressKitLogic = (function ($) {
    "use strict";
    function pressKitViewModel() {
        var self = this;

    }

    var constructorFunction = function () {
        app.PressKitLogic.ViewModel = new pressKitViewModel();
        ko.applyBindings(app.PressKitLogic.ViewModel, document.getElementById("presskit-wraper"));
    };

    return { init: constructorFunction };
}($));

app.PressKit = (function ($) {
    "use strict";
    $(function () {
        app.PressKitLogic.init();
    });
}($));
