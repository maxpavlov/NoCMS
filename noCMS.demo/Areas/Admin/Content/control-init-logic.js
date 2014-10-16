$(function () {

    var UsersInitialized = false;
    var GalleriesViewInitialized = false;

    $("#control-area").tabs({
        select: function (event, ui) {
            switch(ui.index)
            {
                case 0:
                    if (!UsersInitialized) {
                        UsersView.Init();
                        UsersInitialized = true;
                    }
                    break;
                case 1:
                    if (!GalleriesViewInitialized) {
                        app.GalleriesAdminLogic.Initialize();
                        GalleriesViewInitialized = true;
                    }
                    break;
                default:
                    break;
            }
            return true;
        }
    });

    $("#control-area").bind("tabsshow", function (event, ui) {
        history.pushState(null, null, ui.tab.hash);
    });

    switch (location.hash) {
        case "#galleries-control":
            if (!GalleriesViewInitialized) {
                app.GalleriesAdminLogic.Initialize();
                GalleriesViewInitialized = true;
            }
            break;
        default:
            if (!UsersInitialized) {
                UsersView.Init();
                UsersInitialized = true;
            }
            break;
    }
})