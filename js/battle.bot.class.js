class BotBattle {
    constructor() {
        this.isMyTurn = false;
    }

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
        for (var j = (c === 3.5 && r === 1 ? 3 : c); j <= (c === 3.5 && r === 1 ? 4 : c); j++) {
            for (var i = r + 1; i <= 8; i++) {
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

        // Vers le bas
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
                        break;
                    } else if (p && p.color !== piece.color && piece.type !== TYPES_PIECES.AIRPLANE) {
                        break;
                    }
                }
            }
        }

        // Vers la gauche
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
                if (piece.type !== TYPES_PIECES.ENGINEER) {
                    break;
                } else if (p && p.color !== piece.color) {
                    break;
                }
            }
        }

        return availableMovements;
    }

    next() {
        if (this.isMyTurn === false) {
            this.isMyTurn = true;
        } else {
            this.isMyTurn = false;

            var pieces = [];
            for (var r in Board.cells) {
                for (var c in Board.cells[r]) {
                    if (Board.cells[r][c]) {
                        if (Board.cells[r][c].color === "b") {
                            var tmp = BotBattle.pieceAvailableGameMovements(r, c);
                            if (tmp.length) {
                                pieces.push({
                                    r: r,
                                    c: c,
                                    availableMovements: tmp
                                });
                            }
                        }
                    }
                }
            }
            if (pieces.length === 0) { // garde fou
                return;
            }
            var piece = pieces[Math.floor(Math.random() * pieces.length)];
            var movement = piece.availableMovements[Math.floor(Math.random() * piece.availableMovements.length)];
            var droppable = $('.board_cell[data-r="' + movement.r + '"][data-c="' + movement.c + '"]').find('> div'); // Destination
            var draggable = $('.board_cell[data-r="' + piece.r + '"][data-c="' + piece.c + '"]').find('> div > div'); // Piece
            Board.pieceMovement(droppable, draggable, piece.r, piece.c, movement.r, movement.c, () => {
                this.next();
            });
        }
    }
}
