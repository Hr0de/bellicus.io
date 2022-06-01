var Bulb = {};
/*
 * getUniqId
 */
Bulb.getUniqId = function () {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0;
        return r.toString(16);
    });
};

/*
 * Overlay
 */
Bulb.overlay = {};
Bulb.overlay.list = [];
Bulb.overlay.last = undefined;
Bulb.overlay.classes = {
    self: "bulbOverlay",
    parent: "bulbParent"
};
Bulb.overlay.close = function (id) {
    var index = Bulb.overlay.list.indexOf(id);
    if (index > -1) {
        Bulb.overlay.list.splice(index, 1);
        var overlay = $('#' + id);
        if (overlay.parent().find("> ." + Bulb.overlay.classes.self).length === 1) {
            overlay.parent().removeClass(Bulb.overlay.classes.parent);
        }
        overlay.remove();
    }
};
Bulb.overlay.closeAll = function () {
    for (var id of Bulb.overlay.list.slice()) {
        Bulb.overlay.close(id);
    }
};
Bulb.overlay.closeAllFrom = function (container) {
    container.find("> ." + Bulb.overlay.classes.self).each(function () {
        Bulb.overlay.close($(this).attr('id'));
    });
};
Bulb.overlay.closeLast = function () {
    Bulb.overlay.close(Bulb.overlay.last);
};
Bulb.overlay.open = function (content, container) {
    var id = "overlay" + Bulb.getUniqId();
    if (!(container instanceof jQuery)) {
        container = $('body');
    }
    container.append($("<div>").attr("id", id).addClass(Bulb.overlay.classes.self).append(content));
    container.addClass(Bulb.overlay.classes.parent);

    Bulb.overlay.list.push(id);
    Bulb.overlay.last = id;

    return id;
};

/*
 * Loader
 */
Bulb.loader = {};
Bulb.loader.id = null;
Bulb.loader.close = function () {
    if (Bulb.loader.id !== null) {
        Bulb.overlay.close(Bulb.loader.id);
    }
};
Bulb.loader.open = function (options) {
    Bulb.loader.close();
    var div = $('<div>').addClass("absolute-center");
    div.append($('<div>').addClass("text-center").append($("<div>").addClass("icon-refresh-cw text-2 color-white effect-rotate")));
    var container = undefined;
    if (typeof options === "object") {
        if (typeof options.text === "string") {
            div.append($('<p>').addClass("margin-top-x05 text-14 text-center").text(options.text));
        }
        if (options.container instanceof jQuery) {
            container = options.container;
        }
    }
    Bulb.loader.id = Bulb.overlay.open(div, container);
};

/*
 * Dialog
 */
Bulb.dialog = {};
Bulb.dialog.list = [];
Bulb.dialog.last = undefined;
Bulb.dialog.close = function (id) {
    var index = Bulb.dialog.list.indexOf(id);
    if (index > -1) {
        Bulb.dialog.list.splice(index, 1);
        Bulb.overlay.close(id);
    }
};
Bulb.dialog.closeAll = function () {
    for (var id of Bulb.dialog.list.slice()) {
        Bulb.dialog.close(id);
    }
};
Bulb.dialog.closeLast = function () {
    Bulb.dialog.close(Bulb.dialog.last);
};
Bulb.dialog.open = function (options) {
    if (!(typeof options.buttons === "object" && Array.isArray(options.buttons))) {
        options.buttons = [
            {
                name: "Close"
            }
        ];
    }
    var buttons = $('<div>').addClass("text-right");
    $.each(options.buttons, function (index, button) {
        var btn = $('<div>').addClass("padding-x05 d-inline cursor-pointer text-bold").text(button.name);
        if (typeof button.color === "string") {
            btn.addClass("color-" + button.color);
        }
        btn.on('click', function () {
            if (typeof button.onClick === "function") {
                button.onClick();
            } else {
                Bulb.dialog.close(id);
            }
        });
        buttons.append(btn);
    });
    if (buttons.children().length) {
        buttons.addClass("margin");
    }

    var dialog = $('<div>').css({width: "100vw", height: "100vh"});
    dialog.append($('<div>').addClass("h-100 margin-auto").css({
        width: "calc(100% - 60px)",
        'max-height': "calc(100% - 60px)",
        padding: "30px",
        'max-width': "800px"
    }).append($('<div>').addClass("d-flex flex-column mh-100 bck-white color-black").append($('<div>').addClass("padding").css({overflow: "auto"}).append(options.content)).append($('<div>').append(buttons))));

    var id = Bulb.overlay.open(dialog);
    Bulb.dialog.list.push(id);
    Bulb.dialog.last = id;

    return id;
};

/*
 * Toast
 */
Bulb.toast = function (message, options) {
    if (typeof options !== "object") {
        options = {};
    }

    var toast = $('<div>').addClass("bulbToast margin");
    var content = $('<div>').addClass("padding").text(message);
    if (typeof options === "object" && typeof options.type === "string") {
        if (options.type === "err") {
            content.prepend($('<span>').addClass("icon-alert-circle color-err margin-right-x05 text-14 vertical-align-middle"));
        } else if (options.type === "warn") {
            content.prepend($('<span>').addClass("icon-alert-triangle color-warn margin-right-x05 text-14 vertical-align-middle"));
        } else if (options.type === "info") {
            content.prepend($('<span>').addClass("icon-info color-info margin-right-x05 text-14 vertical-align-middle"));
        } else if (options.type === "conf") {
            content.prepend($('<span>').addClass("icon-check color-conf margin-right-x05 text-14 vertical-align-middle"));
        }
    }
    toast.append(content);

    if (typeof options.closable === "boolean") {
        toast.append($('<div>').addClass("padding-right").append($('<span>').addClass("icon-x text-14 cursor-pointer").on('click', function () {
            toast.hide('fast', function () {
                $(this).remove();
            });
        })));
    } else if (typeof options.timeout === "undefined") {
        options.timeout = 3500;
    }

    toast.hide();
    $('body').append(toast);
    toast.show('fast');

    if (typeof options.timeout === "number") {
        setTimeout(function () {
            toast.hide('fast', function () {
                $(this).remove();
            });
        }, options.timeout);
    }
};
