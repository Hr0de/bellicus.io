Array.prototype.shuffle = function () {
    var i = this.length, j, temp;
    if (i === 0) {
        return this;
    }
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
};

jQuery.fn._draggableSuspicion = function () {
    this.draggable({
        containment: 'body',
        cursor: 'move',
        revert: true,
        revertDuration: 0,
        zIndex: 75,
        helper: 'clone',
        start: (event, ui) => {
            ui.helper.css('z-index', 75);
        },
        stop: function (event, ui) {
            ui.helper.css('z-index', 75);
        }
    });
};

jQuery.fn._draggableSuspicionInGame = function () {
    this.draggable({
        containment: 'body',
        cursor: 'move',
        revert: true,
        revertDuration: 0,
        zIndex: 100,
        start: (event, ui) => {
            ui.helper.css('z-index', 100);
            ui.helper.data('dropped', false);
            $(this).css({margin: ""});
        },
        stop: function (event, ui) {
            ui.helper.css('z-index', 100);
            if (ui.helper.data('dropped') === false) {
                ui.helper.remove();
            }
            $(this).css({right: 0, left: 0, top: "", width: "", position: "absolute", margin: "auto"});
        }
    });
};

jQuery.fn._droppableSuspicion = function () {
    $(this).droppable({
        accept: '.suspicion',
        over: function (event, ui) {
            $(event.target).css('z-index', '');
        },
        drop: function (event, ui) {
            ui.helper.data('dropped', true);
            if ($(this).is(ui.draggable.parent())) {
                return;
            }

            var ghost = ui.draggable;
            if (ghost.closest('#piecesSuspicion').length) {
                ghost = ghost.clone();
                ghost._draggableSuspicionInGame();
                ghost.addClass("mw-100 mh-100 text-center").attr("style", "margin-left: auto;margin-right: auto;");
            }
            $(this).find('.suspicion').remove();
            ghost.css({right: 0, left: 0, top: "", width: "", position: "absolute", margin: "auto"}).addClass("mw-100 mh-100");
            ghost.appendTo($(this));
        }
    });
};
