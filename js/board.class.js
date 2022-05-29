const TYPES_PIECES = {
    GENERAL: "gnrl",
    LIEUTENANT_GENERAL: "lgnrl",
    MAJOR_GENERAL: "mgnrl",
    COLONEL: "clnl",
    LIEUTENANT_COLONEL: "lclnl",
    MAJOR: "mjr",
    CAPTAIN: "cptn",
    FIRST_LIEUTENANT: "fltnnt",
    SECOND_LIEUTENANT: "sltnnt",
    AIRPLANE: "rpln",
    TANK: "tnk",
    CAVALRY: "cvlr",
    ENGINEER: "ngnr",
    MINE: "mn",
    REGIMENT: "rgmnt",
    SPY: "sp"
};
class Board {
    static cells = {};
    static piecesNumber = {r: 20, b: 20};

    static pieceAvailableGameMovements(r, c) {
        r = parseFloat(r);
        c = parseFloat(c);
        var piece = Board.cells[r][c];
        if (!piece) {
            return [];
        } else if (piece.type === TYPES_PIECES.MINE) {
            return [];
        } else if (piece.type === TYPES_PIECES.REGIMENT) {
            return [];
        }

        var availableMovements = [];

        // Vers le haut
        for (var j = (c === 3.5 && r === 8 ? 3 : c); j <= (c === 3.5 && r === 8 ? 4 : c); j++) {
            for (var i = r - 1; i >= 1; i--) {
                var p = null;
                if (Board.cells[i][j]) {
                    p = Board.cells[i][j];
                }
                if (i === 1 && (j === 3 || j === 4)) { // Monter sur le trone
                    p = null;
                    if (Board.cells[i][3.5]) {
                        p = Board.cells[i][3.5];
                    }
                }
                if (p && p.color === piece.color) { // Piece alliée
                    if (piece.type === TYPES_PIECES.AIRPLANE) {
                        continue;
                    }
                    break;
                } else {
                    if (r > 4 && i === 4 && !(j === 2 || j === 5) && piece.type !== TYPES_PIECES.AIRPLANE) { // Pont
                        break;
                    }
                    if (i === 1 && (j === 3 || j === 4)) { // Monter sur le trone
                        if ((c === 3.5 && r === 8 ? 3 : c) === (c === 3.5 && r === 8 ? 4 : c)) { // si une seule colonne à scanner
                            availableMovements.push({r: i, c: 3.5});
                        } else if (j === 3) { // on ajoute la case qu'au premier scan
                            availableMovements.push({r: i, c: 3.5});
                        }
                    } else {
                        availableMovements.push({r: i, c: j});
                    }
                    if (piece.type !== TYPES_PIECES.AIRPLANE && piece.type !== TYPES_PIECES.ENGINEER) {
                        if (piece.type === TYPES_PIECES.TANK) {
                            if (p && p.color !== piece.color) {
                                break;
                            }
                            if (r - i < 2) {
                                continue;
                            }
                        }
                        break;
                    } else if (p && p.color !== piece.color && piece.type !== TYPES_PIECES.AIRPLANE) {
                        break;
                    }
                }
            }
        }

        // Vers la droite
        for (var j = (c === 3.5 && (r === 1 || r === 8) ? 4 : c) + 1; j <= 6; j++) {
            var tmp = j;
            if (r === 1 || r === 8) {
                if (tmp === 4) { // Fausse case
                    continue;
                } else if (tmp === 3) {
                    tmp = 3.5;
                }
            }
            var p = null;
            if (Board.cells[r][tmp]) {
                p = Board.cells[r][tmp];
            }
            if (p && p.color === piece.color) { // Piece alliée
                break;
            } else {
                availableMovements.push({r: r, c: tmp});
                if (piece.type !== TYPES_PIECES.ENGINEER) { // Seulement l'ingénieur est illimité en horizontal
                    break;
                } else if (p && p.color !== piece.color) {
                    break;
                }
            }
        }

        // Vers le bas
        for (var j = (c === 3.5 && r === 1 ? 3 : c); j <= (c === 3.5 && r === 1 ? 4 : c); j++) {
            for (var i = r + 1; i <= 8; i++) {
                var p = null;
                if (Board.cells[i][j]) {
                    p = Board.cells[i][j];
                }
                if (i === 8 && (j === 3 || j === 4)) { // Monter sur le trone
                    p = null;
                    if (Board.cells[i][3.5]) {
                        p = Board.cells[i][3.5];
                    }
                }
                if (p && p.color === piece.color) { // Piece alliée
                    if (piece.type === TYPES_PIECES.AIRPLANE) {
                        continue;
                    }
                    break;
                } else {
                    if (r < 5 && i === 5 && !(j === 2 || j === 5) && piece.type !== TYPES_PIECES.AIRPLANE) { // Pont
                        break;
                    }
                    if (i === 8 && (j === 3 || j === 4)) { // Monter sur le trone
                        if ((c === 3.5 && r === 1 ? 3 : c) === (c === 3.5 && r === 1 ? 4 : c)) { // si une seule colonne à scanner
                            availableMovements.push({r: i, c: 3.5});
                        } else if (j === 3) { // on ajoute la case qu'au premier scan
                            availableMovements.push({r: i, c: 3.5});
                        }
                    } else {
                        availableMovements.push({r: i, c: j});
                    }
                    if (piece.type !== TYPES_PIECES.AIRPLANE && piece.type !== TYPES_PIECES.ENGINEER) {
                        break;
                    } else if (p && p.color !== piece.color && piece.type !== TYPES_PIECES.AIRPLANE) {
                        break;
                    }
                }
            }
        }

        // Vers la gauche
        for (var j = (c === 3.5 && (r === 1 || r === 8) ? 3 : c) - 1; j >= 1; j--) {
            var tmp = j;
            if (r === 1 || r === 8) {
                if (tmp === 4) { // Fausse case
                    continue;
                } else if (tmp === 3) {
                    tmp = 3.5;
                }
            }
            var p = null;
            if (Board.cells[r][tmp]) {
                p = Board.cells[r][tmp];
            }
            if (p && p.color === piece.color) { // Piece alliée
                break;
            } else {
                availableMovements.push({r: r, c: tmp});
                if (piece.type !== TYPES_PIECES.ENGINEER) {
                    break;
                } else if (p && p.color !== piece.color) {
                    break;
                }
            }
        }

        return availableMovements;
    }

    static reset() {
        Board.cells = {};
        Board.piecesNumber = {r: 20, b: 20};
        $('#board').empty();
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 6; j++) {
                var r = i, c = j;
                if (r === 1 || r === 8) {
                    if (c === 4) {
                        continue;
                    }
                }
                var cell = $('<div>').addClass("board_cell");
                cell.append($("<div>"));
                if (r === 1 || r === 8) {
                    if (c === 3) {
                        cell.css({"grid-column": "3/5"});
                        cell.find('> div').css({"width": "50%", "margin": "0.25rem auto"});
                    }
                }
                if (r === 1 || r === 8) {
                    if (c === 3) {
                        c = 3.5;
                    }
                }
                cell.attr('data-r', r);
                cell.attr('data-c', c);
                $('#board').append(cell);
            }
            if (i === 4) {
                $('#board').append($("<div>").css({"grid-column": "1/7"}));
            }
        }
    }

    static pieces = [
        TYPES_PIECES.GENERAL,
        TYPES_PIECES.LIEUTENANT_GENERAL,
        TYPES_PIECES.MAJOR_GENERAL,
        TYPES_PIECES.COLONEL,
        TYPES_PIECES.LIEUTENANT_COLONEL,
        TYPES_PIECES.MAJOR,
        TYPES_PIECES.CAPTAIN,
        TYPES_PIECES.CAPTAIN,
        TYPES_PIECES.FIRST_LIEUTENANT,
        TYPES_PIECES.FIRST_LIEUTENANT,
        TYPES_PIECES.SECOND_LIEUTENANT,
        TYPES_PIECES.SECOND_LIEUTENANT,
        TYPES_PIECES.AIRPLANE,
        TYPES_PIECES.AIRPLANE,
        TYPES_PIECES.TANK,
        TYPES_PIECES.TANK,
        TYPES_PIECES.CAVALRY,
        TYPES_PIECES.ENGINEER,
        TYPES_PIECES.ENGINEER,
        TYPES_PIECES.MINE,
        TYPES_PIECES.MINE,
        TYPES_PIECES.REGIMENT,
        TYPES_PIECES.SPY
    ];

    static fightPieces(first, second) {
        var f = {};
        f[TYPES_PIECES.SPY] = {};
        f[TYPES_PIECES.SPY][TYPES_PIECES.GENERAL] = true;
        f[TYPES_PIECES.AIRPLANE] = {};
        f[TYPES_PIECES.AIRPLANE][TYPES_PIECES.COLONEL] = true;
        f[TYPES_PIECES.AIRPLANE][TYPES_PIECES.LIEUTENANT_COLONEL] = true;
        f[TYPES_PIECES.AIRPLANE][TYPES_PIECES.MAJOR] = true;
        f[TYPES_PIECES.AIRPLANE][TYPES_PIECES.CAPTAIN] = true;
        f[TYPES_PIECES.AIRPLANE][TYPES_PIECES.FIRST_LIEUTENANT] = true;
        f[TYPES_PIECES.AIRPLANE][TYPES_PIECES.SECOND_LIEUTENANT] = true;
        f[TYPES_PIECES.TANK] = f[TYPES_PIECES.AIRPLANE];
        for (const fi in f) {
            for (const se in f[fi]) {
                if (typeof f[se] === "undefined") {
                    f[se] = {};
                }
                f[se][fi] = !f[fi][se];
            }
        }

        if (typeof f[first] !== "undefined" && typeof f[first][second] !== "undefined") {
            return f[first][second];
        }

        if (first === TYPES_PIECES.MINE) {
            return false;
        } else if (second === TYPES_PIECES.MINE) {
            if (first === TYPES_PIECES.AIRPLANE) {
                return true;
            } else if (first === TYPES_PIECES.ENGINEER) {
                return true;
            }
            return false;
        }

        if (Object.values(TYPES_PIECES).indexOf(first) < Object.values(TYPES_PIECES).indexOf(second)) {
            return true;
        }
        return false;
    }

    static randomPieces() {
        var pieces = Board.pieces.slice().shuffle();
        while (pieces[1] === TYPES_PIECES.MINE || pieces[1] === TYPES_PIECES.REGIMENT || pieces[4] === TYPES_PIECES.MINE || pieces[4] === TYPES_PIECES.REGIMENT) {
            pieces = Board.pieces.slice().shuffle();
        }
        return pieces;
    }

    static getMySidePieces() {
        var pieces = [];

        $('#board > *').slice(24).each(function () {
            var r = parseFloat($(this).attr('data-r')); // Ligne
            var c = parseFloat($(this).attr('data-c')); // Colonne

            pieces.push(Board.cells[r][c].type);
        });

        return pieces;
    }

    static setOpponentSide(pieces) {
        $($("#board > *").slice(0, 23).get().reverse()).each(function () {
            var r = parseFloat($(this).attr('data-r')); // Ligne
            var c = parseFloat($(this).attr('data-c')); // Colonne

            $(this).find('> div').empty();
            var type = pieces.shift();

            var img = $("<img>").attr("src", "/imgs/pieces/b" + type + ".png");
            img.addClass("mw-100 mh-100").css({"user-drag": "none"});
            img.attr("draggable", "false").attr("onmousedown", "return false");
            var div = $('<div>').addClass("w-100 h-100 p-relative text-center piece");
            div.append(img);
            div._droppableSuspicion();
            $(this).find('> div').append(div);

            if (typeof Board.cells[r] === "undefined") {
                Board.cells[r] = {};
            }

            Board.cells[r][c] = {
                color: "b",
                type: type
            };
        });
    }

    static setMySide(pieces) {
        $('#board > *').slice(24).each(function () {
            var r = parseFloat($(this).attr('data-r')); // Ligne
            var c = parseFloat($(this).attr('data-c')); // Colonne

            $(this).find('> div').empty();
            var type = pieces.shift();

            var img = $("<img>").attr("src", "/imgs/pieces/r" + type + ".png");
            img.addClass("mw-100 mh-100").css({"user-drag": "none"});
            img.attr("draggable", "false").attr("onmousedown", "return false");
            var div = $('<div>').addClass("w-100 h-100 p-relative text-center piece");
            div.append(img);
            $(this).find('> div').append(div);

            if (typeof Board.cells[r] === "undefined") {
                Board.cells[r] = {};
            }

            Board.cells[r][c] = {
                color: "r",
                type: type
            };
        });
    }

    static enableChoicePositions() {
        $('#board > *').slice(24).each(function () {
            $(this).find('> div').droppable({
                accept: '.piece',
                over: function (event, ui) {
                    $(event.target).css('z-index', '');
                },
                drop: function (event, ui) {
                    var from = ui.draggable.closest('.board_cell');
                    var to = $(this).closest('.board_cell');
                    var rFrom = parseFloat(from.attr('data-r')); // Ligne
                    var cFrom = parseFloat(from.attr('data-c')); // Colonne
                    var rTo = parseFloat(to.attr('data-r')); // Ligne
                    var cTo = parseFloat(to.attr('data-c')); // Colonne

                    ui.helper.data('dropped', true);
                    ui.draggable.css({left: '', top: ''});
                    ui.draggable.draggable('option', 'revert', false);
                    if ($(this).is(ui.draggable.parent())) {
                        return;
                    }

                    if ($(this).hasClass("hint")) {
                        var tmp = Board.cells[rTo][cTo];
                        Board.cells[rTo][cTo] = Board.cells[rFrom][cFrom];
                        Board.cells[rFrom][cFrom] = tmp;

                        $(this).find('> div').appendTo(ui.draggable.parent());
                        ui.draggable.appendTo($(this));
                    }
                }
            });

            $(this).find('> div > div').draggable({
                containment: 'body',
                cursor: 'move',
                revert: true,
                zIndex: 50,
                start: (event, ui) => {
                    ui.helper.css('z-index', 100);
                    ui.helper.data('dropped', false);

                    var cell = ui.helper.closest(".board_cell");
                    $('.board_cell div.hint').removeClass("hint");
                    var r = parseFloat($(cell).attr('data-r')); // Ligne
                    var c = parseFloat($(cell).attr('data-c')); // Colonne
                    var piece = Board.cells[r][c];

                    for (var i = 5; i <= 8; i++) {
                        for (var j = 1; j <= 6; j++) {
                            var tmp = j;
                            if (i === 8) {
                                if (tmp === 4) {
                                    continue;
                                } else if (tmp === 3) {
                                    tmp = 3.5;
                                }
                            }
                            if (r === i && c === tmp) {
                                continue;
                            }
                            if (i === 5 && (tmp === 2 || tmp === 5)) {
                                if (piece.type === TYPES_PIECES.MINE || piece.type === TYPES_PIECES.REGIMENT) {
                                    continue;
                                }
                            }
                            if (r === 5 && (c === 2 || c === 5)) {
                                var ce = Board.cells[i][tmp];
                                if (ce && (ce.type === TYPES_PIECES.MINE || ce.type === TYPES_PIECES.REGIMENT)) {
                                    continue;
                                }
                            }
                            $('.board_cell[data-r="' + i + '"][data-c="' + tmp + '"]').find('> div').addClass("hint");
                        }
                    }
                },
                stop: function (event, ui) {
                    ui.helper.css('z-index', 50);
                    if (ui.helper.data('dropped') === false) {
                        $(this).css({left: '', top: ''});
                        $(this).draggable('option', 'revert', false);
                    }
                    $('.board_cell div.hint').removeClass("hint");
                }
            });
        });
    }

    static enableGamePositions() {
        $('#board > *').slice(24).each(function () {
            $(this).find('> div > div').draggable({
                containment: 'body',
                cursor: 'move',
                revert: true,
                zIndex: 50,
                start: (event, ui) => {
                    ui.helper.css('z-index', 100);
                    ui.helper.data('dropped', false);

                    var cell = ui.helper.closest(".board_cell");
                    $('.board_cell div.hint').removeClass("hint");
                    var r = parseFloat($(cell).attr('data-r')); // Ligne
                    var c = parseFloat($(cell).attr('data-c')); // Colonne
                    var piece = Board.cells[r][c];

                    var availableMovements = Board.pieceAvailableGameMovements(r, c);
                    for (var movement of availableMovements) {
                        $('.board_cell[data-r="' + movement.r + '"][data-c="' + movement.c + '"]').find('> div').addClass("hint");
                    }
                },
                stop: function (event, ui) {
                    ui.helper.css('z-index', 50);
                    if (ui.helper.data('dropped') === false) {
                        $(this).css({left: '', top: ''});
                        $(this).draggable('option', 'revert', false);
                    }
                    $('.board_cell div.hint').removeClass("hint");
                }
            });

            var r = parseFloat($(this).attr('data-r')); // Ligne
            var c = parseFloat($(this).attr('data-c')); // Colonne
            var piece = Board.cells[r][c];
            if (piece.type === TYPES_PIECES.REGIMENT || piece.type === TYPES_PIECES.MINE) {
                $(this).find('> div > div').draggable({disabled: true});
            }
        });

        $('#board > *').each(function () {
            $(this).find('> div').droppable({
                accept: '.piece',
                over: function (event, ui) {
                    $(event.target).css('z-index', '');
                },
                drop: function (event, ui) {
                    var from = ui.draggable.closest('.board_cell');
                    var to = $(this).closest('.board_cell');
                    var rFrom = parseFloat(from.attr('data-r')); // Ligne
                    var cFrom = parseFloat(from.attr('data-c')); // Colonne
                    var rTo = parseFloat(to.attr('data-r')); // Ligne
                    var cTo = parseFloat(to.attr('data-c')); // Colonne

                    ui.helper.data('dropped', true);
                    ui.draggable.css({left: '', top: ''});
                    ui.draggable.draggable('option', 'revert', false);
                    if ($(this).is(ui.draggable.parent())) {
                        return;
                    }

                    if ($(this).hasClass("hint")) {
                        var droppable = this;

                        if (battle.isMyTurn === false) {
                            Bulb.toast("This is not your turn", {type: "warn"});
                            return;
                        }

                        if (battle instanceof FriendBattle) {
                            battle.next();
                        }
                        Board.pieceMovement(droppable, ui.draggable, rFrom, cFrom, rTo, cTo, function () {
                            if (battle instanceof BotBattle) {
                                battle.next(); // Le bot n'a pas d'animation
                            }
                        });
                        if (battle instanceof FriendBattle) {
                            battle.conn.send(createEvent('battle:piece-movement', {
                                rFrom: 8 - rFrom + 1,
                                cFrom: 6 - cFrom + 1,
                                rTo: 8 - rTo + 1,
                                cTo: 6 - cTo + 1
                            }));
                        }
                    }
                }
            });
        });
    }

    static pieceMovement(droppable, draggable, rFrom, cFrom, rTo, cTo, callback) {
        var attacker = Board.cells[rFrom][cFrom];
        if (typeof Board.cells[rTo][cTo] !== "undefined") {
            var defender = Board.cells[rTo][cTo];
        }

        var defenderWin = false;
        var attackerWin = false;

        if (defender) {
            if (defender.type === TYPES_PIECES.REGIMENT) {
                var subDefender = null;
                if (rTo >= 2 && rTo <= 7) {
                    if (defender.color === "r") {
                        if (typeof Board.cells[rTo + 1][cTo] !== "undefined") {
                            subDefender = Board.cells[rTo + 1][cTo];
                        }
                    } else {
                        if (typeof Board.cells[rTo - 1][cTo] !== "undefined") {
                            subDefender = Board.cells[rTo - 1][cTo];
                        }
                    }
                }

                if (subDefender) {
                    attackerWin = Board.fightPieces(attacker.type, subDefender.type);
                    defenderWin = Board.fightPieces(subDefender.type, attacker.type);
                } else {
                    attackerWin = true;
                }
            } else {
                attackerWin = Board.fightPieces(attacker.type, defender.type);
                defenderWin = Board.fightPieces(defender.type, attacker.type);
            }
        } else {
            attackerWin = true;
        }

        var myPiecesSelector = "#takenRedPieces";
        var opponentPiecesSelector = "#takenBluePieces";
        if (attacker.color === "b") {
            opponentPiecesSelector = "#takenRedPieces";
            myPiecesSelector = "#takenBluePieces";
        }

        var attackerCell = $('.board_cell[data-r="' + rFrom + '"][data-c="' + cFrom + '"]').find('> div');
        var attackerPiece = attackerCell.find("> div");
        var defenderCell = $('.board_cell[data-r="' + rTo + '"][data-c="' + cTo + '"]').find('> div');
        var defenderPiece = defenderCell.find("> div");

        attackerPiece.css('z-index', 100);
        if (defenderPiece.length) {
            defenderPiece.css('z-index', 50);
        }

        var offset = $(defenderCell).offset();
        var distance = Math.sqrt(Math.pow(offset.left - attackerPiece.offset().left, 2) + Math.pow(offset.top - attackerPiece.offset().top, 2));
        attackerPiece.css({width: attackerPiece.width() + "px", height: attackerPiece.height() + "px", position: "fixed"}).removeClass("p-relative");
        attackerPiece.animate({left: offset.left + "px", top: offset.top + "px"}, distance * 1000 / 200, function () {
            if (defenderWin) {
                draggable.remove();
                delete Board.cells[rFrom][cFrom];

                var img = $("<img>").attr("src", "/imgs/pieces/" + attacker.color + attacker.type + ".png");
                img.addClass("w-100").css({"user-drag": "none"});
                $(myPiecesSelector).append($('<div>').addClass("col-xs-3 padding-x05").append(img));
            } else if (attackerWin) {
                attackerPiece.addClass("p-relative").css({width: "", height: "", top: "", left: "", position: ""});
                $(droppable).empty();
                draggable.appendTo($(droppable));
                Board.cells[rTo][cTo] = attacker;
                delete Board.cells[rFrom][cFrom];

                if (defender) {
                    var img = $("<img>").attr("src", "/imgs/pieces/" + defender.color + defender.type + ".png");
                    img.addClass("w-100").css({"user-drag": "none"});
                    $(opponentPiecesSelector).append($('<div>').addClass("col-xs-3 padding-x05").append(img));
                }
            } else {
                $(droppable).empty();
                draggable.remove();
                delete Board.cells[rFrom][cFrom];
                delete Board.cells[rTo][cTo];

                var img = $("<img>").attr("src", "/imgs/pieces/" + defender.color + defender.type + ".png");
                img.addClass("w-100").css({"user-drag": "none"});
                $(opponentPiecesSelector).append($('<div>').addClass("col-xs-3 padding-x05").append(img));

                var img = $("<img>").attr("src", "/imgs/pieces/" + attacker.color + attacker.type + ".png");
                img.addClass("w-100").css({"user-drag": "none"});
                $(myPiecesSelector).append($('<div>').addClass("col-xs-3 padding-x05").append(img));
            }

            if (attackerWin && defender) {
                if (defender.type !== TYPES_PIECES.REGIMENT && defender.type !== TYPES_PIECES.MINE) {
                    Board.piecesNumber[defender.color]--;
                }
            } else if (!attackerWin && !defenderWin) {
                if (defender.type !== TYPES_PIECES.REGIMENT && defender.type !== TYPES_PIECES.MINE) {
                    Board.piecesNumber[defender.color]--;
                }
                if (attacker.type !== TYPES_PIECES.REGIMENT && attacker.type !== TYPES_PIECES.MINE) {
                    Board.piecesNumber[attacker.color]--;
                }
            } else if (!attackerWin) {
                if (attacker.type !== TYPES_PIECES.REGIMENT && attacker.type !== TYPES_PIECES.MINE) {
                    Board.piecesNumber[attacker.color]--;
                }
            }

            if (defender && Board.piecesNumber[defender.color] === 0) {
                victory();
            } else if (Board.piecesNumber[attacker.color] === 0) {
                defeat();
            } else if (attackerWin) {
                if (attacker.color === "r" && rTo === 1 && cTo === 3.5) {
                    if ([TYPES_PIECES.GENERAL, TYPES_PIECES.LIEUTENANT_GENERAL, TYPES_PIECES.MAJOR_GENERAL, TYPES_PIECES.COLONEL, TYPES_PIECES.LIEUTENANT_COLONEL, TYPES_PIECES.MAJOR].includes(attacker.type)) {
                        victory();
                    }
                } else if (attacker.color === "b" && rTo === 8 && cTo === 3.5) {
                    if ([TYPES_PIECES.GENERAL, TYPES_PIECES.LIEUTENANT_GENERAL, TYPES_PIECES.MAJOR_GENERAL, TYPES_PIECES.COLONEL, TYPES_PIECES.LIEUTENANT_COLONEL, TYPES_PIECES.MAJOR].includes(attacker.type)) {
                        defeat();
                    }
                }
            }

            attackerPiece.css('z-index', "");
            if (defenderPiece.length) {
                defenderPiece.css('z-index', "");
            }

            callback();
        });
    }
}
