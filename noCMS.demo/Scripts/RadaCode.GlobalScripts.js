// Этот документ это моя попытка создать некий js framework радакода, с часто используемыми нами javascript  функциями
var RadaCode = window.app || { models: {} };
RadaCode.GlobalLogic = (function ($) {
    //Функция используеться для генерации случайного Guid
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    };

    //Генерация случайного Guid
    RadaCode.Guid = function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    RadaCode.Lang = (function ($) {
        "use strict";
        var ChangeLanguageImplementation = function (newLang) {
            var supportedLanguages = $.parseJSON($("#supported-languages").val());
            var curPath = location.pathname;
            var firstElementInPath = curPath.substring(1, 3);
            var isLanguage = ($.inArray(firstElementInPath, supportedLanguages) != -1);
            if (isLanguage)
                curPath = location.pathname.substr(3);
            var resHref = location.origin + newLang + curPath;
            location.href = resHref;
        };
        return { ChangeLanguage: ChangeLanguageImplementation };
    })($);
    // Поварачивает div (в данный момент используеться для вращения лоадинга вокруг капельки)
    RadaCode.RotateDiv = function (element) {
        $(element).rotate({
            angle: 0,
            animateTo: -99999999999999,
            duration: 1000000000000009
        });
    };
}($));